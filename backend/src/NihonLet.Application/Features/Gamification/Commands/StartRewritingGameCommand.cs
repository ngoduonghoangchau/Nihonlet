using MediatR;
using NihonLet.Application.Features.Gamification.DTOs;
using NihonLet.Domain.BusinessRules.Game;
using NihonLet.Domain.Interfaces;

namespace NihonLet.Application.Features.Gamification.Commands;

public record StartRewritingGameCommand(List<int> SelectedDeckIds) : IRequest<bool>;

public class StartRewritingGameCommandHandler : IRequestHandler<StartRewritingGameCommand, bool>
{
    private readonly IDeckRepository _deckRepository;

    public StartRewritingGameCommandHandler(IDeckRepository deckRepository)
    {
        _deckRepository = deckRepository;
    }

    public async Task<bool> Handle(StartRewritingGameCommand request, CancellationToken ct)
    {
        // 1. Kiểm tra số lượng bộ thẻ chọn (Rule GAME_001)
        var maxDecksRule = new MaxDecksPerGameRule(request.SelectedDeckIds.Count);
        if (!maxDecksRule.IsSatisfied()) throw new Exception(maxDecksRule.ViolationMessage);

        // 2. kiểm tra số lượng Card (Rule GAME_002)
        var decks = await _deckRepository.GetDecksByIdsAsync(request.SelectedDeckIds);
        int totalCards = decks.Sum(d => d.Cards.Count);

        var minCardsRule = new MinimumCardsToPlayRule(totalCards);
        if (!minCardsRule.IsSatisfied()) throw new Exception(minCardsRule.ViolationMessage);

        return true;
    }
}