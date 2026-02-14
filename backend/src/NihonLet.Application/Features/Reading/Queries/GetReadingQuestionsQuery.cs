using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Grammar.DTOs; // Dùng chung QuestionDto
using NihonLet.Domain.Enums;
using AutoMapper;

namespace NihonLet.Application.Features.Reading.Queries;

public record GetReadingQuestionsQuery(int ArticleId) : IRequest<List<QuestionDto>>;

public class GetReadingQuestionsHandler : IRequestHandler<GetReadingQuestionsQuery, List<QuestionDto>>
{
    private readonly IAssessmentRepository _repo;
    private readonly IMapper _mapper;

    public GetReadingQuestionsHandler(IAssessmentRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<List<QuestionDto>> Handle(GetReadingQuestionsQuery request, CancellationToken ct)
    {
        // Quan trọng: Truyền ReferenceType.Reading để lấy đúng câu hỏi bài đọc
        var questions = await _repo.GetQuestionsAsync(request.ArticleId, ReferenceType.Reading, ct);
        return _mapper.Map<List<QuestionDto>>(questions);
    }
}