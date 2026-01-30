using NihonLet.Application.Common.Interfaces;
using NihonLet.Infrastructure.Logging.Documents;

namespace NihonLet.Infrastructure.Logging;

/// <summary>
/// Implementation của ISystemLogger sử dụng MongoDB
/// </summary>
public class SystemLogger : ISystemLogger
{
    private readonly MongoDbContext _mongoContext;
    
    public SystemLogger(MongoDbContext mongoContext)
    {
        _mongoContext = mongoContext;
    }
    
    public async Task LogInfoAsync(string message, string source, string? userId = null)
    {
        await LogAsync("Info", message, source, userId);
    }
    
    public async Task LogWarningAsync(string message, string source, string? userId = null)
    {
        await LogAsync("Warning", message, source, userId);
    }
    
    public async Task LogErrorAsync(string message, Exception? exception, string source, string? userId = null)
    {
        var log = new ApplicationLog
        {
            Level = "Error",
            Message = message,
            Source = source,
            UserId = userId,
            Timestamp = DateTime.UtcNow,
            Exception = exception != null ? MapException(exception) : null
        };
        
        await _mongoContext.ApplicationLogs.InsertOneAsync(log);
    }
    
    public async Task LogAuditAsync(
        string userId, 
        string action, 
        string entityType, 
        string? entityId = null,
        string? oldValue = null,
        string? newValue = null)
    {
        var audit = new AuditLog
        {
            UserId = userId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            OldValue = oldValue,
            NewValue = newValue,
            Timestamp = DateTime.UtcNow
        };
        
        await _mongoContext.AuditLogs.InsertOneAsync(audit);
    }
    
    public async Task LogApiRequestAsync(
        string method,
        string path,
        int statusCode,
        long durationMs,
        string? userId = null,
        string? ipAddress = null)
    {
        var request = new ApiRequestLog
        {
            Method = method,
            Path = path,
            StatusCode = statusCode,
            DurationMs = durationMs,
            UserId = userId,
            IpAddress = ipAddress,
            Timestamp = DateTime.UtcNow
        };
        
        await _mongoContext.ApiRequestLogs.InsertOneAsync(request);
    }
    
    private async Task LogAsync(string level, string message, string source, string? userId)
    {
        var log = new ApplicationLog
        {
            Level = level,
            Message = message,
            Source = source,
            UserId = userId,
            Timestamp = DateTime.UtcNow
        };
        
        await _mongoContext.ApplicationLogs.InsertOneAsync(log);
    }
    
    private ExceptionDetail MapException(Exception ex)
    {
        return new ExceptionDetail
        {
            Type = ex.GetType().FullName ?? ex.GetType().Name,
            Message = ex.Message,
            StackTrace = ex.StackTrace,
            InnerException = ex.InnerException != null ? MapException(ex.InnerException) : null
        };
    }
}
