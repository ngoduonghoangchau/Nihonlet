using MediatR;
using Microsoft.EntityFrameworkCore;
using Nihonlet.Application.Common.Interfaces;

namespace Nihonlet.Application.Flashcards.Queries;

// QUERY LẤY DANH SÁCH
public record GetMyFlashcardSetsQuery(Guid UserId) : IRequest<List<FlashcardSetDto>>;

public class GetMyFlashcardSetsQueryHandler : IRequestHandler<GetMyFlashcardSetsQuery, List<FlashcardSetDto>>
{
    private readonly IApplicationDbContext _context;
    public GetMyFlashcardSetsQueryHandler(IApplicationDbContext context) => _context = context;

    public async Task<List<FlashcardSetDto>> Handle(GetMyFlashcardSetsQuery request, CancellationToken cancellationToken)
    {
        return await _context.FlashcardSets
            .Where(x => x.UserId == request.UserId)
            .OrderByDescending(x => x.Id)
            .Select(x => new FlashcardSetDto(
                x.Id,
                x.Title,
                x.Flashcards.Count,
                x.Flashcards.Select(f => f.Level).FirstOrDefault() ?? "N5",
                x.Created.ToString("dd/MM/yyyy")
            ))
            .ToListAsync(cancellationToken);
    }
}

// QUERY LẤY CHI TIẾT 1 BỘ
public record GetFlashcardSetByIdQuery(int Id) : IRequest<FlashcardSetDetailDto>;

public class GetFlashcardSetByIdQueryHandler : IRequestHandler<GetFlashcardSetByIdQuery, FlashcardSetDetailDto>
{
    private readonly IApplicationDbContext _context;
    public GetFlashcardSetByIdQueryHandler(IApplicationDbContext context) => _context = context;

    public async Task<FlashcardSetDetailDto> Handle(GetFlashcardSetByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.FlashcardSets
            .Include(x => x.Flashcards)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null) throw new Exception("Không tìm thấy bộ thẻ");

        return new FlashcardSetDetailDto(
            entity.Id,
            entity.Title,
            entity.Flashcards.FirstOrDefault()?.Level ?? "N5",
            entity.Flashcards.Select(f => new FlashcardItemDto(
                f.Id, f.FrontText, f.BackText, f.Level, f.ExampleSentence
            )).ToList()
        );
    }
}

