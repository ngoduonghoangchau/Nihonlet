using MediatR;
using Microsoft.EntityFrameworkCore;
using Nihonlet.Application.Common.Interfaces;
using Nihonlet.Application.Grammar.Common;

namespace Nihonlet.Application.Grammar.Queries;

public record GetGrammarExerciseByIdQuery(int Id) : IRequest<GrammarExerciseDto?>;

public class GetGrammarExerciseByIdHandler : IRequestHandler<GetGrammarExerciseByIdQuery, GrammarExerciseDto?>
{
    private readonly IApplicationDbContext _context;
    public GetGrammarExerciseByIdHandler(IApplicationDbContext context) => _context = context;

    public async Task<GrammarExerciseDto?> Handle(GetGrammarExerciseByIdQuery request, CancellationToken ct)
    {
        var exercise = await _context.GrammarExercises
            .Include(x => x.Questions)
            .ThenInclude(x => x.Options)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (exercise == null) return null;

        return new GrammarExerciseDto(
            exercise.Id,
            exercise.Title,
            exercise.Level,
            exercise.Questions.Select(q => new GrammarQuestionDto(
                q.Id, q.QuestionText, q.Explanation,
                q.Options.Select(o => new GrammarOptionDto(o.Id, o.Label, o.Content)).ToList()
            )).ToList()
        );
    }
}