namespace NihonLet.Application.Features.Auth.DTOs;

/// <summary>
/// Thông tin session/device để hiển thị trong "Active Sessions"
/// </summary>
public record SessionDto
{
  /// <summary>ID của session (token ID)</summary>
  public Guid Id { get; init; }

  /// <summary>Tên thiết bị (e.g., "Chrome on Windows 11")</summary>
  public string? DeviceName { get; init; }

  /// <summary>Device fingerprint (masked for security)</summary>
  public string DeviceFingerprint { get; init; } = null!;

  /// <summary>IP address khi tạo session</summary>
  public string? IpAddress { get; init; }

  /// <summary>Thời điểm đăng nhập</summary>
  public DateTime CreatedAt { get; init; }

  /// <summary>Lần cuối hoạt động</summary>
  public DateTime LastUsedAt { get; init; }

  /// <summary>Session này có phải là session hiện tại không</summary>
  public bool IsCurrent { get; init; }

  /// <summary>
  /// Mask fingerprint để hiển thị an toàn (chỉ hiện 8 ký tự đầu + ...)
  /// </summary>
  public static string MaskFingerprint(string fingerprint)
  {
    if (string.IsNullOrEmpty(fingerprint) || fingerprint.Length <= 8)
      return fingerprint;

    return fingerprint[..8] + "...";
  }
}
