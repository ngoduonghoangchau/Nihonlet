using System.Text.Json;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Entities.Learning;
using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace NihonLet.Infrastructure.Persistence.Seed;

public class ReadingSeedService
{
    private readonly IApplicationDbContext _context;
    private readonly ISystemLogger _logger;

    public ReadingSeedService(IApplicationDbContext context, ISystemLogger logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        Console.WriteLine("🚀 ReadingSeedService: Bắt đầu kiểm tra...");
        try
        {
            var seedDir = Path.Combine(AppContext.BaseDirectory, "Persistence", "SeedData", "Reading");
            Console.WriteLine($"📂 Đang tìm file tại: {seedDir}");

            if (!Directory.Exists(seedDir)) 
            {
                Console.WriteLine("❌ LỖI: Không tìm thấy thư mục Reading trong bin! Hãy kiểm tra lại việc copy file.");
                return;
            }

            var files = Directory.GetFiles(seedDir, "*.json");
            Console.WriteLine($"📄 Tìm thấy {files.Length} file JSON.");

            // 1. Tải toàn bộ Category hiện có vào bộ nhớ một lần duy nhất
            var existingCategories = await _context.ReadingCategories.ToListAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            foreach (var file in files)
            {
                Console.WriteLine($"... Đang đọc file: {Path.GetFileName(file)}");
                var json = await File.ReadAllTextAsync(file);
                List<ReadingCategorySeedDto>? categoriesDto;

                // Xử lý linh hoạt: Nếu file bắt đầu bằng '{' thì là 1 object, '[' thì là 1 list
                if (json.TrimStart().StartsWith("{"))
                {
                    var single = JsonSerializer.Deserialize<ReadingCategorySeedDto>(json, options);
                    categoriesDto = single != null ? new List<ReadingCategorySeedDto> { single } : null;
                }
                else
                {
                    categoriesDto = JsonSerializer.Deserialize<List<ReadingCategorySeedDto>>(json, options);
                }

                if (categoriesDto == null || !categoriesDto.Any()) continue;

                foreach (var catDto in categoriesDto)
                {
                    var catName = catDto.NameVi.Trim();

                    // 2. Tìm Category trong Local Cache (existingCategories)
                    var category = existingCategories
                        .FirstOrDefault(c => c.NameVi.Trim().Equals(catName, StringComparison.OrdinalIgnoreCase));

                    if (category == null)
                    {
                        Console.WriteLine($"   ➕ Tạo mới Category: {catName}");
                        category = new ReadingCategory
                        {
                            NameVi = catName,
                            NameJp = catDto.NameJp,
                            IconUrl = catDto.IconUrl
                        };
                        _context.ReadingCategories.Add(category);

                        // Lưu ngay để SQL cấp ID thực cho category, tránh ID = 0 khi gán cho Article
                        await _context.SaveChangesAsync(CancellationToken.None);

                        // Cập nhật Cache để file tiếp theo nếu trùng NameVi sẽ không tạo mới nữa
                        existingCategories.Add(category);
                    }

                    foreach (var artDto in catDto.Articles)
                    {
                        // 3. Kiểm tra bài viết đã tồn tại chưa để tránh trùng nếu chạy Seed nhiều lần
                        // Dựa trên TitleJp và CatId
                        var articleExists = await _context.ReadingArticles
                            .AnyAsync(a => a.TitleJp == artDto.TitleJp && a.CatId == category.CatId);

                        if (articleExists) 
                        {
                            // Console.WriteLine($"   ⏭️ Bài viết đã có: {artDto.TitleJp} (Bỏ qua)");
                            continue;
                        }

                        if (!Enum.TryParse<JlptLevel>(artDto.Level, true, out var level))
                            continue;

                        var article = new ReadingArticle
                        {
                            CatId = category.CatId,
                            Level = level,
                            TitleJp = artDto.TitleJp,
                            TitleVi = artDto.TitleVi,
                            ContentJp = artDto.ContentJp,
                            ContentFurigana = artDto.ContentFurigana,
                            ContentVi = artDto.ContentVi,
                            Status = ContentStatus.Unlocked
                        };

                        _context.ReadingArticles.Add(article);
                        Console.WriteLine($"   ✅ Đã thêm bài: {artDto.TitleJp}");
                        // Lưu để có ArticleId cấp cho Question
                        await _context.SaveChangesAsync(CancellationToken.None);

                        if (artDto.Questions != null)
                        {
                            foreach (var qDto in artDto.Questions)
                            {
                                var question = new Question
                                {
                                    ReferenceId = article.ArticleId,
                                    ReferenceType = ReferenceType.Reading,
                                    QuestionText = qDto.QuestionText,
                                    Explanation = qDto.Explanation,
                                    Points = 10
                                };

                                _context.Questions.Add(question);
                                await _context.SaveChangesAsync(CancellationToken.None);

                                foreach (var oDto in qDto.Options)
                                {
                                    _context.Options.Add(new Option
                                    {
                                        QuestionId = question.QuestionId,
                                        OptionText = oDto.Text,
                                        IsCorrect = oDto.IsCorrect
                                    });
                                }
                            }
                        }
                    }
                    await _logger.LogInfoAsync($"Successfully processed file {Path.GetFileName(file)} for category: {catName}", "Seeder");
                }
            }

            // Lưu toàn bộ Option còn lại
            await _context.SaveChangesAsync(CancellationToken.None);
            Console.WriteLine("🏁 ReadingSeedService: Hoàn tất!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"🔥 LỖI SEEDING READING: {ex.Message}");
            await _logger.LogErrorAsync("Reading Seeding Failed", ex, "Seeder");
        }
    }
}

// DTOs phục vụ việc map JSON
public class ReadingCategorySeedDto
{
    public string NameVi { get; set; } = null!;
    public string NameJp { get; set; } = null!;
    public string? IconUrl { get; set; }
    public List<ReadingArticleSeedDto> Articles { get; set; } = new();
}

public class ReadingArticleSeedDto
{
    public string Level { get; set; } = null!;
    public string TitleJp { get; set; } = null!;
    public string TitleVi { get; set; } = null!;
    public string ContentJp { get; set; } = null!;
    public string ContentFurigana { get; set; } = null!;
    public string ContentVi { get; set; } = null!;
    public List<ReadingQuestionSeedDto>? Questions { get; set; }
}

public class ReadingQuestionSeedDto
{
    public string QuestionText { get; set; } = null!;
    public string Explanation { get; set; } = null!;
    public List<ReadingOptionSeedDto> Options { get; set; } = new();
}

public class ReadingOptionSeedDto
{
    public string Text { get; set; } = null!;
    public bool IsCorrect { get; set; }
}