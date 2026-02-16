using System.Text.Json;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Entities.Learning;
using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace NihonLet.Infrastructure.Persistence.Seed;

public class GrammarSeedService
{
    private readonly IApplicationDbContext _context;
    private readonly ISystemLogger _logger;

    public GrammarSeedService(IApplicationDbContext context, ISystemLogger logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        // 1. Kiểm tra nếu đã có dữ liệu thì không nạp nữa
        if (await _context.GrammarTopics.AnyAsync()) return;

        try
        {
            var seedDir = Path.Combine(AppContext.BaseDirectory, "Persistence", "SeedData", "Grammar");
            if (!Directory.Exists(seedDir)) return;

            var files = Directory.GetFiles(seedDir, "*.json");
            foreach (var file in files)
            {
                var json = await File.ReadAllTextAsync(file);
                var topicsDto = JsonSerializer.Deserialize<List<GrammarSeedDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (topicsDto == null) continue;

                foreach (var tDto in topicsDto)
                {
                    // 2. Nạp GrammarTopic vào SQL
                    var topic = new GrammarTopic
                    {
                        Title = tDto.Title,
                        Level = Enum.Parse<JlptLevel>(tDto.Level),
                        Description = tDto.Description,
                        ExampleJson = JsonSerializer.Serialize(tDto.Examples) // Convert List sang string JSON
                    };
                    _context.GrammarTopics.Add(topic);
                    await _context.SaveChangesAsync(CancellationToken.None);

                    // 3. Nạp Questions & Options
                    foreach (var qDto in tDto.Questions)
                    {
                        var question = new Question
                        {
                            ReferenceId = topic.TopicId, // Lấy ID vừa sinh ra từ SQL
                            ReferenceType = ReferenceType.Grammar,
                            QuestionText = qDto.QuestionText,
                            Explanation = qDto.Explanation,
                            Points = qDto.Points
                        };
                        _context.Questions.Add(question);
                        await _context.SaveChangesAsync(CancellationToken.None);

                        foreach (var oDto in qDto.Options)
                        {
                            _context.Options.Add(new Option
                            {
                                QuestionId = question.QuestionId,
                                OptionText = oDto.OptionText,
                                IsCorrect = oDto.IsCorrect
                            });
                        }
                    }
                    // Ghi Log vào MongoDB mỗi khi nạp xong 1 bài học
                    await _logger.LogInfoAsync($"Seeded Grammar Topic: {topic.Title}", "Seeder");
                }
            }

            await _context.SaveChangesAsync(CancellationToken.None);
        }
        catch (Exception ex)
        {
            // Ghi Log lỗi vào MongoDB nếu quá trình Seeding thất bại
            await _logger.LogErrorAsync("Grammar Seeding Failed", ex, "Seeder");
        }
    }
}

// DTO phụ để map dữ liệu JSON
public class GrammarSeedDto {
    public string Title { get; set; } = null!;
    public string Level { get; set; } = null!;
    public string Description { get; set; } = null!;
    public List<string> Examples { get; set; } = new();
    public List<QuestionSeedDto> Questions { get; set; } = new();
}

public class QuestionSeedDto {
    public string QuestionText { get; set; } = null!;
    public string Explanation { get; set; } = null!;
    public int Points { get; set; }
    public List<OptionSeedDto> Options { get; set; } = new();
}

public class OptionSeedDto {
    public string OptionText  { get; set; } = null!;
    public bool IsCorrect { get; set; }
}