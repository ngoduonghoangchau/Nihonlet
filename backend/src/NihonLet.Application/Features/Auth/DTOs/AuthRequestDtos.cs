using System.ComponentModel.DataAnnotations;

namespace NihonLet.Application.Features.Auth.DTOs;

/// <summary>
/// Request đăng ký kèm device info
/// </summary>
public record RegisterWithDeviceRequest
{
  /// <summary>Thông tin đăng ký</summary>
  [Required]
  public RegisterRequest Register { get; init; } = null!;

  /// <summary>Thông tin thiết bị</summary>
  [Required]
  public DeviceInfoDto DeviceInfo { get; init; } = null!;
}

/// <summary>
/// Request đăng nhập kèm device info
/// </summary>
public record LoginWithDeviceRequest
{
  /// <summary>Thông tin đăng nhập</summary>
  [Required]
  public LoginRequest Login { get; init; } = null!;

  /// <summary>Thông tin thiết bị</summary>
  [Required]
  public DeviceInfoDto DeviceInfo { get; init; } = null!;
}

/// <summary>
/// Request đăng nhập bằng Google OAuth
/// </summary>
public record GoogleLoginRequest
{
  /// <summary>Google ID Token từ frontend</summary>
  [Required]
  public string IdToken { get; init; } = null!;

  /// <summary>Thông tin thiết bị</summary>
  [Required]
  public DeviceInfoDto DeviceInfo { get; init; } = null!;
}

/// <summary>
/// Response trả về cho client (không có refresh token vì đã trong cookie)
/// </summary>
public record AuthResponseDto
{
  /// <summary>Access token JWT</summary>
  public string AccessToken { get; init; } = null!;

  /// <summary>Thời điểm access token hết hạn</summary>
  public DateTime ExpiresAt { get; init; }

  /// <summary>Thông tin user</summary>
  public ApplicationUserDto User { get; init; } = null!;
}
