using Microsoft.Extensions.DependencyInjection;

namespace Nihonlet.Infrastructure.Data.Seed
{
    public static class ApplicationDbInitializer
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();

            var context = scope.ServiceProvider
                .GetRequiredService<ApplicationDbContext>();

            var grammarSeeder = scope.ServiceProvider
                .GetRequiredService<GrammarSeedService>();

            var identitySeeder = scope.ServiceProvider
                .GetRequiredService<IdentitySeedService>();

            await grammarSeeder.SeedAsync();
            await identitySeeder.SeedAsync();
        }
    }

}
