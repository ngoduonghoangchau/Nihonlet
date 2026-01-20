using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nihonlet.Application.Common.Interfaces;
using Nihonlet.Infrastructure.Authentication;
using Nihonlet.Infrastructure.Data.Seed;
using Nihonlet.Infrastructure.Identity;

namespace Nihonlet.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IIdentityService, IdentityService>();

            services.AddScoped<GrammarSeedService>();
            services.AddScoped<IdentitySeedService>();
            return services;
        }
    }
}
