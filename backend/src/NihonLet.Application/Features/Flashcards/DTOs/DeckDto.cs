namespace NihonLet.Application.Features.Flashcards.DTOs;

public class DeckDto {
    public int DeckId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public int CardsCount { get; set; }
    public int MasteryPercent { get; set; }
    public bool IsBulkCreated { get; set; }
}