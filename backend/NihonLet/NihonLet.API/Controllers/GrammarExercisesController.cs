// d:\NihonletExe\Nihonlet\backend\NihonLet\Nihonlet.API\Controllers\GrammarExercisesController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nihonlet.Domain.Entities;
using Nihonlet.Infrastructure.Data;

namespace Nihonlet.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GrammarExercisesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GrammarExercisesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("by-level/{level}")]
        public async Task<IActionResult> GetByLevel(string level)
        {
            try
            {
                // Lấy bài tập theo Level, sử dụng Projection để tránh lỗi vòng lặp JSON và chỉ lấy dữ liệu cần thiết
                // Sử dụng ToLower() để so sánh không phân biệt hoa thường (ví dụ: n5-1 và N5-1)
                var exercise = await _context.GrammarExercises
                    .AsNoTracking()
                    .Where(e => e.Level.ToLower() == level.ToLower())
                    .Select(e => new
                    {
                        e.Id,
                        e.Level,
                        e.Title,
                        Questions = e.Questions.Select(q => new
                        {
                            q.Id,
                            q.QuestionText,
                            q.Explanation,
                            Options = q.Options.Select(o => new
                            {
                                o.Id,
                                o.Label,
                                o.Content,
                                o.IsCorrect
                            }).OrderBy(o => o.Label).ToList()
                        }).OrderBy(q => q.Id).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (exercise == null)
                {
                    return NotFound(new { message = $"Không tìm thấy bài tập cho level {level}" });
                }

                return Ok(exercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server khi lấy bài tập", error = ex.Message });
            }
        }
    }
}
