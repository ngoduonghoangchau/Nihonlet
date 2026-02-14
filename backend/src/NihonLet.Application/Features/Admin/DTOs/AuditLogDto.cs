namespace NihonLet.Application.Features.Admin.DTOs;

/// <summary>
/// DTO cho Audit Log (hành vi người dùng)
/// </summary>
public class AuditLogDto
{
    public string Id { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public string Action { get; set; } = null!;
    public string EntityType { get; set; } = null!;
    public string? EntityId { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string Result { get; set; } = null!;
    public string? FailureReason { get; set; }
    public DateTime Timestamp { get; set; }
}
