namespace NihonLet.Domain.Entities.Learning;

/// <summary>
/// Danh mục phân loại bài đọc
/// </summary>
public class ReadingCategory
{
    public int CatId { get; set; }
    
    /// <summary>Tên danh mục tiếng Việt</summary>
    public string? NameVi { get; set; }
    
    /// <summary>Tên danh mục tiếng Nhật</summary>
    public string? NameJp { get; set; }
    
    /// <summary>Đường dẫn icon</summary>
    public string? IconUrl { get; set; }
    
    // Navigation property
    public virtual ICollection<ReadingArticle> Articles { get; set; } = new List<ReadingArticle>();
}
