namespace NihonLet.Application.Features.Gamification.DTOs;

public class GetCardsRequest {
    public List<int> DeckIds { get; set; } = new();
    public int Limit { get; set; }
}

public class SaveSessionRequest {
    public int WordCount { get; set; }
    public string SelectedDecksJson { get; set; } = null!;
    public int TotalScore { get; set; }
    public decimal Accuracy { get; set; }
}