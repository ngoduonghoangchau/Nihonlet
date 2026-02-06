using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Gamification.DTOs;
using NihonLet.Domain.Interfaces;

namespace NihonLet.Application.Features.Gamification.Queries;

public record GetDecksForGameQuery : IRequest<List<GameDeckDto>>;

public class GetDecksForGameQueryHandler : IRequestHandler<GetDecksForGameQuery, List<GameDeckDto>>
{
    private readonly IDeckRepository _deckRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetDecksForGameQueryHandler(IDeckRepository deckRepository, ICurrentUserService currentUserService)
    {
        _deckRepository = deckRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<GameDeckDto>> Handle(GetDecksForGameQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var decks = await _deckRepository.GetDecksByUserIdAsync(userId!);

        return decks.Select(d => new GameDeckDto {
            Id = d.DeckId,
            Title = d.Title,
            Description = d.Description,
            CardsCount = d.Cards.Count
        }).ToList();
    }
}