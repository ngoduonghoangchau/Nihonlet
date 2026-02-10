using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Interfaces; 
using NihonLet.Infrastructure.Identity;
using NihonLet.Infrastructure.Persistence;
using NihonLet.Infrastructure.Persistence.Repositories; 

namespace NihonLet.Infrastructure;

/// <summary>
/// Extension methods để đăng ký các services của Infrastructure layer
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // SQL Server DbContext
        // Ưu tiên đọc từ environment variable, fallback sang appsettings
        var connectionString = Environment.GetEnvironmentVariable("NIHONLET_SQL_CONNECTION")
            ?? configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "SQL Connection string not found. Set NIHONLET_SQL_CONNECTION env var or add ConnectionStrings:DefaultConnection to config.");
        
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null);
            }));
        
        // Register IApplicationDbContext
        services.AddScoped<IApplicationDbContext>(provider => 
            provider.GetRequiredService<ApplicationDbContext>());
        
        // Identity
        services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            // Password settings
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequiredLength = 8;
            
            // User settings
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();
        
        // JWT Authentication
        var jwtSecret = GetJwtSecret(configuration);
        var key = Encoding.UTF8.GetBytes(jwtSecret);
        
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false; // Set true in production
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = "NihonLet",
                ValidateAudience = true,
                ValidAudience = "NihonLetApp",
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero // Không cho phép chênh lệch thời gian
            };
        });
        
        // HttpContext accessor (for CurrentUserService)
        services.AddHttpContextAccessor();
        
        // Identity Services
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        services.AddScoped<IDeckRepository, DeckRepository>();
        services.AddScoped<IGameRepository, GameRepository>();
        
        // MongoDB Logging Services
        services.AddSingleton<Logging.MongoDbContext>();
        services.AddScoped<ISystemLogger, Logging.SystemLogger>();
        services.AddScoped<ISystemLogQueryService, Logging.SystemLogQueryService>();
        
        return services;
    }
    
    /// <summary>
    /// Lấy chuỗi kết nối MongoDB từ environment variable
    /// </summary>
    public static string GetMongoConnectionString(IConfiguration configuration)
    {
        return Environment.GetEnvironmentVariable("NIHONLET_MONGODB_CONNECTION")
            ?? configuration.GetConnectionString("MongoDbConnection")
            ?? "mongodb://localhost:27017";
    }
    
    /// <summary>
    /// Lấy JWT Secret từ environment variable
    /// </summary>
    public static string GetJwtSecret(IConfiguration configuration)
    {
        return Environment.GetEnvironmentVariable("NIHONLET_JWT_SECRET")
            ?? configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException(
                "JWT Secret not found. Set NIHONLET_JWT_SECRET env var or add Jwt:Secret to config.");
    }
}
