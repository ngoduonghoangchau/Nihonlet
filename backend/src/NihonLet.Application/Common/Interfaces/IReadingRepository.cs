using NihonLet.Domain.Entities.Learning;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Common.Interfaces;

public interface IReadingRepository
{
    Task<List<ReadingCategory>> GetCategoriesAsync(CancellationToken ct);
    Task<List<ReadingArticle>> GetArticlesAsync(JlptLevel level, int? catId, CancellationToken ct);
    Task<ReadingArticle?> GetArticleByIdAsync(int id, CancellationToken ct);
}