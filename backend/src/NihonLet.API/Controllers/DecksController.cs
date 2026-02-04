using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;

namespace NihonLet.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DecksController : ControllerBase
{
    private readonly IMediator _mediator;
    public DecksController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{id}")]
    public async Task<ActionResult<DeckDetailsDto>> GetDeck(int id)
    {
        var result = await _mediator.Send(new GetDeckWithCardsQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPatch("{id}/mastery")]
    public async Task<IActionResult> UpdateMastery(int id, [FromBody] UpdateMasteryRequest request)
    {
        var result = await _mediator.Send(new UpdateDeckMasteryCommand(id, request.MasteryPercent));
        if (!result) return BadRequest();
        return Ok();
    }
}