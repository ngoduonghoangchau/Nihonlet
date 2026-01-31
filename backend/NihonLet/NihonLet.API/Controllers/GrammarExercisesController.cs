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

    // Lấy danh sách tất cả các đề (Cho trang chọn đề)
    // 1. Lấy danh sách tóm tắt (Cho trang TopicSelection)
    [HttpGet]
    public async Task<ActionResult<List<GrammarSummaryDto>>> GetAll()
    {
        return Ok(await _mediator.Send(new GetGrammarSummaryQuery()));
    }

    // 2. Lấy chi tiết bài tập kèm câu hỏi (Cho trang ExercisePage)
    [HttpGet("{id}")]
    public async Task<ActionResult<GrammarExerciseDto>> GetById(int id)
    {
        // Bạn phải đảm bảo đã tạo class GetGrammarExerciseByIdQuery trong tầng Application
        var result = await _mediator.Send(new GetGrammarExerciseByIdQuery(id));
        return result != null ? Ok(result) : NotFound();
    }
    // ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT
    [HttpPost("submit-answer")]
    public async Task<ActionResult<SubmissionResult>> Submit([FromBody] SubmitAnswerCommand command)
    {
        // Thêm [FromBody] để đảm bảo .NET đọc dữ liệu JSON từ React
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}