namespace NihonLet.Application.Features.Admin.DTOs;

/// <summary>
/// DTO tổng quan hệ thống cho Admin Dashboard
/// </summary>
public class SystemDashboardDto
{
    // --- Thống kê tổng quan ---
    public long TotalApiRequests { get; set; }
    public long TotalErrors { get; set; }
    public long TotalWarnings { get; set; }
    public long TotalAuditActions { get; set; }
    public double AverageResponseTimeMs { get; set; }

    // --- Thống kê theo thời gian (24h gần nhất) ---
    public long RequestsLast24h { get; set; }
    public long ErrorsLast24h { get; set; }

    // --- Top endpoints chậm nhất ---
    public List<SlowEndpointDto> SlowestEndpoints { get; set; } = [];

    // --- Phân bố HTTP Status Code (24h) ---
    public List<StatusCodeDistributionDto> StatusCodeDistribution { get; set; } = [];

    // --- Hoạt động người dùng gần nhất ---
    public List<AuditLogDto> RecentAuditLogs { get; set; } = [];

    // --- Lỗi gần nhất ---
    public List<ApplicationLogDto> RecentErrors { get; set; } = [];

    // --- Requests per hour (24h chart data) ---
    public List<HourlyStatDto> RequestsPerHour { get; set; } = [];
}

/// <summary>Endpoint chậm nhất</summary>
public class SlowEndpointDto
{
    public string Method { get; set; } = null!;
    public string Path { get; set; } = null!;
    public double AverageDurationMs { get; set; }
    public long RequestCount { get; set; }
}

/// <summary>Phân bố status code</summary>
public class StatusCodeDistributionDto
{
    public int StatusCode { get; set; }
    public long Count { get; set; }
}

/// <summary>Thống kê theo giờ</summary>
public class HourlyStatDto
{
    public DateTime Hour { get; set; }
    public long RequestCount { get; set; }
    public long ErrorCount { get; set; }
}
