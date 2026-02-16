using AutoMapper;
using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Reading.DTOs;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Reading.Queries;

public record GetReadingArticlesQuery(JlptLevel Level, int? CatId) : IRequest<List<ReadingArticleSummaryDto>>;

public class GetReadingArticlesHandler : IRequestHandler<GetReadingArticlesQuery, List<ReadingArticleSummaryDto>>
{
    private readonly IReadingRepository _readingRepo;
    private readonly IAssessmentRepository _assessmentRepo;
    private readonly ICurrentUserService _currentUser;
    private readonly IMapper _mapper;

    public GetReadingArticlesHandler(IReadingRepository readingRepo, IAssessmentRepository assessmentRepo, ICurrentUserService currentUser, IMapper mapper)
    {
        _readingRepo = readingRepo;
        _assessmentRepo = assessmentRepo;
        _currentUser = currentUser;
        _mapper = mapper;
    }

    public async Task<List<ReadingArticleSummaryDto>> Handle(GetReadingArticlesQuery request, CancellationToken ct)
    {
        var articles = await _readingRepo.GetArticlesAsync(request.Level, request.CatId, ct);
        var userId = _currentUser.UserId;
        
        // Map cơ bản
        var dtos = _mapper.Map<List<ReadingArticleSummaryDto>>(articles);

        // Nếu user login, lấy thêm trạng thái tiến độ
        if (!string.IsNullOrEmpty(userId))
        {
            var ids = articles.Select(a => a.ArticleId);
            var progressList = await _assessmentRepo.GetProgressListAsync(userId, ids, ReferenceType.Reading, ct);

            foreach (var dto in dtos)
            {
                var p = progressList.FirstOrDefault(x => x.ReferenceId == dto.ArticleId);
                dto.Status = p?.Status.ToString() ?? "NotStarted";
            }
        }

        return dtos;
    }
}