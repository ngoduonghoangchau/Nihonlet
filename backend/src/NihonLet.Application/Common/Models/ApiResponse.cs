using System.Text.Json.Serialization;

namespace NihonLet.Application.Common.Models;

/// <summary>
/// Standard API response wrapper cho tất cả endpoints
/// </summary>
/// <typeparam name="T">Kiểu dữ liệu của Data</typeparam>
public class ApiResponse<T>
{
    /// <summary>Trạng thái thành công/thất bại</summary>
    public bool Success { get; set; }
    
    /// <summary>Dữ liệu trả về (nếu thành công)</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public T? Data { get; set; }
    
    /// <summary>Message mô tả kết quả</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Message { get; set; }
    
    /// <summary>Chi tiết lỗi validation (nếu có)</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IDictionary<string, string[]>? Errors { get; set; }
    
    /// <summary>Mã lỗi để frontend xử lý</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ErrorCode { get; set; }
    
    /// <summary>Thời điểm response</summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Tạo response thành công với dữ liệu
    /// </summary>
    public static ApiResponse<T> SuccessResult(T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    /// <summary>
    /// Tạo response thất bại
    /// </summary>
    public static ApiResponse<T> FailResult(string message, string? errorCode = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            ErrorCode = errorCode
        };
    }

    /// <summary>
    /// Tạo response lỗi validation
    /// </summary>
    public static ApiResponse<T> ValidationFailResult(IDictionary<string, string[]> errors)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = "Một hoặc nhiều lỗi validation đã xảy ra.",
            ErrorCode = "VALIDATION_ERROR",
            Errors = errors
        };
    }
}

/// <summary>
/// Non-generic ApiResponse cho các response không cần trả data
/// </summary>
public class ApiResponse : ApiResponse<object>
{
    /// <summary>
    /// Tạo response thành công không có data
    /// </summary>
    public static ApiResponse SuccessResult(string? message = null)
    {
        return new ApiResponse
        {
            Success = true,
            Message = message
        };
    }

    /// <summary>
    /// Tạo response thất bại
    /// </summary>
    public new static ApiResponse FailResult(string message, string? errorCode = null)
    {
        return new ApiResponse
        {
            Success = false,
            Message = message,
            ErrorCode = errorCode
        };
    }

    /// <summary>
    /// Tạo response lỗi validation
    /// </summary>
    public new static ApiResponse ValidationFailResult(IDictionary<string, string[]> errors)
    {
        return new ApiResponse
        {
            Success = false,
            Message = "Một hoặc nhiều lỗi validation đã xảy ra.",
            ErrorCode = "VALIDATION_ERROR",
            Errors = errors
        };
    }
}
