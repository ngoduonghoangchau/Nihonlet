using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Common.Models;
using NihonLet.Application.Features.Auth.DTOs;

namespace NihonLet.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IIdentityService _identityService;
    private readonly ICurrentUserService _currentUserService;

    private const string RefreshTokenCookieName = "refresh_token";
    private const int RefreshTokenExpiryDays = 7;

    public AuthController(
        IIdentityService identityService,
        ICurrentUserService currentUserService)
    {
        _identityService = identityService;
        _currentUserService = currentUserService;
    }

    /// <summary>
    /// Đăng ký tài khoản mới
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterWithDeviceRequest request)
    {
        var ipAddress = GetClientIpAddress();
        var result = await _identityService.RegisterAsync(request.Register, request.DeviceInfo, ipAddress);

        if (!result.Success)
        {
            return BadRequest(ApiResponse<AuthResponseDto>.FailResult(
                string.Join(", ", result.Errors ?? ["Đăng ký thất bại."]),
                "REGISTRATION_FAILED"));
        }

        SetRefreshTokenCookie(result.RefreshToken!);

        var response = new AuthResponseDto
        {
            AccessToken = result.AccessToken!,
            ExpiresAt = result.ExpiresAt!.Value,
            User = result.User!
        };

        return Ok(ApiResponse<AuthResponseDto>.SuccessResult(response, "Đăng ký thành công!"));
    }

    /// <summary>
    /// Đăng nhập
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginWithDeviceRequest request)
    {
        var ipAddress = GetClientIpAddress();
        var result = await _identityService.LoginAsync(request.Login, request.DeviceInfo, ipAddress);

        if (!result.Success)
        {
            return Unauthorized(ApiResponse<AuthResponseDto>.FailResult(
                string.Join(", ", result.Errors ?? ["Đăng nhập thất bại."]),
                "LOGIN_FAILED"));
        }

        SetRefreshTokenCookie(result.RefreshToken!);

        var response = new AuthResponseDto
        {
            AccessToken = result.AccessToken!,
            ExpiresAt = result.ExpiresAt!.Value,
            User = result.User!
        };

        return Ok(ApiResponse<AuthResponseDto>.SuccessResult(response, "Đăng nhập thành công!"));
    }

    /// <summary>
    /// Refresh access token - đọc refresh token từ cookie
    /// </summary>
    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken([FromBody] DeviceInfoDto deviceInfo)
    {
        // Đọc refresh token từ HttpOnly cookie
        var refreshToken = Request.Cookies[RefreshTokenCookieName];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized(ApiResponse<AuthResponseDto>.FailResult(
                "Không tìm thấy refresh token.",
                "MISSING_TOKEN"));
        }

        var ipAddress = GetClientIpAddress();
        var result = await _identityService.RefreshTokenAsync(refreshToken, deviceInfo, ipAddress);

        if (!result.Success)
        {
            DeleteRefreshTokenCookie();

            return Unauthorized(ApiResponse<AuthResponseDto>.FailResult(
                string.Join(", ", result.Errors ?? ["Token không hợp lệ hoặc đã hết hạn."]),
                "INVALID_TOKEN"));
        }

        SetRefreshTokenCookie(result.RefreshToken!);

        var response = new AuthResponseDto
        {
            AccessToken = result.AccessToken!,
            ExpiresAt = result.ExpiresAt!.Value,
            User = result.User!
        };

        return Ok(ApiResponse<AuthResponseDto>.SuccessResult(response));
    }

    /// <summary>
    /// Lấy thông tin user hiện tại
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ApplicationUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse.FailResult("Không tìm thấy thông tin user.", "UNAUTHORIZED"));
        }

        var user = await _identityService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return NotFound(ApiResponse.FailResult("User không tồn tại.", "NOT_FOUND"));
        }

        return Ok(ApiResponse<ApplicationUserDto>.SuccessResult(user));
    }

    /// <summary>
    /// Đăng nhập bằng Google OAuth
    /// </summary>
    [HttpPost("google")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        var ipAddress = GetClientIpAddress();
        var result = await _identityService.GoogleLoginAsync(request.IdToken, request.DeviceInfo, ipAddress);

        if (!result.Success)
        {
            return Unauthorized(ApiResponse<AuthResponseDto>.FailResult(
                string.Join(", ", result.Errors ?? ["Đăng nhập Google thất bại."]),
                "GOOGLE_LOGIN_FAILED"));
        }

        SetRefreshTokenCookie(result.RefreshToken!);

        var response = new AuthResponseDto
        {
            AccessToken = result.AccessToken!,
            ExpiresAt = result.ExpiresAt!.Value,
            User = result.User!
        };

        return Ok(ApiResponse<AuthResponseDto>.SuccessResult(response, "Đăng nhập Google thành công!"));
    }

    /// <summary>
    /// Đăng xuất (revoke refresh token hiện tại)
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout()
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse.FailResult("Không tìm thấy thông tin user.", "UNAUTHORIZED"));
        }

        await _identityService.RevokeTokenAsync(userId);

        DeleteRefreshTokenCookie();

        return Ok(ApiResponse.SuccessResult("Đăng xuất thành công!"));
    }

    /// <summary>
    /// Đăng xuất khỏi tất cả thiết bị
    /// </summary>
    [HttpPost("logout-all")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> LogoutAll()
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse.FailResult("Không tìm thấy thông tin user.", "UNAUTHORIZED"));
        }

        var revokedCount = await _identityService.RevokeAllTokensAsync(userId);

        DeleteRefreshTokenCookie();

        return Ok(ApiResponse<int>.SuccessResult(revokedCount, $"Đã đăng xuất khỏi {revokedCount} thiết bị."));
    }

    /// <summary>
    /// Lấy danh sách sessions đang active
    /// </summary>
    [HttpGet("sessions")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<List<SessionDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetActiveSessions([FromQuery] string? currentFingerprint = null)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse.FailResult("Không tìm thấy thông tin user.", "UNAUTHORIZED"));
        }

        var sessions = await _identityService.GetActiveSessionsAsync(userId, currentFingerprint);
        return Ok(ApiResponse<List<SessionDto>>.SuccessResult(sessions));
    }

    /// <summary>
    /// Revoke một session cụ thể
    /// </summary>
    [HttpDelete("sessions/{sessionId:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RevokeSession(Guid sessionId)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse.FailResult("Không tìm thấy thông tin user.", "UNAUTHORIZED"));
        }

        var revoked = await _identityService.RevokeTokenAsync(userId, sessionId);
        if (!revoked)
        {
            return NotFound(ApiResponse.FailResult("Session không tồn tại hoặc đã bị thu hồi.", "NOT_FOUND"));
        }

        return Ok(ApiResponse.SuccessResult("Session đã được thu hồi."));
    }

    #region Private Methods

    /// <summary>
    /// Set refresh token vào HttpOnly, Secure cookie
    /// </summary>
    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,                    // Không thể truy cập từ JavaScript
            Secure = true,                      // PHẢI là true vì backend chạy HTTPS
            SameSite = SameSiteMode.None,       // None để cho phép cross-origin
            Expires = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays),
            Path = "/"                          // Gửi cho tất cả endpoints
        };

        Response.Cookies.Append(RefreshTokenCookieName, refreshToken, cookieOptions);
    }

    /// <summary>
    /// Xóa refresh token cookie
    /// </summary>
    private void DeleteRefreshTokenCookie()
    {
        Response.Cookies.Delete(RefreshTokenCookieName, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,                      // PHẢI là true vì backend chạy HTTPS
            SameSite = SameSiteMode.None,
            Path = "/"
        });
    }

    /// <summary>
    /// Lấy IP address của client
    /// </summary>
    private string? GetClientIpAddress()
    {
        // Check for forwarded IP (behind proxy/load balancer)
        var forwardedFor = Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            // X-Forwarded-For có thể chứa nhiều IP, lấy IP đầu tiên (client thực)
            return forwardedFor.Split(',')[0].Trim();
        }

        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }

    #endregion
}
