using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Grammar.DTOs;
using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Grammar.Queries;

public record GetGrammarTopicsWithProgressQuery(JlptLevel Level) : IRequest<List<GrammarTopicWithProgressDto>>;

public class GetGrammarTopicsWithProgressHandler : IRequestHandler<GetGrammarTopicsWithProgressQuery, List<GrammarTopicWithProgressDto>>
{
    private readonly IGrammarRepository _grammarRepo;
    private readonly IAssessmentRepository _assessmentRepo;
    private readonly ICurrentUserService _currentUser;

    public GetGrammarTopicsWithProgressHandler(
        IGrammarRepository grammarRepo,
        IAssessmentRepository assessmentRepo,
        ICurrentUserService currentUser)
    {
        _grammarRepo = grammarRepo;
        _assessmentRepo = assessmentRepo;
        _currentUser = currentUser;
    }

    // ... các using giữ nguyên ...

    public async Task<List<GrammarTopicWithProgressDto>> Handle(GetGrammarTopicsWithProgressQuery request, CancellationToken ct)
    {
        var topics = await _grammarRepo.GetTopicsByLevelAsync(request.Level, ct);
        var userId = _currentUser.UserId;

        var progressList = new List<UserProgress>();
        if (!string.IsNullOrEmpty(userId))
        {
            var topicIds = topics.Select(t => t.TopicId);
            progressList = await _assessmentRepo.GetProgressListAsync(userId, topicIds, ReferenceType.Grammar, ct);
        }

        // Trong phần Handle:
        return topics.Select(t =>
        {
            var userProgress = progressList.FirstOrDefault(p => p.ReferenceId == t.TopicId);

            // Ánh xạ Enum sang String cho Frontend dễ đọc
            string statusString = userProgress?.Status switch
            {
                ProgressStatus.Completed => "Completed",
                ProgressStatus.Learning => "Learning",
                _ => "NotStarted"
            };

            return new GrammarTopicWithProgressDto
            {
                TopicId = t.TopicId,
                Title = t.Title ?? "",
                Description = t.Description ?? "",
                Level = t.Level.ToString(),
                Status = statusString,
                ProgressPercent = userProgress?.AccuracyPercent ?? 0
            };
        }).ToList();
    }
}