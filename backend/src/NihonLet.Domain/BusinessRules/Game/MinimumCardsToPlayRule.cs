using NihonLet.Domain.BusinessRules.Core;
using NihonLet.Domain.Constants;

namespace NihonLet.Domain.BusinessRules.Game;

/// <summary>
/// RULE: Bộ thẻ phải có ít nhất 5 thẻ để chơi game
/// </summary>
public class MinimumCardsToPlayRule : IBusinessRule
{
    private readonly int _totalCards;
    private readonly int _minCards;

    public MinimumCardsToPlayRule(int totalCards)
    {
        _totalCards = totalCards;
        _minCards = AppConstants.MatchingGame.MinCardsToPlay;
    }

    public string RuleCode => "GAME_002";
    
    public string Description => 
        $"Cần ít nhất {_minCards} thẻ từ các bộ đã chọn để bắt đầu game";
    
    public string ViolationMessage => 
        $"Các bộ thẻ bạn chọn chỉ có {_totalCards} thẻ. " +
        $"Cần ít nhất {_minCards} thẻ để chơi!";

    public bool IsSatisfied() => _totalCards >= _minCards;
}
