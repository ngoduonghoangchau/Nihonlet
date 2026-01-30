namespace NihonLet.Domain.Enums;

/// <summary>
/// Trạng thái khóa/mở của nội dung học tập
/// </summary>
public enum ContentStatus
{
    /// <summary>Nội dung đã mở khóa</summary>
    Unlocked,
    
    /// <summary>Nội dung bị khóa (chỉ Premium mới xem được)</summary>
    Locked
}
