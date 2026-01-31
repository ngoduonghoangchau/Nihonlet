using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Infrastructure.Data.Seed
{
    public class GrammarSeedService
    {
        private readonly ApplicationDbContext _context;

        public GrammarSeedService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            try 
            {
                // 1. Kiểm tra nếu đã có dữ liệu thì không seed nữa
                if (await _context.GrammarExercises.AnyAsync())
                {
                    Console.WriteLine("--> Grammar data already exists. Skipping seed.");
                    return;
                }

                // 2. Đường dẫn folder chứa file JSON
                // Tôi dùng đường dẫn tuyệt đối bạn đã cung cấp để đảm bảo chính xác 100% trên máy bạn
                var seedPath = @"D:\NihonletExe\Nihonlet\backend\NihonLet\Nihonlet.Infrastructure\Data\Seed\SeedData\Grammar\Minna";

                if (!Directory.Exists(seedPath))
                {
                    Console.WriteLine($"--> ERROR: Seed folder not found at {seedPath}");
                    return;
                }

                var files = Directory.GetFiles(seedPath, "*.json");
                Console.WriteLine($"--> Found {files.Length} JSON files to seed.");

                foreach (var file in files)
                {
                    Console.WriteLine($"--> Processing file: {Path.GetFileName(file)}");
                    var json = await File.ReadAllTextAsync(file);
                    
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var data = JsonSerializer.Deserialize<GrammarExerciseJsonModel>(json, options);

                    if (data == null) continue;

                    // Chèn Exercise
                    var exercise = new GrammarExercise(data.Title, data.Level, data.IsPremium);
                    _context.GrammarExercises.Add(exercise);
                    await _context.SaveChangesAsync(); 

                    // Chèn Questions
                    foreach (var q in data.Questions)
                    {
                        var question = new GrammarQuestion(exercise.Id, q.QuestionText, q.Explanation);
                        _context.GrammarQuestions.Add(question);
                        await _context.SaveChangesAsync();

                        // Chèn Options
                        foreach (var opt in q.Options)
                        {
                            question.AddOption(opt.Label, opt.Content, opt.IsCorrect);
                        }
                    }
                    Console.WriteLine($"--> Successfully seeded exercise: {data.Title}");
                }

                await _context.SaveChangesAsync();
                Console.WriteLine("--> Grammar Seed COMPLETED.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--> SEED ERROR: {ex.Message}");
                if (ex.InnerException != null) 
                    Console.WriteLine($"--> Inner Exception: {ex.InnerException.Message}");
            }
        }
    }

    // Các class hứng dữ liệu từ JSON (Đảm bảo các thuộc tính này khớp với file JSON)
    public class GrammarExerciseJsonModel
    {
        public string Title { get; set; } = null!;
        public string Level { get; set; } = null!;
        public bool IsPremium { get; set; }
        public List<GrammarQuestionJsonModel> Questions { get; set; } = [];
    }

    public class GrammarQuestionJsonModel
    {
        public string QuestionText { get; set; } = null!;
        public string Explanation { get; set; } = null!;
        public List<GrammarOptionJsonModel> Options { get; set; } = [];
    }

    public class GrammarOptionJsonModel
    {
        public string Label { get; set; } = null!;
        public string Content { get; set; } = null!;
        public bool IsCorrect { get; set; }
    }
}