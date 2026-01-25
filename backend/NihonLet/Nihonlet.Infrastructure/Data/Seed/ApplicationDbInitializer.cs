﻿using Microsoft.Extensions.DependencyInjection;

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

            // Tạm thời bỏ qua Seed từ file JSON để tránh lỗi đường dẫn cứng trong GrammarSeedService
            // await grammarSeeder.SeedAsync();
            await identitySeeder.SeedAsync();
        }
    }

}
