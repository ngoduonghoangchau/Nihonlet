namespace NihonLet.Domain.Entities.Gamification;

/// <summary>
/// Phiên chat với trợ lý AI
/// </summary>
public class AiChatSession
{
    public int SessionId { get; set; }
    
    /// <summary>ID người dùng (AspNetUsers.Id)</summary>
    public string UserId { get; set; } = null!;
    
    /// <summary>Tiêu đề phiên chat</summary>
    public string? Title { get; set; }
    
    /// <summary>Thời gian tạo</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public virtual ICollection<AiChatMessage> Messages { get; set; } = new List<AiChatMessage>();
}
