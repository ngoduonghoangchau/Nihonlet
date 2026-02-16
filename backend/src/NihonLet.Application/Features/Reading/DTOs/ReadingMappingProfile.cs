using AutoMapper;
using NihonLet.Domain.Entities.Learning;
namespace NihonLet.Application.Features.Reading.DTOs;
public class ReadingMappingProfile : Profile
{
    public ReadingMappingProfile()
    {
        CreateMap<ReadingCategory, ReadingCategoryDto>();
        
        CreateMap<ReadingArticle, ReadingArticleSummaryDto>()
            .ForMember(d => d.Level, opt => opt.MapFrom(s => s.Level.ToString()))
            .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category != null ? s.Category.NameVi : ""));

        CreateMap<ReadingArticle, ReadingArticleDto>()
            .ForMember(d => d.Level, opt => opt.MapFrom(s => s.Level.ToString()));
    }
}