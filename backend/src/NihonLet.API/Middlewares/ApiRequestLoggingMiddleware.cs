using System.Diagnostics;
using System.Security.Claims;
using NihonLet.Application.Common.Interfaces;

namespace NihonLet.API.Middlewares;

/// <summary>
/// Middleware ghi log mọi HTTP request vào MongoDB.
/// Ghi: method, path, status code, response time, userId, IP address.
/// Đặt sớm nhất trong pipeline để đo toàn bộ thời gian xử lý.
/// </summary>
public class ApiRequestLoggingMiddleware
{
    private readonly RequestDelegate _next;

    // Các path không cần log (tránh spam)
    private static readonly HashSet<string> ExcludedPaths = new(StringComparer.OrdinalIgnoreCase)
    {
        "/swagger",
        "/health",
        "/favicon.ico",
        "/_framework",
    };

    public ApiRequestLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ISystemLogger logger)
    {
        var path = context.Request.Path.Value ?? "/";

        // Bỏ qua các path không cần log
        if (ExcludedPaths.Any(excluded => path.StartsWith(excluded, StringComparison.OrdinalIgnoreCase)))
        {
            await _next(context);
            return;
        }

        var sw = Stopwatch.StartNew();

        try
        {
            await _next(context);
        }
        finally
        {
            sw.Stop();

            var userId = context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var method = context.Request.Method;
            var statusCode = context.Response.StatusCode;
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();

            // Fire-and-forget: không block response để ghi log
            _ = Task.Run(async () =>
            {
                try
                {
                    await logger.LogApiRequestAsync(
                        method,
                        path,
                        statusCode,
                        sw.ElapsedMilliseconds,
                        userId,
                        ipAddress);
                }
                catch
                {
                    // Logging failure: không nên crash app
                }
            });
        }
    }
}

/// <summary>
/// Extension method để đăng ký middleware trong pipeline
/// </summary>
public static class ApiRequestLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseApiRequestLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ApiRequestLoggingMiddleware>();
    }
}
