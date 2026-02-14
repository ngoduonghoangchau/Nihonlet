using MediatR;
using Microsoft.AspNetCore.Mvc;
using NihonLet.Application.Features.Reading.Queries;
using NihonLet.Application.Features.Reading.DTOs;
using NihonLet.Application.Features.Reading.Commands;
using NihonLet.Application.Features.Grammar.DTOs;
using NihonLet.Application.Features.Grammar.Commands; // Sử dụng chung Check Answer Command
using NihonLet.Domain.Enums;

namespace NihonLet.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReadingController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReadingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lấy danh sách các danh mục bài đọc (Đời sống, Kinh tế, Du lịch...)
    /// Hiển thị tại: /reading-topic
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult<List<ReadingCategoryDto>>> GetCategories()
    {
        var result = await _mediator.Send(new GetReadingCategoriesQuery());
        return Ok(result);
    }

    /// <summary>
    /// Lấy danh sách bài đọc theo cấp độ JLPT và danh mục
    /// Hiển thị tại: /reading-list
    /// </summary>
    [HttpGet("articles")]
    public async Task<ActionResult<List<ReadingArticleSummaryDto>>> GetArticles(
        [FromQuery] JlptLevel level, 
        [FromQuery] int? catId)
    {
        var result = await _mediator.Send(new GetReadingArticlesQuery(level, catId));
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết nội dung bài đọc (Văn bản, Furigana, Audio)
    /// Hiển thị tại: /reading-exercise
    /// </summary>
    [HttpGet("articles/{id:int}")]
    public async Task<ActionResult<ReadingArticleDto>> GetArticleById(int id)
    {
        var result = await _mediator.Send(new GetReadingArticleByIdQuery(id));
        return result != null ? Ok(result) : NotFound();
    }

    /// <summary>
    /// Lấy danh sách câu hỏi trắc nghiệm liên quan đến bài đọc
    /// Hiển thị tại phần Quiz của: /reading-exercise
    /// </summary>
    [HttpGet("articles/{id:int}/questions")]
    public async Task<ActionResult<List<QuestionDto>>> GetQuestions(int id)
    {
        // Sử dụng ReferenceType.Reading để lọc đúng câu hỏi trong AssessmentRepository
        var result = await _mediator.Send(new GetReadingQuestionsQuery(id));
        return Ok(result);
    }

    /// <summary>
    /// Gửi đáp án từng câu hỏi của bài đọc để kiểm tra
    /// </summary>
    [HttpPost("submit-answer")]
    public async Task<ActionResult<CheckAnswerResponse>> SubmitAnswer([FromBody] SubmitAnswerCommand command)
    {
        // Logic kiểm tra đáp án dùng chung với Grammar vì cấu trúc bảng Question/Option giống nhau
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Cập nhật kết quả cuối cùng của bài đọc (Accuracy %)
    /// Gọi khi hoàn thành bài đọc để hiện kết quả tại: /reading-result
    /// </summary>
    [HttpPost("update-progress")]
    public async Task<ActionResult<bool>> UpdateProgress([FromBody] UpdateReadingProgressCommand command)
    {
       var result = await _mediator.Send(command);
        return Ok(result);
    }
}