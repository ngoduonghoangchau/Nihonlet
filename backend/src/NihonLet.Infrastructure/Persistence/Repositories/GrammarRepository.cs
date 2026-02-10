using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Entities.Learning;
using NihonLet.Domain.Enums;

namespace NihonLet.Infrastructure.Persistence.Repositories;

public class GrammarRepository : IGrammarRepository
{
    private readonly IApplicationDbContext _context;

    public GrammarRepository(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GrammarTopic?> GetByIdAsync(int topicId, CancellationToken ct)
    {
        // Tìm chủ đề theo TopicId
        return await _context.GrammarTopics
            .FirstOrDefaultAsync(x => x.TopicId == topicId, ct);
    }

    public async Task<List<GrammarTopic>> GetTopicsByLevelAsync(JlptLevel level, CancellationToken ct)
    {
        // Lấy danh sách bài học theo Level (N5, N4...)
        return await _context.GrammarTopics
            .Where(x => x.Level == level)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<List<GrammarTopic>> GetAllTopicsAsync(CancellationToken ct)
    {
        // Lấy toàn bộ danh sách bài học
        return await _context.GrammarTopics
            .AsNoTracking()
            .ToListAsync(ct);
    }
}