namespace NihonLet.Application.Features.Flashcards.DTOs;

/// <summary>
/// Request cập nhật độ thành thạo của bộ thẻ (0-100%)
/// </summary>
public record UpdateMasteryRequest(int MasteryPercent);