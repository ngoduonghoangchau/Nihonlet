namespace NihonLet.Application.Features.Grammar.DTOs; // Phải có dòng này ở đầu file

public class QuestionDto
{
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = null!;
    public string? Explanation { get; set; }
    public int Points { get; set; }
    public List<OptionDto> Options { get; set; } = new();
}
// KHÔNG định nghĩa OptionDto ở đây nữa