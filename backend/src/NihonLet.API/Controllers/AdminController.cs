using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NihonLet.Application.Common.Models;
using NihonLet.Application.Features.Admin.DTOs;
using NihonLet.Application.Features.Admin.Queries;
using NihonLet.Domain.Constants;

namespace NihonLet.API.Controllers;

/// <summary>
/// API endpoints cho Admin — "Tình trạng hệ thống"
/// Chỉ Admin mới có quyền truy cập.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.Admin)]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // =============================================
    // GET /api/admin/dashboard
    // Tổng quan hệ thống (stats, charts, recent logs)
    // =============================================
    /// <summary>Lấy dữ liệu Dashboard tổng quan hệ thống</summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<SystemDashboardDto>>> GetDashboard()
    {
        var result = await _mediator.Send(new GetSystemDashboardQuery());
        return Ok(ApiResponse<SystemDashboardDto>.SuccessResult(result));
    }

    // =============================================
    // GET /api/admin/logs/application
    // Application Logs (phân trang + filter)
    // =============================================
    /// <summary>Lấy danh sách Application Logs (errors, warnings, info)</summary>
    [HttpGet("logs/application")]
    public async Task<ActionResult<ApiResponse<PaginatedResult<ApplicationLogDto>>>> GetApplicationLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? level = null,
        [FromQuery] string? search = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var result = await _mediator.Send(new GetApplicationLogsQuery(page, pageSize, level, search, from, to));
        return Ok(ApiResponse<PaginatedResult<ApplicationLogDto>>.SuccessResult(result));
    }

    // =============================================
    // GET /api/admin/logs/audit
    // Audit Logs (hành vi người dùng)
    // =============================================
    /// <summary>Lấy danh sách Audit Logs (hành vi người dùng)</summary>
    [HttpGet("logs/audit")]
    public async Task<ActionResult<ApiResponse<PaginatedResult<AuditLogDto>>>> GetAuditLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? userId = null,
        [FromQuery] string? action = null,
        [FromQuery] string? entityType = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var result = await _mediator.Send(new GetAuditLogsQuery(page, pageSize, userId, action, entityType, from, to));
        return Ok(ApiResponse<PaginatedResult<AuditLogDto>>.SuccessResult(result));
    }

    // =============================================
    // GET /api/admin/logs/requests
    // API Request Logs (performance monitoring)
    // =============================================
    /// <summary>Lấy danh sách API Request Logs</summary>
    [HttpGet("logs/requests")]
    public async Task<ActionResult<ApiResponse<PaginatedResult<ApiRequestLogDto>>>> GetApiRequestLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? method = null,
        [FromQuery] string? path = null,
        [FromQuery] int? statusCode = null,
        [FromQuery] long? minDurationMs = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var result = await _mediator.Send(new GetApiRequestLogsQuery(page, pageSize, method, path, statusCode, minDurationMs, from, to));
        return Ok(ApiResponse<PaginatedResult<ApiRequestLogDto>>.SuccessResult(result));
    }
}
