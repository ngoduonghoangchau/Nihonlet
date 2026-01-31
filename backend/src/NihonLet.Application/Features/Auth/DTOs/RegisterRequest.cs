using System.ComponentModel.DataAnnotations;

namespace NihonLet.Application.Features.Auth.DTOs;

/// <summary>
/// Request đăng ký tài khoản mới
/// </summary>
public record RegisterRequest
{
    /// <summary>Email đăng nhập</summary>
    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; init; } = null!;
    
    /// <summary>Mật khẩu</summary>
    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    [MinLength(8, ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự")]
    public string Password { get; init; } = null!;
    
    /// <summary>Xác nhận mật khẩu</summary>
    [Required(ErrorMessage = "Xác nhận mật khẩu là bắt buộc")]
    [Compare(nameof(Password), ErrorMessage = "Mật khẩu xác nhận không khớp")]
    public string ConfirmPassword { get; init; } = null!;
    
    /// <summary>Họ tên đầy đủ</summary>
    [Required(ErrorMessage = "Họ tên là bắt buộc")]
    [MaxLength(100, ErrorMessage = "Họ tên không được vượt quá 100 ký tự")]
    public string FullName { get; init; } = null!;
}
