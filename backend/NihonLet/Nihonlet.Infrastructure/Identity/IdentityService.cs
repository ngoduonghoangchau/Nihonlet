using Microsoft.AspNetCore.Identity;
using Nihonlet.Application.Common.Interfaces;
using Nihonlet.Application.Common.Models;

namespace Nihonlet.Infrastructure.Identity
{
    public sealed class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public IdentityService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<(bool Success, IEnumerable<string> Errors)> CreateUserAsync(string email, string password)
        {
            var user = new ApplicationUser
            {
                UserName = email,
                Email = email
            };

            var result = await _userManager.CreateAsync(user, password);

            return (result.Succeeded, result.Errors.Select(e => e.Description));
        }

        public async Task<Guid?> GetUserIdByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return user?.Id;
        }

        public async Task AssignDefaultRoleAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user is not null)
            {
                await _userManager.AddToRoleAsync(user, "User");
            }
        }

        public async Task<AuthenticatedUser?> ValidateUserAsync(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user is null) return null;

            var isValid = await _userManager.CheckPasswordAsync(user, password);
            return !isValid ? null : new AuthenticatedUser(user.Id, user.Email!);
        }

        public async Task<IReadOnlyList<string>> GetUserRolesAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user is null) return [];

            var roles = await _userManager.GetRolesAsync(user);
            return (IReadOnlyList<string>) roles;
        }
    }
}
