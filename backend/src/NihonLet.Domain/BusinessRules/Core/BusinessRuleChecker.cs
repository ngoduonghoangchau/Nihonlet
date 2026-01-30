namespace NihonLet.Domain.BusinessRules.Core;

/// <summary>
/// Fluent API để kiểm tra nhiều Business Rules cùng lúc
/// </summary>
public class BusinessRuleChecker
{
    private readonly List<IBusinessRule> _rules = [];

    /// <summary>
    /// Thêm rule vào danh sách kiểm tra
    /// </summary>
    public BusinessRuleChecker AddRule(IBusinessRule rule)
    {
        _rules.Add(rule);
        return this;
    }

    /// <summary>
    /// Kiểm tra và trả về kết quả (không throw exception)
    /// </summary>
    public BusinessRuleResult Check()
    {
        var violations = _rules
            .Where(r => !r.IsSatisfied())
            .Select(r => new BusinessRuleViolation(
                r.RuleCode, 
                r.Description, 
                r.ViolationMessage))
            .ToList();

        return violations.Count == 0 
            ? BusinessRuleResult.Success() 
            : BusinessRuleResult.Failure(violations);
    }
    
    /// <summary>
    /// Lấy danh sách violations (dùng cho logging/exceptions)
    /// </summary>
    public IReadOnlyList<BusinessRuleViolation> GetViolations()
    {
        return _rules
            .Where(r => !r.IsSatisfied())
            .Select(r => new BusinessRuleViolation(
                r.RuleCode, 
                r.Description, 
                r.ViolationMessage))
            .ToList();
    }
}
