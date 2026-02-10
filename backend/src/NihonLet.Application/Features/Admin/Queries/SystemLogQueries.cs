using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Admin.DTOs;

namespace NihonLet.Application.Features.Admin.Queries;

// =============================================
// 1. Dashboard tổng quan
// =============================================

public record GetSystemDashboardQuery : IRequest<SystemDashboardDto>;

public class GetSystemDashboardQueryHandler(ISystemLogQueryService logService)
    : IRequestHandler<GetSystemDashboardQuery, SystemDashboardDto>
{
    public Task<SystemDashboardDto> Handle(GetSystemDashboardQuery request, CancellationToken ct)
        => logService.GetDashboardAsync();
}

// =============================================
// 2. Application Logs (errors, warnings, info)
// =============================================

public record GetApplicationLogsQuery(
    int Page = 1,
    int PageSize = 20,
    string? Level = null,
    string? Search = null,
    DateTime? From = null,
    DateTime? To = null
) : IRequest<PaginatedResult<ApplicationLogDto>>;

public class GetApplicationLogsQueryHandler(ISystemLogQueryService logService)
    : IRequestHandler<GetApplicationLogsQuery, PaginatedResult<ApplicationLogDto>>
{
    public Task<PaginatedResult<ApplicationLogDto>> Handle(GetApplicationLogsQuery q, CancellationToken ct)
        => logService.GetApplicationLogsAsync(q.Page, q.PageSize, q.Level, q.Search, q.From, q.To);
}

// =============================================
// 3. Audit Logs (hành vi người dùng)
// =============================================

public record GetAuditLogsQuery(
    int Page = 1,
    int PageSize = 20,
    string? UserId = null,
    string? Action = null,
    string? EntityType = null,
    DateTime? From = null,
    DateTime? To = null
) : IRequest<PaginatedResult<AuditLogDto>>;

public class GetAuditLogsQueryHandler(ISystemLogQueryService logService)
    : IRequestHandler<GetAuditLogsQuery, PaginatedResult<AuditLogDto>>
{
    public Task<PaginatedResult<AuditLogDto>> Handle(GetAuditLogsQuery q, CancellationToken ct)
        => logService.GetAuditLogsAsync(q.Page, q.PageSize, q.UserId, q.Action, q.EntityType, q.From, q.To);
}

// =============================================
// 4. API Request Logs (performance monitoring)
// =============================================

public record GetApiRequestLogsQuery(
    int Page = 1,
    int PageSize = 20,
    string? Method = null,
    string? Path = null,
    int? StatusCode = null,
    long? MinDurationMs = null,
    DateTime? From = null,
    DateTime? To = null
) : IRequest<PaginatedResult<ApiRequestLogDto>>;

public class GetApiRequestLogsQueryHandler(ISystemLogQueryService logService)
    : IRequestHandler<GetApiRequestLogsQuery, PaginatedResult<ApiRequestLogDto>>
{
    public Task<PaginatedResult<ApiRequestLogDto>> Handle(GetApiRequestLogsQuery q, CancellationToken ct)
        => logService.GetApiRequestLogsAsync(q.Page, q.PageSize, q.Method, q.Path, q.StatusCode, q.MinDurationMs, q.From, q.To);
}
