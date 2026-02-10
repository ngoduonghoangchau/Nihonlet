using AutoMapper;
using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Grammar.DTOs;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Grammar.Queries;

public record GetQuestionsByTopicQuery(int TopicId) : IRequest<List<QuestionDto>>;

public class GetQuestionsByTopicHandler : IRequestHandler<GetQuestionsByTopicQuery, List<QuestionDto>>
{
    private readonly IAssessmentRepository _assessmentRepo;
    private readonly IMapper _mapper;

    public GetQuestionsByTopicHandler(IAssessmentRepository assessmentRepo, IMapper mapper)
    {
        _assessmentRepo = assessmentRepo;
        _mapper = mapper;
    }

    public async Task<List<QuestionDto>> Handle(GetQuestionsByTopicQuery request, CancellationToken ct)
    {
        var questions = await _assessmentRepo.GetQuestionsAsync(request.TopicId, ReferenceType.Grammar, ct);
        return _mapper.Map<List<QuestionDto>>(questions);
    }
}