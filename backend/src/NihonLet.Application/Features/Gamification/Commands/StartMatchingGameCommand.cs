using MediatR;
using NihonLet.Application.Common.Exceptions;
using NihonLet.Application.Features.Gamification.DTOs;
using NihonLet.Domain.BusinessRules.Core;
using NihonLet.Domain.BusinessRules.Game;
using NihonLet.Domain.Interfaces;

namespace NihonLet.Application.Features.Gamification.Commands;

public record StartMatchingGameCommand(GameStartRequest Request) : IRequest<bool>;

public class StartMatchingGameCommandHandler : IRequestHandler<StartMatchingGameCommand, bool>
{
    private readonly IDeckRepository _deckRepository;

    public StartMatchingGameCommandHandler(IDeckRepository deckRepository)
    {
        _deckRepository = deckRepository;
    }

    public async Task<bool> Handle(StartMatchingGameCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;
        var selectedDecks = await _deckRepository.GetDecksByIdsAsync(request.SelectedDeckIds);
        var totalCards = selectedDecks.Sum(d => d.Cards.Count);

        var ruleResult = new BusinessRuleChecker()
            .AddRule(new MaxDecksPerGameRule(request.SelectedDeckIds.Count))
            .AddRule(new MinimumCardsToPlayRule(totalCards))
            .Check();

        if (!ruleResult.IsValid)
            throw new BusinessRuleException(ruleResult.Violations);

        return true;
    }
}