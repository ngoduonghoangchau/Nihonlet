using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using NihonLet.Application.Features.Gamification.Queries; 
using NihonLet.Application.Features.Gamification.Commands;
using NihonLet.Application.Features.Gamification.DTOs;


[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GamificationController : ControllerBase
{
    private readonly IMediator _mediator;

    public GamificationController(IMediator mediator) => _mediator = mediator;

    [HttpGet("available-decks")]
    public async Task<IActionResult> GetAvailableDecks()
    {
        return Ok(await _mediator.Send(new GetDecksForGameQuery()));
    }

    [HttpPost("start-matching")]
    public async Task<IActionResult> StartMatching([FromBody] GameStartRequest request)
    {
        try {
            await _mediator.Send(new StartMatchingGameCommand(request));
            return Ok(new { Message = "Sẵn sàng bắt đầu!" });
        } catch (Exception ex) {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("get-cards")] 
    public async Task<IActionResult> GetCardsForGame([FromBody] GetCardsForGameQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

        [HttpPost("start-rewriting")]
    public async Task<IActionResult> StartRewriting([FromBody] List<int> deckIds)
    {
        try {
            await _mediator.Send(new StartRewritingGameCommand(deckIds));
            return Ok(new { Message = "Hợp lệ" });
        } catch (Exception ex) {
            return BadRequest(new { Message = ex.Message });
        }
    }

        [HttpPost("save-rewriting")]
    public async Task<IActionResult> SaveRewriting([FromBody] SaveSessionRequest request)
    {
        var id = await _mediator.Send(new SaveRewritingSessionCommand(request));
        return Ok(new { Id = id, Message = "Lưu kết quả thành công" });
    }
}