using MongoDB.Driver;
using MongoDB.Driver.Linq;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Admin.DTOs;
using NihonLet.Infrastructure.Logging.Documents;

namespace NihonLet.Infrastructure.Logging;

/// <summary>
/// Implementation của ISystemLogQueryService — truy vấn log từ MongoDB cho Admin Dashboard
/// </summary>
public class SystemLogQueryService : ISystemLogQueryService
{
    private readonly MongoDbContext _mongo;

    public SystemLogQueryService(MongoDbContext mongo)
    {
        _mongo = mongo;
    }

    // =========================================================================
    // Dashboard tổng quan
    // =========================================================================
    public async Task<SystemDashboardDto> GetDashboardAsync()
    {
        var now = DateTime.UtcNow;
        var last24h = now.AddHours(-24);

        // --- Thống kê tổng ---
        var totalRequests = await _mongo.ApiRequestLogs.CountDocumentsAsync(FilterDefinition<ApiRequestLog>.Empty);
        var totalErrors = await _mongo.ApplicationLogs.CountDocumentsAsync(
            Builders<ApplicationLog>.Filter.Eq(x => x.Level, "Error"));
        var totalWarnings = await _mongo.ApplicationLogs.CountDocumentsAsync(
            Builders<ApplicationLog>.Filter.Eq(x => x.Level, "Warning"));
        var totalAudit = await _mongo.AuditLogs.CountDocumentsAsync(FilterDefinition<AuditLog>.Empty);

        // --- 24h ---
        var tsFilter24h = Builders<ApiRequestLog>.Filter.Gte(x => x.Timestamp, last24h);
        var requests24h = await _mongo.ApiRequestLogs.CountDocumentsAsync(tsFilter24h);
        var errors24h = await _mongo.ApplicationLogs.CountDocumentsAsync(
            Builders<ApplicationLog>.Filter.Gte(x => x.Timestamp, last24h)
            & Builders<ApplicationLog>.Filter.Eq(x => x.Level, "Error"));

        // --- Average response time ---
        double avgResponseMs = 0;
        if (totalRequests > 0)
        {
            var pipeline = _mongo.ApiRequestLogs.Aggregate()
                .Group(x => 1, g => new { Avg = g.Average(x => (double)x.DurationMs) });
            var avgResult = await pipeline.FirstOrDefaultAsync();
            avgResponseMs = avgResult?.Avg ?? 0;
        }

        // --- Top 5 slowest endpoints (24h) ---
        var slowEndpoints = await _mongo.ApiRequestLogs.Aggregate()
            .Match(tsFilter24h)
            .Group(
                x => new { x.Method, x.Path },
                g => new SlowEndpointDto
                {
                    Method = g.Key.Method,
                    Path = g.Key.Path,
                    AverageDurationMs = g.Average(x => (double)x.DurationMs),
                    RequestCount = g.Count()
                })
            .SortByDescending(x => x.AverageDurationMs)
            .Limit(5)
            .ToListAsync();

        // --- Status code distribution (24h) ---
        var statusDist = await _mongo.ApiRequestLogs.Aggregate()
            .Match(tsFilter24h)
            .Group(
                x => x.StatusCode,
                g => new StatusCodeDistributionDto
                {
                    StatusCode = g.Key,
                    Count = g.Count()
                })
            .SortBy(x => x.StatusCode)
            .ToListAsync();

        // --- Requests per hour (24h chart data) ---
        var requestsPerHour = await GetRequestsPerHourAsync(last24h, now);

        // --- 10 audit logs gần nhất ---
        var recentAudit = await _mongo.AuditLogs
            .Find(FilterDefinition<AuditLog>.Empty)
            .SortByDescending(x => x.Timestamp)
            .Limit(10)
            .ToListAsync();

        // --- 10 errors gần nhất ---
        var recentErrors = await _mongo.ApplicationLogs
            .Find(Builders<ApplicationLog>.Filter.Eq(x => x.Level, "Error"))
            .SortByDescending(x => x.Timestamp)
            .Limit(10)
            .ToListAsync();

        return new SystemDashboardDto
        {
            TotalApiRequests = totalRequests,
            TotalErrors = totalErrors,
            TotalWarnings = totalWarnings,
            TotalAuditActions = totalAudit,
            AverageResponseTimeMs = Math.Round(avgResponseMs, 2),
            RequestsLast24h = requests24h,
            ErrorsLast24h = errors24h,
            SlowestEndpoints = slowEndpoints,
            StatusCodeDistribution = statusDist,
            RecentAuditLogs = recentAudit.Select(MapAuditLog).ToList(),
            RecentErrors = recentErrors.Select(MapApplicationLog).ToList(),
            RequestsPerHour = requestsPerHour
        };
    }

