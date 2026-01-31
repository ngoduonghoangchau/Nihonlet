namespace NihonLet.Domain.Entities.Identity;

/// <summary>
/// Entity lưu trữ refresh token với hash và tracking rotation
/// </summary>
public class RefreshToken
{
  /// <summary>ID duy nhất của token</summary>
  public Guid Id { get; set; }

  /// <summary>ID của user sở hữu token</summary>
  public string UserId { get; set; } = null!;

  /// <summary>SHA-256 hash của token (không lưu token gốc)</summary>
  public string TokenHash { get; set; } = null!;

  /// <summary>
  /// Token family - group các token cùng một session/device.
  /// Khi phát hiện reuse attack, revoke toàn bộ family.
  /// </summary>
  public Guid TokenFamily { get; set; }

  /// <summary>Thời điểm tạo token</summary>
  public DateTime CreatedAt { get; set; }

  /// <summary>Thời điểm token hết hạn</summary>
  public DateTime ExpiresAt { get; set; }

  /// <summary>Thời điểm token bị revoke (null nếu còn valid)</summary>
  public DateTime? RevokedAt { get; set; }

  /// <summary>ID của token thay thế (để tracking rotation chain)</summary>
  public Guid? ReplacedByTokenId { get; set; }

  /// <summary>Lý do revoke (Rotated, Logout, ReuseDetected, etc.)</summary>
  public string? RevokedReason { get; set; }

  /// <summary>Device fingerprint từ client (unique per device)</summary>
  public string DeviceFingerprint { get; set; } = null!;

  /// <summary>Tên thiết bị hiển thị (e.g., "Chrome on Windows")</summary>
  public string? DeviceName { get; set; }

  /// <summary>Lần cuối token được sử dụng</summary>
  public DateTime LastUsedAt { get; set; }

  /// <summary>IP address khi tạo token</summary>
  public string? CreatedByIp { get; set; }

  /// <summary>Kiểm tra token còn active (chưa revoke và chưa hết hạn)</summary>
  public bool IsActive => RevokedAt == null && DateTime.UtcNow < ExpiresAt;

  /// <summary>Kiểm tra token đã hết hạn</summary>
  public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

  /// <summary>Kiểm tra token đã bị revoke</summary>
  public bool IsRevoked => RevokedAt != null;
}
