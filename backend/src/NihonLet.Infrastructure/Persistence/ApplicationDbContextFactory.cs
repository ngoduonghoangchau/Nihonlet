using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace NihonLet.Infrastructure.Persistence;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // Lấy cấu hình từ file appsettings.json (nếu có) hoặc biến môi trường
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

        // Lấy connection string. Nếu không tìm thấy (do chạy trong class lib), dùng chuỗi mặc định local
        // Bạn hãy sửa lại chuỗi kết nối này cho đúng với SQL Server của bạn nếu cần
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
                               ?? "Server=.;Database=NihonLetDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true";

        builder.UseSqlServer(connectionString);

        return new ApplicationDbContext(builder.Options);
    }
}