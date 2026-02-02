using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using NihonLet.Application.Features.Flashcards.Queries.GetDecks; 
using NihonLet.Application.Features.Flashcards.Commands;
using NihonLet.Application.Features.Flashcards.DTOs;

namespace NihonLet.API.Controllers;

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
        try
        {
            var deckId = await _mediator.Send(new CreateDeckCommand(request));
            return Ok(new { Id = deckId, Message = "Tạo bộ thẻ thành công!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet("decks")]
    public async Task<IActionResult> GetDecks()
    {
        var result = await _mediator.Send(new GetDecksQuery());
        return Ok(result);
    }

    [HttpDelete("decks/{id}")]
    public async Task<IActionResult> DeleteDeck(int id)
    {
        await _mediator.Send(new DeleteDeckCommand(id));
        return NoContent(); // Trả về 204 thành công
    }
}