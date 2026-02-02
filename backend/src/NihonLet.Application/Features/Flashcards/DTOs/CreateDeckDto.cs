namespace NihonLet.Application.Features.Flashcards.DTOs;

public class CreateCardDto
{
    public string Reading { get; set; } = null!; // Hiragana/Katakana
    public string? Kanji { get; set; }
    public string Meaning { get; set; } = null!;
    public string? ExampleSentence { get; set; }
    public string? ExampleTranslation { get; set; }
}

public class CreateDeckRequest
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsBulkCreated { get; set; }
    public List<CreateCardDto> Cards { get; set; } = new();
}