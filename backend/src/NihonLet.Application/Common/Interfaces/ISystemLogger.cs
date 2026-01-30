namespace NihonLet.Application.Common.Interfaces;

/// <summary>
/// Interface cho hệ thống logging MongoDB
/// </summary>
public interface ISystemLogger
{
    /// <summary>
    /// Log hoạt động thông thường (INFO)
    /// </summary>
    Task LogInfoAsync(string message, string source, string? userId = null);
    
    /// <summary>
    /// Log cảnh báo (WARNING)
    /// </summary>
    Task LogWarningAsync(string message, string source, string? userId = null);
    
    /// <summary>
    /// Log lỗi với exception details (ERROR)
    /// </summary>
    Task LogErrorAsync(string message, Exception? exception, string source, string? userId = null);
    
    /// <summary>
    /// Log hoạt động người dùng cho audit trail
    /// </summary>
    Task LogAuditAsync(
        string userId,
        string action,
        string entityType,
        string? entityId = null,
        string? oldValue = null,
        string? newValue = null);
    
    /// <summary>
    /// Log API request cho performance monitoring
    /// </summary>
    Task LogApiRequestAsync(
        string method,
        string path,
        int statusCode,
        long durationMs,
        string? userId = null,
        string? ipAddress = null);
}
