using MediatR;
using Microsoft.EntityFrameworkCore;
using Nihonlet.Application.Common.Interfaces;
using Nihonlet.Application.Grammar.Common;
public record GrammarSummaryDto(int Id, string Title, string Level);

public record GetGrammarSummaryQuery : IRequest<List<GrammarSummaryDto>>;

public class GetGrammarSummaryHandler : IRequestHandler<GetGrammarSummaryQuery, List<GrammarSummaryDto>>
{
    private readonly IApplicationDbContext _context;
    public GetGrammarSummaryHandler(IApplicationDbContext context) => _context = context;

    public async Task<List<GrammarSummaryDto>> Handle(GetGrammarSummaryQuery request, CancellationToken ct)
    {
        return await _context.GrammarExercises
            .Select(x => new GrammarSummaryDto(x.Id, x.Title, x.Level))
            .ToListAsync(ct);
    }
}