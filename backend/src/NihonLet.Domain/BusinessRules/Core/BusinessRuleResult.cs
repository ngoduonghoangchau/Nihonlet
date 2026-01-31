namespace NihonLet.Domain.BusinessRules.Core;

/// <summary>
/// Kết quả kiểm tra Business Rules
/// </summary>
public record BusinessRuleResult
{
    /// <summary>Rules có được thỏa mãn tất cả không</summary>
    public bool IsValid { get; init; }
    
    /// <summary>Danh sách các vi phạm (nếu có)</summary>
    public IReadOnlyList<BusinessRuleViolation> Violations { get; init; }
    
    public BusinessRuleResult(bool isValid, IReadOnlyList<BusinessRuleViolation> violations)
    {
        IsValid = isValid;
        Violations = violations;
    }
    
    /// <summary>Kết quả thành công (không có vi phạm)</summary>
    public static BusinessRuleResult Success() 
        => new(true, []);
    
    /// <summary>Kết quả thất bại với danh sách vi phạm</summary>
    public static BusinessRuleResult Failure(IReadOnlyList<BusinessRuleViolation> violations) 
        => new(false, violations);
}
