using System.Collections.Generic;

namespace NihonLet.API.Common.Responses
{
    public class ApiResponse<T>
    {
        public bool Success { get; init; }
        public string? Code { get; init; }
        public string? Message { get; init; }
        public T? Data { get; init; }
        public IReadOnlyList<ApiError>? Errors { get; init; }

        private ApiResponse() { }

        public static ApiResponse<T> Ok(T data, string? message = null) => new()
        {
            Success = true,
            Data = data,
            Message = message
        };
        public static ApiResponse<T> Fail(string code, string message, List<ApiError>? errors = null) => new()
        {
            Success = false,
            Code = code,
            Message = message,
            Errors = errors
        };
    }
}
