using AutoMapper;
using System.Text.Json;
// Import namespace chứa các Entity (Question, Option, GrammarTopic)
using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Entities.Learning;
// Import namespace chứa các DTO của chính nó
namespace NihonLet.Application.Features.Grammar.DTOs; // Phải có dòng này ở đầu file

// LỖI CreateMap: Phải kế thừa từ Profile
public class GrammarMappingProfile : Profile
{
    public GrammarMappingProfile()
    {
        // Mapping cho GrammarTopic
        CreateMap<GrammarTopic, GrammarTopicDto>()
            .ForMember(d => d.Level, opt => opt.MapFrom(s => s.Level.ToString()))
            // Member 'Examples' bây giờ đã tồn tại ở đích (Destination)
            .ForMember(d => d.Examples, opt => opt.MapFrom(s => 
                string.IsNullOrEmpty(s.ExampleJson) 
                ? new List<string>() 
                : JsonSerializer.Deserialize<List<string>>(s.ExampleJson, (JsonSerializerOptions)null!)));

        // LỖI Question, QuestionDto: Đã có using Assessment và DTOs ở trên
        CreateMap<Question, QuestionDto>();

        // LỖI Option, OptionDto: Đã có using Assessment và DTOs ở trên
        CreateMap<Option, OptionDto>();
    }
}