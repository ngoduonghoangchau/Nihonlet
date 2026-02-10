using MediatR;
using NihonLet.Application.Common.Exceptions;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Flashcards.DTOs;
using NihonLet.Domain.BusinessRules.Core;
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
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException();

        var request = command.Request;
        var isPremium = _currentUserService.IsPremium;

        // Sử dụng BusinessRuleChecker để kiểm tra tất cả rules cùng lúc
        var checker = new BusinessRuleChecker()
            .AddRule(new DeckTitleLengthRule(request.Title));

        if (request.IsBulkCreated)
            checker.AddRule(new BulkCreatePremiumOnlyRule(isPremium));

        if (!isPremium)
        {
            var currentDeckCount = await _deckRepository.GetCountByUserIdAsync(userId);
            checker.AddRule(new FreeUserDeckLimitRule(currentDeckCount));
        }

        var ruleResult = checker.Check();
        if (!ruleResult.IsValid)
            throw new BusinessRuleException(ruleResult.Violations);

        var deck = new Deck
        {
            UserId = userId,
            Title = request.Title,
            Description = request.Description,
            IsBulkCreated = request.IsBulkCreated,
            CreatedAt = DateTime.UtcNow,
            Cards = request.Cards.Select(c => new Card
            {
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