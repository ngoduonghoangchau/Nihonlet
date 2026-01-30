namespace NihonLet.Domain.Enums;

/// <summary>
/// Trạng thái gói cước đăng ký của người dùng
/// </summary>
public enum SubscriptionStatus
{
    /// <summary>Đang hoạt động</summary>
    Active,
    
    /// <summary>Đã hết hạn</summary>
    Expired,
    
    /// <summary>Đã hủy</summary>
    Cancelled
}
