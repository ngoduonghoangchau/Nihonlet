using Microsoft.AspNetCore.Hosting;
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
            if (_context.GrammarExercises.Any())
                return;

            // var basePath = AppContext.BaseDirectory;

            // var seedPath = Path.Combine(
            //     basePath,
            //     "Nihonlet.Infrastructure",
            //     "Data",
            //     "Seed",
            //     "SeedData",
            //     "Grammar",
            //     "Minna"
            // );

            // if (!Directory.Exists(seedPath))
            //     throw new DirectoryNotFoundException($"Seed folder not found: {seedPath}");

            // var files = Directory.GetFiles(seedPath, "*.json");
            var files = Directory.GetFiles(@"D:\NihonletExe\Nihonlet\backend\NihonLet\Nihonlet.Infrastructure\Data\Seed\SeedData\Grammar\Minna", "*.json");

            //var basePath = AppContext.BaseDirectory;

            //var seedPath = Path.Combine(
            //    basePath,
            //    "Nihonlet.Infrastructure",
            //    "Data",
            //    "Seed",
            //    "SeedData",
            //    "Grammar",
            //    "Minna"
            //);

            //if (!Directory.Exists(seedPath))
            //    throw new DirectoryNotFoundException($"Seed folder not found: {seedPath}");

            //var files = Directory.GetFiles(seedPath, "*.json");

            //var files = Directory.GetFiles(@"D:\LearnCode\Combination of stack technology\React + ASP.NET Web API\Nihonlet\backend\NihonLet\Nihonlet.Infrastructure\Data\Seed\SeedData\Grammar\Minna", "*.json");

            var basePath = AppContext.BaseDirectory;
            var seedPath = Path.Combine(basePath,
                "SeedData", "Grammar", "Minna");
            var files = Directory.GetFiles(seedPath, "*.json");


            foreach (var file in files)
            {
                var json = await File.ReadAllTextAsync(file);
                // parse JSON → GrammarExercise + GrammarQuestion
            }

            await _context.SaveChangesAsync();
        }

    }

}
