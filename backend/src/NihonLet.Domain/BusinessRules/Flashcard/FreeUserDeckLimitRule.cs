using NihonLet.Domain.BusinessRules.Core;
using NihonLet.Domain.Constants;

namespace NihonLet.Domain.BusinessRules.Flashcard;

/// <summary>
/// RULE: Người dùng FREE chỉ được tạo tối đa 10 bộ thẻ
/// </summary>
public class FreeUserDeckLimitRule : IBusinessRule
{
    private readonly int _currentDeckCount;
    private readonly int _maxDecks;

    public FreeUserDeckLimitRule(int currentDeckCount)
    {
        _currentDeckCount = currentDeckCount;
        _maxDecks = AppConstants.FreeTier.MaxDecks;
    }

    public string RuleCode => "DECK_001";
    
    public string Description => 
        $"Người dùng FREE chỉ được tạo tối đa {_maxDecks} bộ thẻ";
    
    public string ViolationMessage => 
        $"Bạn đã đạt giới hạn {_maxDecks} bộ thẻ. " +
        $"Nâng cấp Premium để tạo không giới hạn!";

    public bool IsSatisfied() => _currentDeckCount < _maxDecks;
}
