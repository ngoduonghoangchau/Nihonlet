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
        public async Task<ActionResult<GrammarExercise>> GetByLevel(string level)
        {
            // Lấy bài tập theo Level, bao gồm cả Questions và Options
            var exercise = await _context.GrammarExercises
                .Include(e => e.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(e => e.Level == level);

            if (exercise == null)
            {
                return NotFound(new { message = $"Không tìm thấy bài tập cho level {level}" });
            }

            return Ok(exercise);
        }
    }
}
