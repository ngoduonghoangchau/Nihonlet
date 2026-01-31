using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NihonLet.Domain.Constants;
using NihonLet.Infrastructure.Identity;

namespace NihonLet.Infrastructure.Persistence;

/// <summary>
/// Seed dữ liệu ban đầu cho database
/// </summary>
public static class ApplicationDbContextSeed
{
    /// <summary>
    /// Seed roles và admin user
    /// </summary>
    public static async Task SeedDefaultsAsync(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration,
        ILogger logger)
    {
        // Seed Roles
        await SeedRolesAsync(roleManager, logger);

        // Seed Admin User
        await SeedAdminUserAsync(userManager, configuration, logger);

        await context.SaveChangesAsync();
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager, ILogger logger)
    {
        foreach (var roleName in Roles.All)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
                logger.LogInformation("Đã tạo role: {RoleName}", roleName);
            }
        }
    }

    private static async Task SeedAdminUserAsync(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration,
        ILogger logger)
    {
        // Đọc credentials từ environment variables
        var adminEmail = Environment.GetEnvironmentVariable("NIHONLET_ADMIN_EMAIL")
            ?? configuration["Admin:Email"];
        var adminPassword = Environment.GetEnvironmentVariable("NIHONLET_ADMIN_PASSWORD")
            ?? configuration["Admin:Password"];

        // Validate credentials
        if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
        {
            logger.LogWarning(
                "Admin credentials không được cấu hình. " +
                "Vui lòng set NIHONLET_ADMIN_EMAIL và NIHONLET_ADMIN_PASSWORD environment variables " +
                "hoặc cấu hình trong appsettings.json (Admin:Email, Admin:Password). " +
                "Bỏ qua việc seed admin user.");
            return;
        }

        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "System Administrator",
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, Roles.Admin);
                await userManager.AddToRoleAsync(adminUser, Roles.User);
                logger.LogInformation("Đã tạo admin user: {Email}", adminEmail);
            }
            else
            {
                logger.LogError("Không thể tạo admin user: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }
}
