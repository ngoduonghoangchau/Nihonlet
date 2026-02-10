using MediatR;
using NihonLet.Application.Common.Exceptions;
using NihonLet.Domain.BusinessRules.Core;
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
        var decks = await _deckRepository.GetDecksByIdsAsync(request.SelectedDeckIds);
        var totalCards = decks.Sum(d => d.Cards.Count);

        var ruleResult = new BusinessRuleChecker()
            .AddRule(new MaxDecksPerGameRule(request.SelectedDeckIds.Count))
            .AddRule(new MinimumCardsToPlayRule(totalCards))
            .Check();

        if (!ruleResult.IsValid)
            throw new BusinessRuleException(ruleResult.Violations);

        return true;
    }
}