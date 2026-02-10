namespace NihonLet.Application.Features.Grammar.DTOs;

public class CheckAnswerResponse
{
    public bool IsCorrect { get; set; }
    public int CorrectOptionId { get; set; }
    public string? Explanation { get; set; }
}