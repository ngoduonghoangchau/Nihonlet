using System.ComponentModel.DataAnnotations;

namespace NihonLet.Application.Features.Auth.DTOs;

/// <summary>
/// Request refresh token
/// </summary>
public record RefreshTokenRequest
{
    /// <summary>Refresh token hiện tại</summary>
    [Required(ErrorMessage = "Refresh token là bắt buộc")]
    public string RefreshToken { get; init; } = null!;
}
