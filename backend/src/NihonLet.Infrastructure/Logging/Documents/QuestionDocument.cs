public class QuestionDocument
{
    public string QuestionText { get; set; } = null!;
    public string? Explanation { get; set; }
    public int Points { get; set; }
    public List<OptionDocument> Options { get; set; } = new();
}