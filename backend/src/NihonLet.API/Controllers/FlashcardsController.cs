using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using NihonLet.Application.Common.Models;
using NihonLet.Application.Features.Flashcards.Queries.GetDecks;
using NihonLet.Application.Features.Flashcards.Commands;
using NihonLet.Application.Features.Flashcards.DTOs;

namespace NihonLet.API.Controllers;

/// <summary>
/// Quản lý bộ thẻ Flashcard (tạo, xem, xóa)
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FlashcardsController : ControllerBase
{
    private readonly IMediator _mediator;

    public FlashcardsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("decks")]
    public async Task<IActionResult> CreateDeck([FromBody] CreateDeckRequest request)
    {
        // Exceptions được GlobalExceptionHandler xử lý tập trung
        var deckId = await _mediator.Send(new CreateDeckCommand(request));
        return Ok(ApiResponse<object>.SuccessResult(
            new { Id = deckId }, "Tạo bộ thẻ thành công!"));
    }

    [HttpGet("decks")]
    public async Task<IActionResult> GetDecks()
    {
        var result = await _mediator.Send(new GetDecksQuery());
        return Ok(ApiResponse<List<DeckDto>>.SuccessResult(result));
    }

    [HttpDelete("decks/{id}")]
    public async Task<IActionResult> DeleteDeck(int id)
    {
        await _mediator.Send(new DeleteDeckCommand(id));
        return NoContent();
    }
}