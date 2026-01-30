using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NihonLet.Infrastructure.Logging.Documents;

/// <summary>
/// MongoDB document cho API Request Logs (performance monitoring)
/// </summary>
public class ApiRequestLog
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    /// <summary>HTTP Method: GET, POST, PUT, DELETE, etc.</summary>
    public string Method { get; set; } = null!;
    
    /// <summary>Request path</summary>
    public string Path { get; set; } = null!;
    
    /// <summary>Query string parameters</summary>
    public string? QueryString { get; set; }
    
    /// <summary>HTTP Status Code của response</summary>
    public int StatusCode { get; set; }
    
    /// <summary>Thời gian xử lý request (milliseconds)</summary>
    public long DurationMs { get; set; }
    
    /// <summary>User ID nếu authenticated</summary>
    public string? UserId { get; set; }
    
    /// <summary>IP address của client</summary>
    public string? IpAddress { get; set; }
    
    /// <summary>User agent</summary>
    public string? UserAgent { get; set; }
    
    /// <summary>Request headers quan trọng</summary>
    public Dictionary<string, string>? Headers { get; set; }
    
    /// <summary>Request body (truncated nếu quá dài)</summary>
    public string? RequestBody { get; set; }
    
    /// <summary>Response body size (bytes)</summary>
    public long? ResponseSize { get; set; }
    
    /// <summary>Correlation ID</summary>
    public string? CorrelationId { get; set; }
    
    /// <summary>Thời điểm request</summary>
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
