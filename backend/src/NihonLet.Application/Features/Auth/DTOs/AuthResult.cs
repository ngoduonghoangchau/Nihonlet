namespace NihonLet.Application.Features.Auth.DTOs;

/// <summary>
/// Kết quả xác thực (login/register/refresh)
/// </summary>
public record AuthResult
{
    /// <summary>Trạng thái thành công</summary>
    public bool Success { get; init; }
    
    /// <summary>Access token JWT</summary>
    public string? AccessToken { get; init; }
    
    /// <summary>Refresh token để lấy access token mới</summary>
    public string? RefreshToken { get; init; }
    
    /// <summary>Thời điểm access token hết hạn</summary>
    public DateTime? ExpiresAt { get; init; }
    
    /// <summary>Thông tin user</summary>
    public ApplicationUserDto? User { get; init; }
    
    /// <summary>Danh sách lỗi nếu thất bại</summary>
    public IEnumerable<string>? Errors { get; init; }

    public static AuthResult SuccessResult(string accessToken, string refreshToken, DateTime expiresAt, ApplicationUserDto user)
    {
        return new AuthResult
        {
            Success = true,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            User = user
        };
    }

    public static AuthResult FailResult(params string[] errors)
    {
        return new AuthResult
        {
            Success = false,
            Errors = errors
        };
    }
}
