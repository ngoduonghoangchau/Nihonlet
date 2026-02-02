using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Flashcards.DTOs;
using NihonLet.Domain.Interfaces;

namespace NihonLet.Application.Features.Flashcards.Queries.GetDecks;

public record GetDecksQuery : IRequest<List<DeckDto>>;

public class GetDecksQueryHandler : IRequestHandler<GetDecksQuery, List<DeckDto>>
{
    private readonly IDeckRepository _deckRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetDecksQueryHandler(IDeckRepository deckRepository, ICurrentUserService currentUserService)
    {
        _deckRepository = deckRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<DeckDto>> Handle(GetDecksQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        
        var decks = await _deckRepository.GetDecksByUserIdAsync(userId!);

        return decks.Select(d => new DeckDto {
            DeckId = d.DeckId,
            Title = d.Title,
            Description = d.Description,
            CardsCount = d.Cards?.Count ?? 0,
            MasteryPercent = d.MasteryPercent,
            IsBulkCreated = d.IsBulkCreated
        }).ToList();
    }
}