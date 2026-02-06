namespace NihonLet.Application.Features.Gamification.DTOs;

public class GameStartRequest
{
    public List<int> SelectedDeckIds { get; set; } = new();
    public int WordCount { get; set; }
}

public class GameDeckDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public int CardsCount { get; set; }
}