using NihonLet.Domain.BusinessRules.Core;
using NihonLet.Domain.Constants;

namespace NihonLet.Domain.BusinessRules.Game;

/// <summary>
/// RULE: Game Matching chỉ cho phép chọn tối đa 3 bộ thẻ
/// </summary>
public class MaxDecksPerGameRule : IBusinessRule
{
    private readonly int _selectedDecksCount;
    private readonly int _maxDecks;

    public MaxDecksPerGameRule(int selectedDecksCount)
    {
        _selectedDecksCount = selectedDecksCount;
        _maxDecks = AppConstants.MatchingGame.MaxDecksPerGame;
    }

    public string RuleCode => "GAME_001";
    
    public string Description => 
        $"Mỗi lượt chơi Matching chỉ được chọn tối đa {_maxDecks} bộ thẻ";
    
    public string ViolationMessage => 
        $"Bạn đã chọn {_selectedDecksCount} bộ thẻ. Tối đa chỉ được {_maxDecks} bộ!";

    public bool IsSatisfied() => _selectedDecksCount <= _maxDecks;
}
