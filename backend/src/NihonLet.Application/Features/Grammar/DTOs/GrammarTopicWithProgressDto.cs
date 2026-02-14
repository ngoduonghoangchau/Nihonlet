namespace NihonLet.Application.Features.Grammar.DTOs;

public class GrammarTopicWithProgressDto
{
    public int TopicId { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Level { get; set; } = null!;
    public bool IsPremium { get; set; }

    // Thông tin tiến độ
    public decimal ProgressPercent { get; set; } // 0 - 100
    public string Status { get; set; } = "NotStarted"; // Completed, Learning, NotStarted
}