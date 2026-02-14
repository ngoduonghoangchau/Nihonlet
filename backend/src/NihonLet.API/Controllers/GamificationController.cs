using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using NihonLet.Application.Common.Models;
using NihonLet.Application.Features.Gamification.Queries;
using NihonLet.Application.Features.Gamification.Commands;
using NihonLet.Application.Features.Gamification.DTOs;

namespace NihonLet.API.Controllers;

/// <summary>
/// Endpoints cho Minigames (Matching, Rewriting)
/// </summary>
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
        var result = await _mediator.Send(new GetDecksForGameQuery());
        return Ok(ApiResponse<List<GameDeckDto>>.SuccessResult(result));
    }

    [HttpPost("start-matching")]
    public async Task<IActionResult> StartMatching([FromBody] GameStartRequest request)
    {
        // Exceptions được GlobalExceptionHandler xử lý tập trung
        await _mediator.Send(new StartMatchingGameCommand(request));
        return Ok(ApiResponse.SuccessResult("Sẵn sàng bắt đầu!"));
    }

    [HttpPost("get-cards")]
    public async Task<IActionResult> GetCardsForGame([FromBody] GetCardsForGameQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(ApiResponse<List<GameCardDto>>.SuccessResult(result));
    }

    [HttpPost("start-rewriting")]
    public async Task<IActionResult> StartRewriting([FromBody] List<int> deckIds)
    {
        await _mediator.Send(new StartRewritingGameCommand(deckIds));
        return Ok(ApiResponse.SuccessResult("Hợp lệ"));
    }

    [HttpPost("save-rewriting")]
    public async Task<IActionResult> SaveRewriting([FromBody] SaveSessionRequest request)
    {
        var id = await _mediator.Send(new SaveRewritingSessionCommand(request));
        return Ok(ApiResponse<object>.SuccessResult(
            new { Id = id }, "Lưu kết quả thành công"));
    }
}