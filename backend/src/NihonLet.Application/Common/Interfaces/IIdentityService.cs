using NihonLet.Application.Features.Auth.DTOs;

namespace NihonLet.Application.Common.Interfaces;

/// <summary>
/// Interface cho các operations liên quan đến Identity (đăng ký, đăng nhập, xác thực)
/// </summary>
public interface IIdentityService
{
    /// <summary>
    /// Đăng ký tài khoản mới
    /// </summary>
    /// <param name="request">Thông tin đăng ký</param>
    /// <param name="deviceInfo">Thông tin thiết bị</param>
    /// <param name="ipAddress">IP address của client</param>
    Task<AuthResult> RegisterAsync(RegisterRequest request, DeviceInfoDto deviceInfo, string? ipAddress);

    /// <summary>
    /// Đăng nhập
    /// </summary>
    /// <param name="request">Thông tin đăng nhập</param>
    /// <param name="deviceInfo">Thông tin thiết bị</param>
    /// <param name="ipAddress">IP address của client</param>
    Task<AuthResult> LoginAsync(LoginRequest request, DeviceInfoDto deviceInfo, string? ipAddress);

    /// <summary>
    /// Đăng nhập hoặc đăng ký bằng Google OAuth
    /// </summary>
    /// <param name="idToken">Google ID Token từ frontend</param>
    /// <param name="deviceInfo">Thông tin thiết bị</param>
    /// <param name="ipAddress">IP address của client</param>
    Task<AuthResult> GoogleLoginAsync(string idToken, DeviceInfoDto deviceInfo, string? ipAddress);

    /// <summary>
    /// Refresh access token bằng refresh token
    /// </summary>
    /// <param name="refreshToken">Refresh token hiện tại</param>
    /// <param name="deviceInfo">Thông tin thiết bị</param>
    /// <param name="ipAddress">IP address của client</param>
    Task<AuthResult> RefreshTokenAsync(string refreshToken, DeviceInfoDto deviceInfo, string? ipAddress);

    /// <summary>
    /// Revoke một session cụ thể
    /// </summary>
    /// <param name="userId">ID của user</param>
    /// <param name="tokenId">ID của token cần revoke (null = session hiện tại dựa vào fingerprint)</param>
    Task<bool> RevokeTokenAsync(string userId, Guid? tokenId = null);

    /// <summary>
    /// Revoke tất cả sessions của user (logout all devices)
    /// </summary>
    /// <param name="userId">ID của user</param>
    Task<int> RevokeAllTokensAsync(string userId);

    /// <summary>
    /// Lấy danh sách sessions đang active của user
    /// </summary>
    /// <param name="userId">ID của user</param>
    /// <param name="currentFingerprint">Fingerprint của session hiện tại để đánh dấu</param>
    Task<List<SessionDto>> GetActiveSessionsAsync(string userId, string? currentFingerprint = null);

    /// <summary>
    /// Lấy thông tin user theo ID
    /// </summary>
    Task<ApplicationUserDto?> GetUserByIdAsync(string userId);

    /// <summary>
    /// Kiểm tra user có role cụ thể
    /// </summary>
    Task<bool> IsInRoleAsync(string userId, string role);

    /// <summary>
    /// Thêm role cho user
    /// </summary>
    Task<bool> AddToRoleAsync(string userId, string role);

    /// <summary>
    /// Xoá role khỏi user
    /// </summary>
    Task<bool> RemoveFromRoleAsync(string userId, string role);
}
