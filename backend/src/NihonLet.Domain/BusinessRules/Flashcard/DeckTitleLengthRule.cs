using NihonLet.Domain.BusinessRules.Core;
using NihonLet.Domain.Constants;

namespace NihonLet.Domain.BusinessRules.Flashcard;

/// <summary>
/// RULE: Tên bộ thẻ phải từ 3-100 ký tự
/// </summary>
public class DeckTitleLengthRule : IBusinessRule
{
    private readonly string? _title;
    private readonly int _minLength;
    private readonly int _maxLength;

    public DeckTitleLengthRule(string? title)
    {
        _title = title;
        _minLength = AppConstants.Flashcard.MinDeckTitleLength;
        _maxLength = AppConstants.Flashcard.MaxDeckTitleLength;
    }

    public string RuleCode => "DECK_002";
    
    public string Description => 
        $"Tên bộ thẻ phải từ {_minLength} đến {_maxLength} ký tự";
    
    public string ViolationMessage => 
        $"Tên bộ thẻ không hợp lệ. Vui lòng nhập từ {_minLength}-{_maxLength} ký tự.";

    public bool IsSatisfied() => 
        !string.IsNullOrWhiteSpace(_title) && 
        _title.Length >= _minLength && 
        _title.Length <= _maxLength;
}
