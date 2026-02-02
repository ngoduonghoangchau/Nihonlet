using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Flashcards.DTOs;
using NihonLet.Domain.BusinessRules.Flashcard;
using NihonLet.Domain.Entities.Flashcard;
using NihonLet.Domain.Interfaces;

namespace NihonLet.Application.Features.Flashcards.Commands;

public record CreateDeckCommand(CreateDeckRequest Request) : IRequest<int>;

public class CreateDeckCommandHandler : IRequestHandler<CreateDeckCommand, int>
{
    private readonly IDeckRepository _deckRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateDeckCommandHandler(IDeckRepository deckRepository, ICurrentUserService currentUserService)
    {
        _deckRepository = deckRepository;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(CreateDeckCommand command, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException();

        var request = command.Request;
        var isPremium = _currentUserService.IsPremium; // Lấy từ thực tế hệ thống

        // RULE 1: Kiểm tra độ dài tiêu đề (NihonLet.Domain.BusinessRules.Flashcard)
        var titleRule = new DeckTitleLengthRule(request.Title);
        if (!titleRule.IsSatisfied()) throw new Exception(titleRule.ViolationMessage);

        // RULE 2: Kiểm tra Bulk Create (NihonLet.Domain.BusinessRules.Flashcard)
        if (request.IsBulkCreated)
        {
            var bulkRule = new BulkCreatePremiumOnlyRule(isPremium);
            if (!bulkRule.IsSatisfied()) throw new Exception(bulkRule.ViolationMessage);
        }

        // RULE 3: Kiểm tra giới hạn 10 bộ thẻ cho người dùng FREE
        if (!isPremium)
        {
            // Truy vấn Database thực tế để đếm số bộ thẻ đã có
            int currentDeckCount = await _deckRepository.GetCountByUserIdAsync(userId);
            var freeLimitRule = new FreeUserDeckLimitRule(currentDeckCount);
            if (!freeLimitRule.IsSatisfied()) throw new Exception(freeLimitRule.ViolationMessage);
        }

        var deck = new Deck
        {
            UserId = userId,
            Title = request.Title,
            Description = request.Description,
            IsBulkCreated = request.IsBulkCreated,
            CreatedAt = DateTime.UtcNow,
            Cards = request.Cards.Select(c => new Card {
                Reading = c.Reading,
                Kanji = c.Kanji,
                Meaning = c.Meaning,
                ExampleSentence = c.ExampleSentence
            }).ToList()
        };

        await _deckRepository.AddAsync(deck);
        await _deckRepository.SaveChangesAsync();

        return deck.DeckId;
    }
}