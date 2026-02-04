//này là cho chi tiết bộ thẻ
public class DeckDetailsDto
{
    public int DeckId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public List<CardDto> Cards { get; set; } = new();
}

public class CardDto
{
    public int CardId { get; set; }
    public string? Kanji { get; set; }
    public string Reading { get; set; } = null!;
    public string Meaning { get; set; } = null!;
    public string? ExampleSentence { get; set; }
    public string? ExampleTranslation { get; set; }
}