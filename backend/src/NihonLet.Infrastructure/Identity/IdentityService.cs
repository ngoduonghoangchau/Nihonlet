using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Auth.DTOs;
using NihonLet.Domain.Constants;
using NihonLet.Domain.Entities.Identity;
using NihonLet.Infrastructure.Persistence;

namespace NihonLet.Infrastructure.Identity;

/// <summary>
/// Implementation của IIdentityService sử dụng ASP.NET Identity và JWT
/// Với secure refresh token: hash storage, token rotation, reuse detection
/// </summary>
public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ApplicationDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly ISystemLogger _systemLogger;

    // Token settings
    private const int AccessTokenExpiryMinutes = 15;
    private const int RefreshTokenExpiryDays = 7;
    private const int GracePeriodSeconds = 30; // Grace period cho race condition

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ApplicationDbContext dbContext,
        IConfiguration configuration,
        ISystemLogger systemLogger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
        _configuration = configuration;
        _systemLogger = systemLogger;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request, DeviceInfoDto deviceInfo, string? ipAddress)
    {
        // Validate device info
        var validatedDevice = DeviceInfoDto.ValidateAndSanitize(deviceInfo);
        if (validatedDevice == null)
        {
            return AuthResult.FailResult("Device fingerprint không hợp lệ.");
        }

        // Kiểm tra email đã tồn tại
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return AuthResult.FailResult("Email đã được sử dụng.");
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToArray();
            return AuthResult.FailResult(errors);
        }

        // Gán role User mặc định
        await _userManager.AddToRoleAsync(user, Roles.User);

        // Generate tokens
        var roles = await _userManager.GetRolesAsync(user);
        var (accessToken, expiresAt) = GenerateAccessToken(user, roles);
        var (rawRefreshToken, refreshTokenEntity) = CreateRefreshToken(user.Id, validatedDevice, ipAddress);

        // Lưu refresh token vào DB
        _dbContext.RefreshTokens.Add(refreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        // Audit: đăng ký thành công
        _ = _systemLogger.LogAuditAsync(user.Id, "Register", "User", user.Id, newValue: $"Email={request.Email}");

        return AuthResult.SuccessResult(
            accessToken,
            rawRefreshToken,
            expiresAt,
            MapToDto(user, roles));
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request, DeviceInfoDto deviceInfo, string? ipAddress)
    {
        // Validate device info
        var validatedDevice = DeviceInfoDto.ValidateAndSanitize(deviceInfo);
        if (validatedDevice == null)
        {
            return AuthResult.FailResult("Device fingerprint không hợp lệ.");
        }

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return AuthResult.FailResult("Email hoặc mật khẩu không đúng.");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            if (result.IsLockedOut)
            {
                _ = _systemLogger.LogWarningAsync($"Account locked: {request.Email}", "IdentityService.Login", user.Id);
                return AuthResult.FailResult("Tài khoản đã bị khóa. Vui lòng thử lại sau.");
            }
            _ = _systemLogger.LogAuditAsync(user.Id, "LoginFailed", "User", user.Id, newValue: $"IP={ipAddress}");
            return AuthResult.FailResult("Email hoặc mật khẩu không đúng.");
        }

        // Revoke existing tokens cho cùng device (single session per device)
        await RevokeTokensByFingerprintAsync(user.Id, validatedDevice.Fingerprint, "NewLogin");

        // Generate tokens
        var roles = await _userManager.GetRolesAsync(user);
        var (accessToken, expiresAt) = GenerateAccessToken(user, roles);
        var (rawRefreshToken, refreshTokenEntity) = CreateRefreshToken(user.Id, validatedDevice, ipAddress);

        // Lưu refresh token vào DB
        _dbContext.RefreshTokens.Add(refreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        // Audit: đăng nhập thành công
        _ = _systemLogger.LogAuditAsync(user.Id, "Login", "User", user.Id, newValue: $"IP={ipAddress}, Device={validatedDevice.DeviceName}");

        return AuthResult.SuccessResult(
            accessToken,
            rawRefreshToken,
            expiresAt,
            MapToDto(user, roles));
    }

    public async Task<AuthResult> GoogleLoginAsync(string idToken, DeviceInfoDto deviceInfo, string? ipAddress)
    {
        // Validate device info
        var validatedDevice = DeviceInfoDto.ValidateAndSanitize(deviceInfo);
        if (validatedDevice == null)
        {
            return AuthResult.FailResult("Device fingerprint không hợp lệ.");
        }

        // Verify Google ID token
        GoogleJsonWebSignature.Payload payload;
        try
        {
            var googleClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")
                                 ?? _configuration["Authentication:Google:ClientId"];
            if (string.IsNullOrEmpty(googleClientId))
            {
                return AuthResult.FailResult("Google OAuth chưa được cấu hình.");
            }

            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { googleClientId }
            };

            payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
        }
        catch (InvalidJwtException)
        {
            return AuthResult.FailResult("Google token không hợp lệ hoặc đã hết hạn.");
        }

        // Find or create user
        var user = await _userManager.FindByEmailAsync(payload.Email);
        
        if (user == null)
        {
            // Tạo user mới từ Google account
            user = new ApplicationUser
            {
                UserName = payload.Email,
                Email = payload.Email,
                EmailConfirmed = payload.EmailVerified,
                FullName = payload.Name ?? payload.Email.Split('@')[0],
                AvatarUrl = payload.Picture,
                CreatedAt = DateTime.UtcNow
            };

            // Tạo user không cần password (Google login)
            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded)
            {
                var errors = createResult.Errors.Select(e => e.Description).ToArray();
                return AuthResult.FailResult(errors);
            }

            // Gán role User mặc định
            await _userManager.AddToRoleAsync(user, Roles.User);
        }
        else
        {
            // Update user info from Google if needed
            var needsUpdate = false;
            
            if (string.IsNullOrEmpty(user.AvatarUrl) && !string.IsNullOrEmpty(payload.Picture))
            {
                user.AvatarUrl = payload.Picture;
                needsUpdate = true;
            }
            
            if (!user.EmailConfirmed && payload.EmailVerified)
            {
                user.EmailConfirmed = true;
                needsUpdate = true;
            }
            
            if (needsUpdate)
            {
                await _userManager.UpdateAsync(user);
            }
        }

        // Revoke existing tokens cho cùng device
        await RevokeTokensByFingerprintAsync(user.Id, validatedDevice.Fingerprint, "GoogleLogin");

        // Generate tokens
        var roles = await _userManager.GetRolesAsync(user);
        var (accessToken, expiresAt) = GenerateAccessToken(user, roles);
        var (rawRefreshToken, refreshTokenEntity) = CreateRefreshToken(user.Id, validatedDevice, ipAddress);

        // Lưu refresh token vào DB
        _dbContext.RefreshTokens.Add(refreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        // Audit: Google login thành công
        _ = _systemLogger.LogAuditAsync(user.Id, "GoogleLogin", "User", user.Id, newValue: $"Email={payload.Email}, IP={ipAddress}");

        return AuthResult.SuccessResult(
            accessToken,
            rawRefreshToken,
            expiresAt,
            MapToDto(user, roles));
    }

    public async Task<AuthResult> RefreshTokenAsync(string refreshToken, DeviceInfoDto deviceInfo, string? ipAddress)
    {
        // Validate device info
        var validatedDevice = DeviceInfoDto.ValidateAndSanitize(deviceInfo);
        if (validatedDevice == null)
        {
            return AuthResult.FailResult("Device fingerprint không hợp lệ.");
        }

        // Hash incoming token để tìm trong DB
        var tokenHash = HashToken(refreshToken);

        var storedToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);

        if (storedToken == null)
        {
            return AuthResult.FailResult("Refresh token không hợp lệ.");
        }

        // Check token đã hết hạn chưa
        if (storedToken.IsExpired)
        {
            return AuthResult.FailResult("Refresh token đã hết hạn.");
        }

        // Check nếu token đã bị revoke
        if (storedToken.IsRevoked)
        {
            // Check grace period cho race condition
            var timeSinceRevoke = DateTime.UtcNow - storedToken.RevokedAt!.Value;
            if (timeSinceRevoke.TotalSeconds <= GracePeriodSeconds)
            {
                // Within grace period - có thể do race condition, cho phép sử dụng token mới nhất trong family
                var latestToken = await _dbContext.RefreshTokens
                    .Where(rt => rt.TokenFamily == storedToken.TokenFamily && rt.RevokedAt == null)
                    .OrderByDescending(rt => rt.CreatedAt)
                    .FirstOrDefaultAsync();

                if (latestToken != null)
                {
                    // Trả về thông báo dùng token mới
                    return AuthResult.FailResult("Token đã được rotate. Vui lòng sử dụng token mới nhất.");
                }
            }

            // REUSE ATTACK DETECTED! Revoke toàn bộ token family
            await RevokeTokenFamilyAsync(storedToken.TokenFamily, "ReuseDetected");
            _ = _systemLogger.LogWarningAsync(
                $"Token reuse attack detected for user {storedToken.UserId}, family {storedToken.TokenFamily}",
                "IdentityService.RefreshToken",
                storedToken.UserId);
            _ = _systemLogger.LogAuditAsync(storedToken.UserId, "TokenReuseDetected", "RefreshToken", storedToken.TokenFamily, newValue: $"IP={ipAddress}");
            return AuthResult.FailResult("Phát hiện sử dụng lại token. Tất cả sessions đã bị thu hồi. Vui lòng đăng nhập lại.");
        }

        // Verify fingerprint matches
        if (storedToken.DeviceFingerprint != validatedDevice.Fingerprint)
        {
            // Token bị sử dụng từ device khác - potential theft
            await RevokeTokenFamilyAsync(storedToken.TokenFamily, "FingerprintMismatch");
            _ = _systemLogger.LogWarningAsync(
                $"Fingerprint mismatch for user {storedToken.UserId}: expected={storedToken.DeviceFingerprint[..8]}..., got={validatedDevice.Fingerprint[..Math.Min(8, validatedDevice.Fingerprint.Length)]}...",
                "IdentityService.RefreshToken",
                storedToken.UserId);
            _ = _systemLogger.LogAuditAsync(storedToken.UserId, "FingerprintMismatch", "RefreshToken", storedToken.TokenFamily, newValue: $"IP={ipAddress}");
            return AuthResult.FailResult("Token không hợp lệ cho thiết bị này. Session đã bị thu hồi.");
        }

        // Get user
        var user = await _userManager.FindByIdAsync(storedToken.UserId);
        if (user == null)
        {
            return AuthResult.FailResult("User không tồn tại.");
        }

        // Revoke old token (mark as rotated)
        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.RevokedReason = "Rotated";

        // Generate new tokens
        var roles = await _userManager.GetRolesAsync(user);
        var (accessToken, expiresAt) = GenerateAccessToken(user, roles);
        var (rawRefreshToken, newRefreshTokenEntity) = CreateRefreshToken(
            user.Id,
            validatedDevice,
            ipAddress,
            storedToken.TokenFamily); // Giữ cùng token family

        // Link old token to new token
        storedToken.ReplacedByTokenId = newRefreshTokenEntity.Id;

        // Update last used time on old token
        storedToken.LastUsedAt = DateTime.UtcNow;

        // Save changes
        _dbContext.RefreshTokens.Add(newRefreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        return AuthResult.SuccessResult(
            accessToken,
            rawRefreshToken,
            expiresAt,
            MapToDto(user, roles));
    }

    public async Task<bool> RevokeTokenAsync(string userId, Guid? tokenId = null)
    {
        if (tokenId.HasValue)
        {
            // Revoke specific token
            var token = await _dbContext.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Id == tokenId && rt.UserId == userId && rt.RevokedAt == null);

            if (token == null) return false;

            token.RevokedAt = DateTime.UtcNow;
            token.RevokedReason = "Logout";
            await _dbContext.SaveChangesAsync();
            _ = _systemLogger.LogAuditAsync(userId, "Logout", "RefreshToken", tokenId.Value.ToString());
            return true;
        }
        else
        {
            // Revoke all active tokens of user (logout from all devices on this session)
            var activeTokens = await _dbContext.RefreshTokens
                .Where(rt => rt.UserId == userId && rt.RevokedAt == null)
                .ToListAsync();

            if (!activeTokens.Any()) return false;

            foreach (var token in activeTokens)
            {
                token.RevokedAt = DateTime.UtcNow;
                token.RevokedReason = "Logout";
            }

            await _dbContext.SaveChangesAsync();
            _ = _systemLogger.LogAuditAsync(userId, "Logout", "RefreshToken", newValue: $"Revoked {activeTokens.Count} tokens");
            return true;
        }
    }

    public async Task<int> RevokeAllTokensAsync(string userId)
    {
        var activeTokens = await _dbContext.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAt == null)
            .ToListAsync();

        foreach (var token in activeTokens)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedReason = "LogoutAll";
        }

        await _dbContext.SaveChangesAsync();
        _ = _systemLogger.LogAuditAsync(userId, "LogoutAll", "RefreshToken", newValue: $"Revoked {activeTokens.Count} tokens from all devices");
        return activeTokens.Count;
    }

    public async Task<List<SessionDto>> GetActiveSessionsAsync(string userId, string? currentFingerprint = null)
    {
        var activeSessions = await _dbContext.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAt == null && rt.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(rt => rt.LastUsedAt)
            .Select(rt => new SessionDto
            {
                Id = rt.Id,
                DeviceName = rt.DeviceName,
                DeviceFingerprint = SessionDto.MaskFingerprint(rt.DeviceFingerprint),
                IpAddress = rt.CreatedByIp,
                CreatedAt = rt.CreatedAt,
                LastUsedAt = rt.LastUsedAt,
                IsCurrent = currentFingerprint != null && rt.DeviceFingerprint == currentFingerprint
            })
            .ToListAsync();

        return activeSessions;
    }

    public async Task<ApplicationUserDto?> GetUserByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return null;

        var roles = await _userManager.GetRolesAsync(user);
        return MapToDto(user, roles);
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        return await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> AddToRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        var result = await _userManager.AddToRoleAsync(user, role);
        return result.Succeeded;
    }

    #region Private Methods

    /// <summary>
    /// Hash token bằng SHA-256 và trả về hex string
    /// </summary>
    private static string HashToken(string token)
    {
        var bytes = Encoding.UTF8.GetBytes(token);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash);
    }

    /// <summary>
    /// Tạo refresh token mới với raw token và entity để lưu DB
    /// </summary>
    private (string RawToken, RefreshToken Entity) CreateRefreshToken(
        string userId,
        DeviceInfoDto deviceInfo,
        string? ipAddress,
        Guid? tokenFamily = null)
    {
        // Generate random token
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        var rawToken = Convert.ToBase64String(randomBytes);

        var entity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = HashToken(rawToken),
            TokenFamily = tokenFamily ?? Guid.NewGuid(), // New family nếu là login mới
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays),
            DeviceFingerprint = deviceInfo.Fingerprint,
            DeviceName = deviceInfo.DeviceName,
            LastUsedAt = DateTime.UtcNow,
            CreatedByIp = ipAddress
        };

        return (rawToken, entity);
    }

    /// <summary>
    /// Revoke tất cả tokens của user trên một device cụ thể
    /// </summary>
    private async Task RevokeTokensByFingerprintAsync(string userId, string fingerprint, string reason)
    {
        var tokens = await _dbContext.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.DeviceFingerprint == fingerprint && rt.RevokedAt == null)
            .ToListAsync();

        foreach (var token in tokens)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedReason = reason;
        }
    }

    /// <summary>
    /// Revoke toàn bộ token family (khi phát hiện reuse attack)
    /// </summary>
    private async Task RevokeTokenFamilyAsync(Guid tokenFamily, string reason)
    {
        var tokens = await _dbContext.RefreshTokens
            .Where(rt => rt.TokenFamily == tokenFamily && rt.RevokedAt == null)
            .ToListAsync();

        foreach (var token in tokens)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedReason = reason;
        }

        await _dbContext.SaveChangesAsync();
    }

    private (string Token, DateTime ExpiresAt) GenerateAccessToken(ApplicationUser user, IList<string> roles)
    {
        var jwtSecret = DependencyInjection.GetJwtSecret(_configuration);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("fullName", user.FullName),
            new("level", user.Level.ToString()),
            new("isPremium", roles.Contains(Roles.Premium).ToString().ToLower())
        };

        // Thêm roles vào claims
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var expiresAt = DateTime.UtcNow.AddMinutes(AccessTokenExpiryMinutes);

        var token = new JwtSecurityToken(
            issuer: "NihonLet",
            audience: "NihonLetApp",
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }

    private static ApplicationUserDto MapToDto(ApplicationUser user, IList<string> roles)
    {
        return new ApplicationUserDto
        {
            Id = user.Id,
            Email = user.Email!,
            FullName = user.FullName,
            Level = user.Level,
            CurrentXp = user.CurrentXp,
            AvatarUrl = user.AvatarUrl,
            Roles = roles,
            IsPremium = roles.Contains(Roles.Premium)
        };
    }

    #endregion
}
