namespace NihonLet.Application.Features.Reading.DTOs;

public class ReadingArticleDto
{
    public int ArticleId { get; set; }
    public string? TitleJp { get; set; }
    public string? TitleVi { get; set; }
    public string? ContentJp { get; set; }
    public string? ContentFurigana { get; set; }
    public string? ContentVi { get; set; }
    public string? AudioUrl { get; set; }
    public string? Level { get; set; }
}