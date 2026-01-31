using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Constants;

namespace NihonLet.Infrastructure.Identity;

/// <summary>
/// Service để lấy thông tin user hiện tại từ HttpContext
/// </summary>
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public string? UserId => User?.FindFirstValue(ClaimTypes.NameIdentifier) 
        ?? User?.FindFirstValue("sub");

    public string? Email => User?.FindFirstValue(ClaimTypes.Email) 
        ?? User?.FindFirstValue("email");

    public string? FullName => User?.FindFirstValue("fullName");

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

    public bool IsInRole(string role) => User?.IsInRole(role) ?? false;

    public bool IsPremium => IsInRole(Roles.Premium);
}
