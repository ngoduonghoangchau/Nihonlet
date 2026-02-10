namespace NihonLet.Application.Features.Admin.DTOs;

/// <summary>
/// DTO cho API Request Log (performance monitoring)
/// </summary>
public class ApiRequestLogDto
{
    public string Id { get; set; } = null!;
    public string Method { get; set; } = null!;
    public string Path { get; set; } = null!;
    public string? QueryString { get; set; }
    public int StatusCode { get; set; }
    public long DurationMs { get; set; }
    public string? UserId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public long? ResponseSize { get; set; }
    public string? CorrelationId { get; set; }
    public DateTime Timestamp { get; set; }
}
