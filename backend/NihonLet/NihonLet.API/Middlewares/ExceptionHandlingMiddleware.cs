using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using NihonLet.API.Common.Responses;
using Nihonlet.Application.Common.Exceptions;

namespace NihonLet.API.Middlewares
{
    public sealed class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");

                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            ApiResponse<object> response;
            int statusCode;

            switch (exception)
            {
                case ValidationException ve:
                    statusCode = StatusCodes.Status400BadRequest;
                    response = ApiResponse<object>.Fail(
                        code: "VALIDATION_ERRORS",
                        message: ve.Message,
                        errors: ve.Errors.Select(e => new ApiError
                        {
                            Field = string.Empty,
                            Message = e
                        }).ToList()
                    );
                    break;

                case ConflictException ce:
                    statusCode = StatusCodes.Status409Conflict;
                    response = ApiResponse<object>.Fail(
                        code: "CONFLICT",
                        message: ce.Message);
                    break;

                case UnauthorizedException ue:
                    statusCode = StatusCodes.Status401Unauthorized;
                    response = ApiResponse<object>.Fail(
                        code: "UNAUTHORIZED",
                        message: ue.Message);
                    break;

                default:
                    statusCode = StatusCodes.Status500InternalServerError;
                    response = ApiResponse<object>.Fail(
                        code: "INTERNAL_SERVER_ERROR",
                        message: "An unexpected error occurred.");
                    break; 
            }

            context.Response.StatusCode = statusCode;

            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }
}
