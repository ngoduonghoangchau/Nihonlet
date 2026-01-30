using NihonLet.Domain.Enums;

namespace NihonLet.Domain.Entities.Gamification;

/// <summary>
/// Tin nhắn trong phiên chat AI
/// </summary>
public class AiChatMessage
{
    public int MessageId { get; set; }
    
    /// <summary>ID phiên chat</summary>
    public int SessionId { get; set; }
    
    /// <summary>Người gửi (User/AI)</summary>
    public MessageSender Sender { get; set; }
    
    /// <summary>Nội dung tin nhắn</summary>
    public string? Content { get; set; }
    
    /// <summary>Thời gian gửi</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public virtual AiChatSession Session { get; set; } = null!;
}
