using AutoMapper;
using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Reading.DTOs;

namespace NihonLet.Application.Features.Reading.Queries;

public record GetReadingArticleByIdQuery(int Id) : IRequest<ReadingArticleDto?>;

public class GetReadingArticleByIdHandler : IRequestHandler<GetReadingArticleByIdQuery, ReadingArticleDto?>
{
    private readonly IReadingRepository _readingRepo;
    private readonly IMapper _mapper;

    public GetReadingArticleByIdHandler(IReadingRepository readingRepo, IMapper mapper)
    {
        _readingRepo = readingRepo;
        _mapper = mapper;
    }

    public async Task<ReadingArticleDto?> Handle(GetReadingArticleByIdQuery request, CancellationToken ct)
    {
        var article = await _readingRepo.GetArticleByIdAsync(request.Id, ct);
        return _mapper.Map<ReadingArticleDto>(article);
    }
}