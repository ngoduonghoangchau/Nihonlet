using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using NihonLet.API.Middlewares;
using NihonLet.Application;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Infrastructure;
using NihonLet.Infrastructure.Identity;
using NihonLet.Infrastructure.Persistence;
using NihonLet.Infrastructure.Persistence.Seed; // Thêm using này

namespace NihonLet.API;

public partial class Program
{
    public static async Task Main(string[] args)
    {
        // 1. Load .env file
        string FindEnvFile(string startDir, int maxUp = 6)
        {
            var dir = new DirectoryInfo(startDir);
            for (int i = 0; i < maxUp && dir != null; i++)
            {
                var candidate = Path.Combine(dir.FullName, ".env");
                if (File.Exists(candidate)) return candidate;
                dir = dir.Parent;
            }
            return null;
        }

        var envPath = FindEnvFile(AppContext.BaseDirectory);
        if (envPath != null)
            DotNetEnv.Env.Load(envPath);

        var builder = WebApplication.CreateBuilder(args);

        // 2. Add layers
        builder.Services.AddApplication();
        builder.Services.AddInfrastructure(builder.Configuration);
        builder.Services.AddScoped<IReadingRepository, NihonLet.Infrastructure.Persistence.Repositories.ReadingRepository>();

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                // Chuyển Enum thành String trong JSON trả về
                options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
            });
        builder.Services.AddEndpointsApiExplorer();

        // 3. Swagger với JWT
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "NihonLet API", Version = "v1" });
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Nhập JWT token vào đây."
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                    },
                    Array.Empty<string>()
                }
            });
        });

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        builder.Services.AddProblemDetails();

        // 4. CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "https://nihonlet-44432.web.app", "https://nihonlet-44432.firebaseapp.com")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        var app = builder.Build();

        // 5. Database Migration & Seeding
        // Đưa ra ngoài dấu ngoặc IsDevelopment để chạy được trên Render (Production)
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var logger = services.GetRequiredService<ILogger<Program>>();

            try
            {
                var context = services.GetRequiredService<ApplicationDbContext>();
                var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
                var configuration = services.GetRequiredService<IConfiguration>();

                // A. Luôn chạy Migrate để tạo bảng trên SQL Server của MonsterASP
                logger.LogInformation("--- NihonLet Cloud: Đang kiểm tra và cập nhật Database Schema ---");
                await context.Database.MigrateAsync();

                // B. Seed Identity (Admin, Roles, v.v.)
                logger.LogInformation("--- NihonLet Cloud: Đang kiểm tra dữ liệu Identity mặc định ---");
                await ApplicationDbContextSeed.SeedDefaultsAsync(context, userManager, roleManager, configuration, logger);

                // C. SEED DỮ LIỆU NGỮ PHÁP (Grammar)
                try
                {
                    logger.LogInformation("--- NihonLet Cloud: Đang nạp dữ liệu Grammar từ JSON ---");
                    var grammarSeeder = services.GetRequiredService<GrammarSeedService>();
                    await grammarSeeder.SeedAsync();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "!!! NihonLet Cloud: Lỗi nạp Grammar JSON nhưng app vẫn sẽ tiếp tục.");
                }

                // D. SEED DỮ LIỆU BÀI ĐỌC (Reading)
                try
                {
                    logger.LogInformation("--- NihonLet Cloud: Đang nạp dữ liệu Reading từ JSON ---");
                    var readingSeeder = services.GetRequiredService<ReadingSeedService>();
                    await readingSeeder.SeedAsync();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "!!! NihonLet Cloud: Lỗi nạp Reading JSON nhưng app vẫn sẽ tiếp tục.");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "!!! NihonLet Cloud: Lỗi nghiêm trọng khi khởi tạo hệ thống dữ liệu.");
            }
        }

        app.UseSwagger();
        app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "NihonLet API v1");
                options.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
            });
        // 6. Cấu hình Middleware Pipeline
        if (app.Environment.IsDevelopment())
        {
            ///comment useswagger ở đây để tránh lỗi khi chạy môi trường production mà không có swagger
            // Tự động chuyển hướng từ trang chủ (/) sang Swagger UI
            app.MapGet("/", () => Results.Redirect("/swagger/index.html"));
        }

        app.UseExceptionHandler();

        app.UseHttpsRedirection();
        app.UseCors("AllowFrontend");

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        await app.RunAsync();
    }
}

public partial class Program { }