namespace NihonLet.Application.Features.Gamification.DTOs;

public class GameCardDto
{
    public int CardId { get; set; }
    public string Kanji { get; set; } = null!;
    public string Reading { get; set; } = null!;
    public string Meaning { get; set; } = null!;
}