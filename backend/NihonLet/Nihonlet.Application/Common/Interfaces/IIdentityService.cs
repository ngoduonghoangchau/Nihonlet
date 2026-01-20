using Nihonlet.Application.Common.Models;

namespace Nihonlet.Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<(bool Success, IEnumerable<string> Errors)> CreateUserAsync(string email, string password);
        Task<Guid?> GetUserIdByEmailAsync(string email);
        Task AssignDefaultRoleAsync(Guid userId);
        Task<AuthenticatedUser?> ValidateUserAsync(string email, string password);
        Task<IReadOnlyList<string>> GetUserRolesAsync(Guid userId);
    }
}
