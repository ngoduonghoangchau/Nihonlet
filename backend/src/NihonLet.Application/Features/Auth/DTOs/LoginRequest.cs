using System.ComponentModel.DataAnnotations;

namespace NihonLet.Application.Features.Auth.DTOs;

/// <summary>
/// Request đăng nhập
/// </summary>
public record LoginRequest
{
    /// <summary>Email đăng nhập</summary>
    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; init; } = null!;
    
    /// <summary>Mật khẩu</summary>
    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    public string Password { get; init; } = null!;
}
