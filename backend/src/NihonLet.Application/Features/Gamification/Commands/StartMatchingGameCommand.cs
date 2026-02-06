using MediatR;
using NihonLet.Application.Features.Gamification.DTOs;
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

        // 1. RULE: Tối đa 3 bộ thẻ (GAME_001)
        var maxDecksRule = new MaxDecksPerGameRule(request.SelectedDeckIds.Count);
        if (!maxDecksRule.IsSatisfied())
            throw new Exception(maxDecksRule.ViolationMessage);

        // Lấy thông tin các bộ thẻ đã chọn từ DB để đếm tổng số card
        var selectedDecks = await _deckRepository.GetDecksByIdsAsync(request.SelectedDeckIds);
        int totalCards = selectedDecks.Sum(d => d.Cards.Count);

        // 2. RULE: Tối thiểu 5 thẻ để chơi (GAME_002)
        var minCardsRule = new MinimumCardsToPlayRule(totalCards);
        if (!minCardsRule.IsSatisfied())
            throw new Exception(minCardsRule.ViolationMessage);

        return true; // Hợp lệ để bắt đầu game
    }
}