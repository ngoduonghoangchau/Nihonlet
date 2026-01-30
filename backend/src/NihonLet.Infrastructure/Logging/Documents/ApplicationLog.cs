using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NihonLet.Infrastructure.Logging.Documents;

/// <summary>
/// MongoDB document cho Application Logs (errors, warnings, info)
/// </summary>
public class ApplicationLog
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    /// <summary>Log level: Debug, Info, Warning, Error, Critical</summary>
    public string Level { get; set; } = null!;
    
    /// <summary>Nội dung log message</summary>
    public string Message { get; set; } = null!;
    
    /// <summary>Exception details (nếu có)</summary>
    public ExceptionDetail? Exception { get; set; }
    
    /// <summary>Source của log (class name, method)</summary>
    public string Source { get; set; } = null!;
    
    /// <summary>User ID nếu có context</summary>
    public string? UserId { get; set; }
    
    /// <summary>Request path nếu từ HTTP request</summary>
    public string? RequestPath { get; set; }
    
    /// <summary>Correlation ID để track request flow</summary>
    public string? CorrelationId { get; set; }
    
    /// <summary>Additional data dạng key-value</summary>
    public Dictionary<string, object>? Metadata { get; set; }
    
    /// <summary>Thời điểm log</summary>
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Chi tiết exception cho logging
/// </summary>
public class ExceptionDetail
{
    public string Type { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string? StackTrace { get; set; }
    public ExceptionDetail? InnerException { get; set; }
}