    // =========================================================================
    // Application Logs (phân trang + filter)
    // =========================================================================
    public async Task<PaginatedResult<ApplicationLogDto>> GetApplicationLogsAsync(
        int page, int pageSize, string? level, string? search, DateTime? from, DateTime? to)
    {
        var builder = Builders<ApplicationLog>.Filter;
        var filter = builder.Empty;

        if (!string.IsNullOrEmpty(level))
            filter &= builder.Eq(x => x.Level, level);

        if (!string.IsNullOrEmpty(search))
            filter &= builder.Regex(x => x.Message, new MongoDB.Bson.BsonRegularExpression(search, "i"));

        if (from.HasValue)
            filter &= builder.Gte(x => x.Timestamp, from.Value.ToUniversalTime());

        if (to.HasValue)
            filter &= builder.Lte(x => x.Timestamp, to.Value.ToUniversalTime());

        var totalCount = await _mongo.ApplicationLogs.CountDocumentsAsync(filter);
        var items = await _mongo.ApplicationLogs
            .Find(filter)
            .SortByDescending(x => x.Timestamp)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return new PaginatedResult<ApplicationLogDto>
        {
            Items = items.Select(MapApplicationLog).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    // =========================================================================
    // Audit Logs (phân trang + filter)
    // =========================================================================
    public async Task<PaginatedResult<AuditLogDto>> GetAuditLogsAsync(
        int page, int pageSize, string? userId, string? action, string? entityType, DateTime? from, DateTime? to)
    {
        var builder = Builders<AuditLog>.Filter;
        var filter = builder.Empty;

        if (!string.IsNullOrEmpty(userId))
            filter &= builder.Eq(x => x.UserId, userId);

        if (!string.IsNullOrEmpty(action))
            filter &= builder.Eq(x => x.Action, action);

        if (!string.IsNullOrEmpty(entityType))
            filter &= builder.Eq(x => x.EntityType, entityType);

        if (from.HasValue)
            filter &= builder.Gte(x => x.Timestamp, from.Value.ToUniversalTime());

        if (to.HasValue)
            filter &= builder.Lte(x => x.Timestamp, to.Value.ToUniversalTime());

        var totalCount = await _mongo.AuditLogs.CountDocumentsAsync(filter);
        var items = await _mongo.AuditLogs
            .Find(filter)
            .SortByDescending(x => x.Timestamp)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return new PaginatedResult<AuditLogDto>
        {
            Items = items.Select(MapAuditLog).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    // =========================================================================
    // API Request Logs (phân trang + filter)
    // =========================================================================
    public async Task<PaginatedResult<ApiRequestLogDto>> GetApiRequestLogsAsync(
        int page, int pageSize, string? method, string? path, int? statusCode, long? minDurationMs,
        DateTime? from, DateTime? to)
    {
        var builder = Builders<ApiRequestLog>.Filter;
        var filter = builder.Empty;

        if (!string.IsNullOrEmpty(method))
            filter &= builder.Eq(x => x.Method, method.ToUpperInvariant());

        if (!string.IsNullOrEmpty(path))
            filter &= builder.Regex(x => x.Path, new MongoDB.Bson.BsonRegularExpression(path, "i"));

        if (statusCode.HasValue)
            filter &= builder.Eq(x => x.StatusCode, statusCode.Value);

        if (minDurationMs.HasValue)
            filter &= builder.Gte(x => x.DurationMs, minDurationMs.Value);

        if (from.HasValue)
            filter &= builder.Gte(x => x.Timestamp, from.Value.ToUniversalTime());

        if (to.HasValue)
            filter &= builder.Lte(x => x.Timestamp, to.Value.ToUniversalTime());

        var totalCount = await _mongo.ApiRequestLogs.CountDocumentsAsync(filter);
        var items = await _mongo.ApiRequestLogs
            .Find(filter)
            .SortByDescending(x => x.Timestamp)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return new PaginatedResult<ApiRequestLogDto>
        {
            Items = items.Select(MapApiRequestLog).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    // =========================================================================
    // Private helpers — hourly aggregation
    // =========================================================================
    private async Task<List<HourlyStatDto>> GetRequestsPerHourAsync(DateTime from, DateTime to)
    {
        // Generate all 24 hour slots first
        var hours = Enumerable.Range(0, 24)
            .Select(i => from.AddHours(i))
            .Select(h => new DateTime(h.Year, h.Month, h.Day, h.Hour, 0, 0, DateTimeKind.Utc))
            .ToList();

        // Request counts per hour from MongoDB
        var requestCounts = await _mongo.ApiRequestLogs.Aggregate()
            .Match(Builders<ApiRequestLog>.Filter.Gte(x => x.Timestamp, from)
                 & Builders<ApiRequestLog>.Filter.Lt(x => x.Timestamp, to))
            .Group(
                x => new { x.Timestamp.Year, x.Timestamp.Month, x.Timestamp.Day, x.Timestamp.Hour },
                g => new { g.Key, Count = g.Count() })
            .ToListAsync();

        // Error counts per hour
        var errorCounts = await _mongo.ApplicationLogs.Aggregate()
            .Match(Builders<ApplicationLog>.Filter.Gte(x => x.Timestamp, from)
                 & Builders<ApplicationLog>.Filter.Lt(x => x.Timestamp, to)
                 & Builders<ApplicationLog>.Filter.Eq(x => x.Level, "Error"))
            .Group(
                x => new { x.Timestamp.Year, x.Timestamp.Month, x.Timestamp.Day, x.Timestamp.Hour },
                g => new { g.Key, Count = g.Count() })
            .ToListAsync();

        return hours.Select(h =>
        {
            var reqMatch = requestCounts.FirstOrDefault(
                r => r.Key.Year == h.Year && r.Key.Month == h.Month && r.Key.Day == h.Day && r.Key.Hour == h.Hour);
            var errMatch = errorCounts.FirstOrDefault(
                r => r.Key.Year == h.Year && r.Key.Month == h.Month && r.Key.Day == h.Day && r.Key.Hour == h.Hour);
            return new HourlyStatDto
            {
                Hour = h,
                RequestCount = reqMatch?.Count ?? 0,
                ErrorCount = errMatch?.Count ?? 0
            };
        }).ToList();
    }

    // =========================================================================
    // Mapping helpers
    // =========================================================================
    private static ApplicationLogDto MapApplicationLog(ApplicationLog doc) => new()
    {
        Id = doc.Id ?? "",
        Level = doc.Level,
        Message = doc.Message,
        Source = doc.Source,
        UserId = doc.UserId,
        RequestPath = doc.RequestPath,
        CorrelationId = doc.CorrelationId,
        Metadata = doc.Metadata,
        Exception = doc.Exception != null ? MapExceptionDetail(doc.Exception) : null,
        Timestamp = doc.Timestamp
    };

    private static ExceptionDetailDto MapExceptionDetail(ExceptionDetail ex) => new()
    {
        Type = ex.Type,
        Message = ex.Message,
        StackTrace = ex.StackTrace,
        InnerException = ex.InnerException != null ? MapExceptionDetail(ex.InnerException) : null
    };

    private static AuditLogDto MapAuditLog(AuditLog doc) => new()
    {
        Id = doc.Id ?? "",
        UserId = doc.UserId,
        Action = doc.Action,
        EntityType = doc.EntityType,
        EntityId = doc.EntityId,
        OldValue = doc.OldValue,
        NewValue = doc.NewValue,
        IpAddress = doc.IpAddress,
        UserAgent = doc.UserAgent,
        Result = doc.Result,
        FailureReason = doc.FailureReason,
        Timestamp = doc.Timestamp
    };

    private static ApiRequestLogDto MapApiRequestLog(ApiRequestLog doc) => new()
    {
        Id = doc.Id ?? "",
        Method = doc.Method,
        Path = doc.Path,
        QueryString = doc.QueryString,
        StatusCode = doc.StatusCode,
        DurationMs = doc.DurationMs,
        UserId = doc.UserId,
        IpAddress = doc.IpAddress,
        UserAgent = doc.UserAgent,
        ResponseSize = doc.ResponseSize,
        CorrelationId = doc.CorrelationId,
        Timestamp = doc.Timestamp
    };
}
