using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using NihonLet.Infrastructure.Logging.Documents;

namespace NihonLet.Infrastructure.Logging;

/// <summary>
/// MongoDB context cho logging với các collections
/// </summary>
public class MongoDbContext
{
    private readonly IMongoDatabase _database;
    
    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = DependencyInjection.GetMongoConnectionString(configuration);
        var databaseName = configuration["MongoDb:DatabaseName"] ?? "nihonlet_logs";
        
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
        
        // Tạo indexes khi khởi tạo
        CreateIndexes();
    }
    
    /// <summary>Collection cho application logs</summary>
    public IMongoCollection<ApplicationLog> ApplicationLogs => 
        _database.GetCollection<ApplicationLog>("application_logs");
    
    /// <summary>Collection cho audit logs</summary>
    public IMongoCollection<AuditLog> AuditLogs => 
        _database.GetCollection<AuditLog>("audit_logs");
    
    /// <summary>Collection cho API request logs</summary>
    public IMongoCollection<ApiRequestLog> ApiRequestLogs => 
        _database.GetCollection<ApiRequestLog>("api_request_logs");
    
    private void CreateIndexes()
    {
        // Application logs: index on Timestamp, Level
        ApplicationLogs.Indexes.CreateOne(
            new CreateIndexModel<ApplicationLog>(
                Builders<ApplicationLog>.IndexKeys
                    .Descending(x => x.Timestamp)
                    .Ascending(x => x.Level)));
        
        // Audit logs: index on UserId, Timestamp
        AuditLogs.Indexes.CreateOne(
            new CreateIndexModel<AuditLog>(
                Builders<AuditLog>.IndexKeys
                    .Ascending(x => x.UserId)
                    .Descending(x => x.Timestamp)));
        
        // API request logs: index on Timestamp, Path
        ApiRequestLogs.Indexes.CreateOne(
            new CreateIndexModel<ApiRequestLog>(
                Builders<ApiRequestLog>.IndexKeys
                    .Descending(x => x.Timestamp)
                    .Ascending(x => x.Path)));
    }
}
