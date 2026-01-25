using MediatR;
using Microsoft.AspNetCore.Mvc;
using Nihonlet.Application.Grammar.Commands;
using Nihonlet.Application.Grammar.Queries;
// FIX CHÍNH: Thêm dòng using này để Controller thấy được DTO
using Nihonlet.Application.Grammar.Common; 

namespace NihonLet.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GrammarExercisesController : ControllerBase
{
    private readonly IMediator _mediator;
    public GrammarExercisesController(IMediator mediator) => _mediator = mediator;

    [HttpGet("by-level/{level}")]
    // Vẫn giữ ActionResult<T> để Swagger hiển thị Schema
    public async Task<ActionResult<GrammarExerciseDto>> GetByLevel(string level)
    {
        var result = await _mediator.Send(new GetGrammarExerciseByLevelQuery(level));
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPost("submit-answer")]
    public async Task<ActionResult<SubmissionResult>> Submit(SubmitAnswerCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}