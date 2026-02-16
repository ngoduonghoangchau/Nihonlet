using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Entities.Learning;
using NihonLet.Domain.Enums;

namespace NihonLet.Infrastructure.Persistence.Repositories;

public class ReadingRepository : IReadingRepository
{
    private readonly IApplicationDbContext _context;

    public ReadingRepository(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReadingCategory>> GetCategoriesAsync(CancellationToken ct)
    {
        return await _context.ReadingCategories
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<List<ReadingArticle>> GetArticlesAsync(JlptLevel level, int? catId, CancellationToken ct)
    {
        var query = _context.ReadingArticles.AsQueryable();

        query = query.Where(a => a.Level == level);

        if (catId.HasValue)
        {
            query = query.Where(a => a.CatId == catId.Value);
        }

        return await query
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<ReadingArticle?> GetArticleByIdAsync(int id, CancellationToken ct)
    {
        return await _context.ReadingArticles
            .Include(a => a.Category)
            .FirstOrDefaultAsync(a => a.ArticleId == id, ct);
    }
}