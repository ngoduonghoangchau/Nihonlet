using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Diagnostics;
using NihonLet.Application.Common.Exceptions;
using NihonLet.Application.Common.Models;

namespace NihonLet.API.Middlewares;

/// <summary>
/// Global exception handler để convert exceptions thành ApiResponse format
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, response) = MapExceptionToResponse(exception);
        
        // Log exception
        if (statusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception occurred: {Message}", exception.Message);
        }
        else
        {
            _logger.LogWarning("Handled exception: {ExceptionType} - {Message}", 
                exception.GetType().Name, exception.Message);
        }

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
