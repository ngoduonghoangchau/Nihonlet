using NihonLet.Domain.Enums;

namespace NihonLet.Domain.Entities.Assessment;

/// <summary>
/// Câu hỏi trắc nghiệm (dùng cho cả Reading và Grammar)
/// </summary>
public class Question
{
    public int QuestionId { get; set; }
    
    /// <summary>ID bài Reading hoặc Grammar tương ứng</summary>
    public int ReferenceId { get; set; }
    
    /// <summary>Loại tham chiếu (Reading/Grammar)</summary>
    public ReferenceType ReferenceType { get; set; }
    
    /// <summary>Nội dung câu hỏi</summary>
    public string QuestionText { get; set; } = null!;
    
    /// <summary>Giải thích đáp án đúng</summary>
    public string? Explanation { get; set; }
    
    /// <summary>Số điểm/XP đạt được nếu trả lời đúng</summary>
    public int Points { get; set; } = 10;
    
    // Navigation property
    public virtual ICollection<Option> Options { get; set; } = new List<Option>();
}
