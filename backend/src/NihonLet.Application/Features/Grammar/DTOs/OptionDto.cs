namespace NihonLet.Application.Features.Grammar.DTOs; // Phải có dòng này ở đầu file

public class OptionDto
{
    public int OptionId { get; set; }
    public string? OptionText { get; set; }
    // Lưu ý: Không trả về IsCorrect ở DTO để bảo mật đáp án
}