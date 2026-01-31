using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace NihonLet.Application.Features.Auth.DTOs;

/// <summary>
/// Thông tin thiết bị từ client để tracking sessions
/// </summary>
public partial record DeviceInfoDto
{
  /// <summary>
  /// Device fingerprint - unique identifier cho mỗi thiết bị.
  /// Chỉ chấp nhận alphanumeric, hyphen, underscore. Độ dài 16-256 ký tự.
  /// </summary>
  [Required(ErrorMessage = "Device fingerprint là bắt buộc.")]
  [StringLength(256, MinimumLength = 16, ErrorMessage = "Device fingerprint phải từ 16-256 ký tự.")]
  [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Device fingerprint chỉ được chứa chữ cái, số, gạch ngang và gạch dưới.")]
  public string Fingerprint { get; init; } = null!;

  /// <summary>
  /// Tên thiết bị hiển thị (e.g., "Chrome on Windows 11").
  /// Tùy chọn, max 100 ký tự, sẽ được sanitize.
  /// </summary>
  [StringLength(100, ErrorMessage = "Tên thiết bị tối đa 100 ký tự.")]
  public string? DeviceName { get; init; }

  /// <summary>
  /// Validate và sanitize device info
  /// </summary>
  public static DeviceInfoDto? ValidateAndSanitize(DeviceInfoDto? input)
  {
    if (input == null) return null;

    // Validate fingerprint format
    if (string.IsNullOrWhiteSpace(input.Fingerprint) ||
        input.Fingerprint.Length < 16 ||
        input.Fingerprint.Length > 256 ||
        !FingerprintRegex().IsMatch(input.Fingerprint))
    {
      return null;
    }

    // Sanitize device name - remove dangerous characters
    string? sanitizedName = null;
    if (!string.IsNullOrWhiteSpace(input.DeviceName))
    {
      sanitizedName = SanitizeDeviceName(input.DeviceName);
      if (sanitizedName.Length > 100)
      {
        sanitizedName = sanitizedName[..100];
      }
    }

    return new DeviceInfoDto
    {
      Fingerprint = input.Fingerprint,
      DeviceName = sanitizedName
    };
  }

  /// <summary>
  /// Sanitize device name - loại bỏ các ký tự nguy hiểm
  /// </summary>
  private static string SanitizeDeviceName(string name)
  {
    // Remove control characters and dangerous HTML/script characters
    var sanitized = DangerousCharsRegex().Replace(name, "");
    return sanitized.Trim();
  }

  [GeneratedRegex(@"^[a-zA-Z0-9_-]+$")]
  private static partial Regex FingerprintRegex();

  [GeneratedRegex(@"[<>""'\x00-\x1F\x7F]")]
  private static partial Regex DangerousCharsRegex();
}
