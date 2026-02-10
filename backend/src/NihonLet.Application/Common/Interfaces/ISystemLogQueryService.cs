using NihonLet.Application.Features.Admin.DTOs;

namespace NihonLet.Application.Common.Interfaces;

/// <summary>
/// Interface cho truy vấn logs từ MongoDB — dùng cho Admin Dashboard
/// </summary>
public interface ISystemLogQueryService
{
    // --- Dashboard tổng quan ---
    Task<SystemDashboardDto> GetDashboardAsync();

    // --- Application Logs (phân trang + filter) ---
    Task<PaginatedResult<ApplicationLogDto>> GetApplicationLogsAsync(
        int page = 1,
        int pageSize = 20,
        string? level = null,
        string? search = null,
        DateTime? from = null,
        DateTime? to = null);

    // --- Audit Logs (phân trang + filter) ---
    Task<PaginatedResult<AuditLogDto>> GetAuditLogsAsync(
        int page = 1,
        int pageSize = 20,
        string? userId = null,
        string? action = null,
        string? entityType = null,
        DateTime? from = null,
        DateTime? to = null);

    // --- API Request Logs (phân trang + filter) ---
    Task<PaginatedResult<ApiRequestLogDto>> GetApiRequestLogsAsync(
        int page = 1,
        int pageSize = 20,
        string? method = null,
        string? path = null,
        int? statusCode = null,
        long? minDurationMs = null,
        DateTime? from = null,
        DateTime? to = null);
}
