namespace NihonLet.Domain.Entities.Flashcard;

/// <summary>
/// Bộ thẻ flashcard do người dùng tạo
/// </summary>
public class Deck
{
    public int DeckId { get; set; }
    
    /// <summary>ID người sở hữu (AspNetUsers.Id)</summary>
    public string UserId { get; set; } = null!;
    
    /// <summary>Tên bộ thẻ</summary>
    public string Title { get; set; } = null!;
    
    /// <summary>Mô tả ngắn về bộ thẻ</summary>
    public string? Description { get; set; }
    
    /// <summary>Đánh dấu tạo bằng tính năng Bulk (Premium)</summary>
    public bool IsBulkCreated { get; set; } = false;
    
    /// <summary>Mức độ thành thạo trung bình (%)</summary>
    public int MasteryPercent { get; set; } = 0;
    
    /// <summary>Thời gian tạo</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<Card> Cards { get; set; } = new List<Card>();
}
