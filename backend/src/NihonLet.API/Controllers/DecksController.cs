using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using NihonLet.Application.Common.Models;
using NihonLet.Application.Features.Flashcards.DTOs;
using NihonLet.Application.Features.Flashcards.Commands;


namespace NihonLet.API.Controllers;

/// <summary>
/// Xem chi tiết và cập nhật Deck (study session)
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DecksController : ControllerBase
{
    private readonly IMediator _mediator;

    public DecksController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDeck(int id)
    {
        var result = await _mediator.Send(new GetDeckWithCardsQuery(id));
        if (result == null)
            return NotFound(ApiResponse.FailResult("Không tìm thấy bộ thẻ.", "NOT_FOUND"));

        return Ok(ApiResponse<DeckDetailsDto>.SuccessResult(result));
    }

    [HttpPatch("{id}/mastery")]
    public async Task<IActionResult> UpdateMastery(int id, [FromBody] UpdateMasteryRequest request)
    {
        var result = await _mediator.Send(new UpdateDeckMasteryCommand(id, request.MasteryPercent));
        if (!result)
            return BadRequest(ApiResponse.FailResult("Không thể cập nhật mastery.", "UPDATE_FAILED"));

        return Ok(ApiResponse.SuccessResult("Cập nhật thành công."));
    }
}