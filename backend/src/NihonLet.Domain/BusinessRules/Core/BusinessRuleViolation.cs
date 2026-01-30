namespace NihonLet.Domain.BusinessRules.Core;

/// <summary>
/// Chi tiết vi phạm Business Rule
/// </summary>
public record BusinessRuleViolation
{
    /// <summary>Mã định danh rule</summary>
    public string RuleCode { get; init; } = null!;
    
    /// <summary>Mô tả rule (cho Dev/Admin)</summary>
    public string Description { get; init; } = null!;
    
    /// <summary>Thông báo lỗi (cho User)</summary>
    public string UserMessage { get; init; } = null!;
    
    public BusinessRuleViolation(string ruleCode, string description, string userMessage)
    {
        RuleCode = ruleCode;
        Description = description;
        UserMessage = userMessage;
    }
}
