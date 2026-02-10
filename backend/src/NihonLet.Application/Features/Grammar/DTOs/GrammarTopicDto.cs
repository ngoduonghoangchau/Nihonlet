namespace NihonLet.Application.Features.Grammar.DTOs;

public class GrammarTopicDto
{
    public int TopicId { get; set; }
    public string? Title { get; set; }
    public string? Level { get; set; } // Sẽ nhận giá trị string từ Enum
    public string? Description { get; set; }
    
    // ĐẢM BẢO CÓ DÒNG NÀY:
    public List<string> Examples { get; set; } = new(); 
}