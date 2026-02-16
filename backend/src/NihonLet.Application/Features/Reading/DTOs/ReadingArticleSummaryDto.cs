namespace NihonLet.Application.Features.Reading.DTOs;

public class ReadingArticleSummaryDto
{
    public int ArticleId { get; set; }
    public string? TitleJp { get; set; }
    public string? TitleVi { get; set; }
    public string? Level { get; set; }
    public string? CategoryName { get; set; }
    public string Status { get; set; } = "NotStarted"; // NotStarted, Learning, Completed
}