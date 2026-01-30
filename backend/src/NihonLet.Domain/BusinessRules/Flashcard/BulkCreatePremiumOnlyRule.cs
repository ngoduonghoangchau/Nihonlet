using NihonLet.Domain.BusinessRules.Core;

namespace NihonLet.Domain.BusinessRules.Flashcard;

/// <summary>
/// RULE: Chỉ Premium mới được dùng tính năng Bulk Create
/// </summary>
public class BulkCreatePremiumOnlyRule : IBusinessRule
{
    private readonly bool _isPremiumUser;

    public BulkCreatePremiumOnlyRule(bool isPremiumUser)
    {
        _isPremiumUser = isPremiumUser;
    }

    public string RuleCode => "DECK_003";
    
    public string Description => "Tính năng Bulk Create (tạo nhiều thẻ cùng lúc) chỉ dành cho Premium";
    
    public string ViolationMessage => 
        "Tính năng Bulk Create chỉ dành cho thành viên Premium. " +
        "Nâng cấp ngay với chỉ 29.000đ/tháng!";

    public bool IsSatisfied() => _isPremiumUser;
}
