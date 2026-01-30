using NihonLet.Domain.BusinessRules.Core;

namespace NihonLet.Application.Common.Exceptions;

/// <summary>
/// Exception khi Business Rule bị vi phạm
/// </summary>
public class BusinessRuleException : Exception
{
    public IReadOnlyList<BusinessRuleViolation> Violations { get; }
    
    public BusinessRuleException(IReadOnlyList<BusinessRuleViolation> violations)
        : base(BuildMessage(violations))
    {
        Violations = violations;
    }
    
    public BusinessRuleException(BusinessRuleViolation violation)
        : this([violation])
    {
    }
    
    private static string BuildMessage(IReadOnlyList<BusinessRuleViolation> violations)
    {
        var messages = violations.Select(v => $"[{v.RuleCode}] {v.UserMessage}");
        return string.Join("; ", messages);
    }
}
