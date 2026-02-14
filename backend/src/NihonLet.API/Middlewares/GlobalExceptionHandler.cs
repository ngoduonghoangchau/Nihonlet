using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Diagnostics;
using NihonLet.Application.Common.Exceptions;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Common.Models;
using Microsoft.Extensions.DependencyInjection;

namespace NihonLet.API.Middlewares;

/// <summary>
/// Global exception handler để convert exceptions thành ApiResponse format
/// và ghi lỗi vào MongoDB thông qua ISystemLogger.
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    // private readonly ISystemLogger _systemLogger;
    private readonly IServiceScopeFactory _scopeFactory;
    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        // _systemLogger = systemLogger;
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, response) = MapExceptionToResponse(exception);
        
        // Log exception qua built-in logger
        if (statusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception occurred: {Message}", exception.Message);
        }
        else
        {
            _logger.LogWarning("Handled exception: {ExceptionType} - {Message}", 
                exception.GetType().Name, exception.Message);
        }

        // Ghi lỗi vào MongoDB (fire-and-forget, không block response)
        var userId = httpContext.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var path = httpContext.Request.Path.Value ?? "unknown";
        _ = Task.Run(async () =>
        {
            try
            {
                // Tạo một scope mới cho background task
                using var scope = _scopeFactory.CreateScope();
                var systemLogger = scope.ServiceProvider.GetRequiredService<ISystemLogger>();

                if (statusCode == HttpStatusCode.InternalServerError)
                {
                    await systemLogger.LogErrorAsync(
                        $"Unhandled: {exception.Message}",
                        exception,
                        httpContext.Request.Path.Value ?? "unknown",
                        userId);
                }
                else
                {
                    await systemLogger.LogWarningAsync(
                        $"{exception.GetType().Name}: {exception.Message}",
                        httpContext.Request.Path.Value ?? "unknown",
                        userId);
                }
            }
            catch (Exception ex)
            {
                // Dùng logger của class để ghi lại nếu việc ghi log vào MongoDB thất bại
                _logger.LogError(ex, "Failed to write log to MongoDB in background task");
            }
        });

        httpContext.Response.StatusCode = (int)statusCode;
        httpContext.Response.ContentType = "application/json; charset=utf-8";

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        await httpContext.Response.WriteAsync(
            JsonSerializer.Serialize(response, jsonOptions),
            cancellationToken);

        return true;
    }

    private static (HttpStatusCode StatusCode, ApiResponse Response) MapExceptionToResponse(Exception exception)
    {
        return exception switch
        {
            ValidationException validationEx => (
                HttpStatusCode.BadRequest,
                ApiResponse.ValidationFailResult(validationEx.Errors)
            ),

            NotFoundException notFoundEx => (
                HttpStatusCode.NotFound,
                ApiResponse.FailResult(notFoundEx.Message, "NOT_FOUND")
            ),

            ForbiddenException forbiddenEx => (
                HttpStatusCode.Forbidden,
                ApiResponse.FailResult(forbiddenEx.Message, "FORBIDDEN")
            ),

            BusinessRuleException businessEx => (
                HttpStatusCode.UnprocessableEntity,
                new ApiResponse
                {
                    Success = false,
                    Message = businessEx.Message,
                    ErrorCode = "BUSINESS_RULE_VIOLATED",
                    Errors = businessEx.Violations
                        .GroupBy(v => v.RuleCode)
                        .ToDictionary(g => g.Key, g => g.Select(v => v.UserMessage).ToArray())
                }
            ),

            UnauthorizedAccessException unauthorizedEx => (
                HttpStatusCode.Unauthorized,
                ApiResponse.FailResult(
                    unauthorizedEx.Message ?? "Bạn cần đăng nhập để thực hiện hành động này.",
                    "UNAUTHORIZED")
            ),

            _ => (
                HttpStatusCode.InternalServerError,
                ApiResponse.FailResult(
                    "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
                    "INTERNAL_ERROR")
            )
        };
    }
}
