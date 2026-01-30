using NihonLet.Domain.Enums;

namespace NihonLet.Domain.Entities.Learning;

/// <summary>
/// Chủ đề ngữ pháp tiếng Nhật
/// </summary>
public class GrammarTopic
{
    public int TopicId { get; set; }
    
    /// <summary>Cấp độ JLPT</summary>
    public JlptLevel Level { get; set; }
    
    /// <summary>Tên điểm ngữ pháp (VD: Cấu trúc ~Te-form)</summary>
    public string? Title { get; set; }
    
    /// <summary>Giải thích cách dùng và ý nghĩa</summary>
    public string? Description { get; set; }
    
    /// <summary>Các câu ví dụ mẫu (lưu dạng JSON)</summary>
    public string? ExampleJson { get; set; }
}
