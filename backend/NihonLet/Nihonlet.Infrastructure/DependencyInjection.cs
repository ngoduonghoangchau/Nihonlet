using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nihonlet.Application.Common.Interfaces;
using Nihonlet.Infrastructure.Authentication;
using Nihonlet.Infrastructure.Data.Seed;
using Nihonlet.Infrastructure.Identity;
using Nihonlet.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


namespace Nihonlet.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
            builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            // ĐĂNG KÝ Ở ĐÂY LÀ CHUẨN NHẤT
            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
            services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IIdentityService, IdentityService>();

            services.AddScoped<GrammarSeedService>();
            services.AddScoped<IdentitySeedService>();
            return services;
        }
    }
}
