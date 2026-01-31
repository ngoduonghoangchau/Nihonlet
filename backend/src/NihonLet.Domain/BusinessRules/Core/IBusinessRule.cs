namespace NihonLet.Domain.BusinessRules.Core;

/// <summary>
/// Interface cho tất cả Business Rules trong hệ thống.
/// Mỗi rule được định nghĩa bằng ngôn ngữ tự nhiên để dễ đọc và bảo trì.
/// </summary>
public interface IBusinessRule
{
    /// <summary>
    /// Mã định danh rule (dùng cho logging và tracking)
    /// VD: DECK_001, GAME_002, PAY_001
    /// </summary>
    string RuleCode { get; }
    
    /// <summary>
    /// Mô tả rule bằng tiếng Việt (cho Admin và Developer)
    /// </summary>
    string Description { get; }
    
    /// <summary>
    /// Thông báo lỗi thân thiện khi rule bị vi phạm (cho End User)
    /// </summary>
    string ViolationMessage { get; }
    
    /// <summary>
    /// Kiểm tra rule có thỏa mãn không
    /// </summary>
    /// <returns>true nếu rule được thỏa mãn, false nếu vi phạm</returns>
    bool IsSatisfied();
}
