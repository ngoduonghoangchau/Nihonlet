namespace NihonLet.Domain.Entities.Flashcard;

/// <summary>
/// Thẻ từ vựng trong bộ thẻ
/// </summary>
public class Card
{
    public int CardId { get; set; }
    
    /// <summary>ID bộ thẻ chứa thẻ này</summary>
    public int DeckId { get; set; }
    
    /// <summary>Chữ Kanji (có thể null nếu từ không có Kanji)</summary>
    public string? Kanji { get; set; }
    
    /// <summary>Cách đọc bằng Hiragana hoặc Katakana</summary>
    public string Reading { get; set; } = null!;
    
    /// <summary>Nghĩa tiếng Việt</summary>
    public string Meaning { get; set; } = null!;
    
    /// <summary>Câu ví dụ tiếng Nhật</summary>
    public string? ExampleSentence { get; set; }
    
    /// <summary>Bản dịch câu ví dụ</summary>
    public string? ExampleTranslation { get; set; }
    
    // Navigation property
    public virtual Deck Deck { get; set; } = null!;
}
