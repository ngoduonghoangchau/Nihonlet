namespace NihonLet.Domain.Entities.Assessment;

/// <summary>
/// Lựa chọn đáp án cho câu hỏi
/// </summary>
public class Option
{
    public int OptionId { get; set; }
    
    /// <summary>ID câu hỏi</summary>
    public int QuestionId { get; set; }
    
    /// <summary>Nội dung đáp án</summary>
    public string? OptionText { get; set; }
    
    /// <summary>Đánh dấu đây có phải đáp án đúng hay không</summary>
    public bool IsCorrect { get; set; } = false;
    
    // Navigation property
    public virtual Question Question { get; set; } = null!;
}
