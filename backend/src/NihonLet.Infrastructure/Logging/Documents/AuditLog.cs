using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NihonLet.Infrastructure.Logging.Documents;

/// <summary>
/// MongoDB document cho Audit Logs (theo dõi hoạt động người dùng)
/// </summary>
public class AuditLog
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    /// <summary>User ID người thực hiện action</summary>
    public string UserId { get; set; } = null!;
    
    /// <summary>Loại action: Create, Update, Delete, Login, Logout, etc.</summary>
    public string Action { get; set; } = null!;
    
    /// <summary>Entity type bị tác động: Deck, Card, User, etc.</summary>
    public string EntityType { get; set; } = null!;
    
    /// <summary>Entity ID bị tác động</summary>
    public string? EntityId { get; set; }
    
    /// <summary>Giá trị cũ trước khi thay đổi (JSON)</summary>
    public string? OldValue { get; set; }
    
    /// <summary>Giá trị mới sau khi thay đổi (JSON)</summary>
    public string? NewValue { get; set; }
    
    /// <summary>IP address của request</summary>
    public string? IpAddress { get; set; }
    
    /// <summary>User agent của client</summary>
    public string? UserAgent { get; set; }
    
    /// <summary>Kết quả: Success, Failed</summary>
    public string Result { get; set; } = "Success";
    
    /// <summary>Lý do thất bại (nếu có)</summary>
    public string? FailureReason { get; set; }
    
    /// <summary>Thời điểm action</summary>
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
