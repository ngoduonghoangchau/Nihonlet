using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using NihonLet.API.Middlewares;
using NihonLet.Application;
using NihonLet.Infrastructure;
using NihonLet.Infrastructure.Identity;
using NihonLet.Infrastructure.Persistence;

namespace NihonLet.API;

public partial class Program
{
    public static async Task Main(string[] args)
    {
        // Load .env file TRƯỚC KHI tạo builder
        // Điều này đảm bảo các biến môi trường có sẵn cho Configuration
        DotNetEnv.Env.Load();

        var builder = WebApplication.CreateBuilder(args);

        // Add layers
        builder.Services.AddApplication();
        builder.Services.AddInfrastructure(builder.Configuration);

        // Add API services
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();

        // Swagger với JWT Authentication
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "NihonLet API",
                Version = "v1",
                Description = "API cho ứng dụng học tiếng Nhật NihonLet"
            });

            // Thêm JWT Authentication vào Swagger
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Nhập JWT token vào đây. Ví dụ: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        // Global Exception Handler
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        builder.Services.AddProblemDetails();

        // CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        var app = builder.Build();

        // Database migration & seeding (Development only)
        if (app.Environment.IsDevelopment())
        {
            using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;

            try
            {
                var context = services.GetRequiredService<ApplicationDbContext>();
                var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
                var configuration = services.GetRequiredService<IConfiguration>();
                var logger = services.GetRequiredService<ILogger<Program>>();

                // Apply pending migrations
                await context.Database.MigrateAsync();

                // Seed data
                await ApplicationDbContextSeed.SeedDefaultsAsync(context, userManager, roleManager, configuration, logger);
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "Lỗi khi migrate/seed database");
            }
        }

        // Configure the HTTP request pipeline
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "NihonLet API v1");
                options.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
            });
        }

        // Global Exception Handler middleware
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