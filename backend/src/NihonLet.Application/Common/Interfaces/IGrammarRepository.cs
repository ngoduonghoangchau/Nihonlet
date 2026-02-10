using NihonLet.Domain.Entities.Learning;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Common.Interfaces;

public interface IGrammarRepository
{
    Task<GrammarTopic?> GetByIdAsync(int topicId, CancellationToken ct);
    Task<List<GrammarTopic>> GetTopicsByLevelAsync(JlptLevel level, CancellationToken ct);
    Task<List<GrammarTopic>> GetAllTopicsAsync(CancellationToken ct);
}