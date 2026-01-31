namespace NihonLet.Application.Features.Auth.DTOs;

/// <summary>
/// DTO thông tin user (không chứa sensitive data)
/// </summary>
public record ApplicationUserDto
{
    /// <summary>ID user</summary>
    public string Id { get; init; } = null!;
    
    /// <summary>Email</summary>
    public string Email { get; init; } = null!;
    
    /// <summary>Họ tên đầy đủ</summary>
    public string FullName { get; init; } = null!;
    
    /// <summary>Cấp độ hiện tại</summary>
    public int Level { get; init; }
    
    /// <summary>Tổng XP</summary>
    public int CurrentXp { get; init; }
    
    /// <summary>Đường dẫn avatar</summary>
    public string? AvatarUrl { get; init; }
    
    /// <summary>Danh sách roles</summary>
    public IEnumerable<string> Roles { get; init; } = [];
    
    /// <summary>Có phải Premium không</summary>
    public bool IsPremium { get; init; }
}
