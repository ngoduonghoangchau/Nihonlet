using MediatR;
using Microsoft.AspNetCore.Mvc;
using NihonLet.Application.Features.Grammar.Queries;
using NihonLet.Application.Features.Grammar.Commands;
using NihonLet.Application.Features.Grammar.DTOs;
using NihonLet.Domain.Enums;

namespace NihonLet.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GrammarController : ControllerBase
{
    private readonly IMediator _mediator;

    public GrammarController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("topics")]
    public async Task<ActionResult<List<GrammarTopicWithProgressDto>>> GetTopics([FromQuery] JlptLevel level)
    {
        var result = await _mediator.Send(new GetGrammarTopicsWithProgressQuery(level));
        return Ok(result);
    }

    [HttpGet("topics/{id:int}")]
    public async Task<ActionResult<GrammarTopicDto>> GetTopicById(int id)
    {
        var result = await _mediator.Send(new GetGrammarTopicByIdQuery(id));
        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet("topics/{id:int}/questions")]
    public async Task<ActionResult<List<QuestionDto>>> GetQuestions(int id)
    {
        return Ok(await _mediator.Send(new GetQuestionsByTopicQuery(id)));
    }

    [HttpPost("submit-answer")]
    public async Task<ActionResult<CheckAnswerResponse>> SubmitAnswer([FromBody] SubmitAnswerCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpPost("update-progress")]
    public async Task<IActionResult> UpdateProgress([FromBody] UpdateGrammarProgressCommand command)
    {
        return Ok(await _mediator.Send(command));
    }
}