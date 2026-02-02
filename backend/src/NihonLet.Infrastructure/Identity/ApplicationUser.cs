using Microsoft.AspNetCore.Identity;
using NihonLet.Domain.Entities.Identity;

namespace NihonLet.Infrastructure.Identity;

/// <summary>
/// Mở rộng IdentityUser với các trường đặc thù của NihonLet
/// </summary>
public class ApplicationUser : IdentityUser
{
    /// <summary>Họ tên đầy đủ hiển thị trên giao diện</summary>
    public string FullName { get; set; } = null!;

    /// <summary>Tổng kinh nghiệm tích lũy</summary>
    public int CurrentXp { get; set; } = 0;

    /// <summary>Cấp độ hiện tại</summary>
    public int Level { get; set; } = 1;

    /// <summary>Đường dẫn ảnh đại diện</summary>
    public string? AvatarUrl { get; set; }

    /// <summary>Ngày đăng ký</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Danh sách refresh tokens (sessions) của user</summary>
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    
    public bool IsPremium { get; set; } = false; // Thuộc tính thực tế trong DB

}
