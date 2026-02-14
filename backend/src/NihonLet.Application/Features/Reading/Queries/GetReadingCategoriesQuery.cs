using AutoMapper;
using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Reading.DTOs;

namespace NihonLet.Application.Features.Reading.Queries;

public record GetReadingCategoriesQuery : IRequest<List<ReadingCategoryDto>>;

public class GetReadingCategoriesHandler : IRequestHandler<GetReadingCategoriesQuery, List<ReadingCategoryDto>>
{
    private readonly IReadingRepository _readingRepo;
    private readonly IMapper _mapper;

    public GetReadingCategoriesHandler(IReadingRepository readingRepo, IMapper mapper)
    {
        _readingRepo = readingRepo;
        _mapper = mapper;
    }

    public async Task<List<ReadingCategoryDto>> Handle(GetReadingCategoriesQuery request, CancellationToken ct)
    {
        var categories = await _readingRepo.GetCategoriesAsync(ct);
        return _mapper.Map<List<ReadingCategoryDto>>(categories);
    }
}