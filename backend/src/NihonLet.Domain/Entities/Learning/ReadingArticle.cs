using NihonLet.Domain.Enums;

namespace NihonLet.Domain.Entities.Learning;

/// <summary>
/// Bài đọc hiểu tiếng Nhật
/// </summary>
public class ReadingArticle
{
    public int ArticleId { get; set; }
    
    /// <summary>ID danh mục</summary>
    public int? CatId { get; set; }
    
    /// <summary>Cấp độ JLPT</summary>
    public JlptLevel Level { get; set; }
    
    /// <summary>Tiêu đề tiếng Nhật</summary>
    public string? TitleJp { get; set; }
    
    /// <summary>Tiêu đề tiếng Việt</summary>
    public string? TitleVi { get; set; }
    
    /// <summary>Nội dung gốc tiếng Nhật</summary>
    public string? ContentJp { get; set; }
    
    /// <summary>Nội dung có Furigana (lưu dạng JSON/Tag)</summary>
    public string? ContentFurigana { get; set; }
    
    /// <summary>Bản dịch tiếng Việt</summary>
    public string? ContentVi { get; set; }
    
    /// <summary>Link file âm thanh</summary>
    public string? AudioUrl { get; set; }
    
    /// <summary>Trạng thái khóa/mở</summary>
    public ContentStatus Status { get; set; } = ContentStatus.Unlocked;
    
    // Navigation property
    public virtual ReadingCategory? Category { get; set; }
}
