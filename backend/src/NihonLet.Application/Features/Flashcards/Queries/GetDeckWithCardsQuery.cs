using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Interfaces;
using NihonLet.Application.Features.Flashcards.DTOs; 

public record GetDeckWithCardsQuery(int DeckId) : IRequest<DeckDetailsDto?>;

public class GetDeckWithCardsHandler : IRequestHandler<GetDeckWithCardsQuery, DeckDetailsDto?>
{
    private readonly IDeckRepository _deckRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetDeckWithCardsHandler(IDeckRepository deckRepository, ICurrentUserService currentUserService)
    {
        _deckRepository = deckRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DeckDetailsDto?> Handle(GetDeckWithCardsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId)) return null;

        var deck = await _deckRepository.GetByIdWithCardsAsync(request.DeckId, userId);

        if (deck == null) return null;

        return new DeckDetailsDto
        {
            DeckId = deck.DeckId,
            Title = deck.Title,
            Description = deck.Description,
            Cards = deck.Cards.Select(c => new CardDto
            {
                CardId = c.CardId,
                Kanji = c.Kanji,
                Reading = c.Reading,
                Meaning = c.Meaning,
                ExampleSentence = c.ExampleSentence,
                ExampleTranslation = c.ExampleTranslation
            }).ToList()
        };
    }
}