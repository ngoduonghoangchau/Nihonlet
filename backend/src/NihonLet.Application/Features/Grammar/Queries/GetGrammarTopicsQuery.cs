using AutoMapper;
using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Grammar.DTOs;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Grammar.Queries;

public record GetGrammarTopicsQuery(JlptLevel? Level) : IRequest<List<GrammarTopicDto>>;

public class GetGrammarTopicsHandler : IRequestHandler<GetGrammarTopicsQuery, List<GrammarTopicDto>>
{
    private readonly IGrammarRepository _grammarRepo;
    private readonly IMapper _mapper;

    public GetGrammarTopicsHandler(IGrammarRepository grammarRepo, IMapper mapper)
    {
        _grammarRepo = grammarRepo;
        _mapper = mapper;
    }

    public async Task<List<GrammarTopicDto>> Handle(GetGrammarTopicsQuery request, CancellationToken ct)
    {
        var topics = request.Level.HasValue 
            ? await _grammarRepo.GetTopicsByLevelAsync(request.Level.Value, ct)
            : await _grammarRepo.GetAllTopicsAsync(ct);

        return _mapper.Map<List<GrammarTopicDto>>(topics);
    }
}