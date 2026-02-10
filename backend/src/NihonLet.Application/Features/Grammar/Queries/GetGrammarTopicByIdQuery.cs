using AutoMapper;
using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Grammar.DTOs;

namespace NihonLet.Application.Features.Grammar.Queries;

public record GetGrammarTopicByIdQuery(int Id) : IRequest<GrammarTopicDto?>;

public class GetGrammarTopicByIdHandler : IRequestHandler<GetGrammarTopicByIdQuery, GrammarTopicDto?>
{
    private readonly IGrammarRepository _grammarRepo;
    private readonly IMapper _mapper;

    public GetGrammarTopicByIdHandler(IGrammarRepository grammarRepo, IMapper mapper)
    {
        _grammarRepo = grammarRepo;
        _mapper = mapper;
    }

    public async Task<GrammarTopicDto?> Handle(GetGrammarTopicByIdQuery request, CancellationToken ct)
    {
        var topic = await _grammarRepo.GetByIdAsync(request.Id, ct);
        return _mapper.Map<GrammarTopicDto>(topic);
    }
}