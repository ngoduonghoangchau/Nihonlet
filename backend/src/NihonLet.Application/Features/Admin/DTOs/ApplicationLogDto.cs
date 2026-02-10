namespace NihonLet.Application.Features.Admin.DTOs;

/// <summary>
/// DTO cho Application Log (errors, warnings, info)
/// </summary>
public class ApplicationLogDto
{
    public string Id { get; set; } = null!;
    public string Level { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string Source { get; set; } = null!;
    public string? UserId { get; set; }
    public string? RequestPath { get; set; }
    public string? CorrelationId { get; set; }
    public ExceptionDetailDto? Exception { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
    public DateTime Timestamp { get; set; }
}

public class ExceptionDetailDto
{
    public string Type { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string? StackTrace { get; set; }
    public ExceptionDetailDto? InnerException { get; set; }
}
