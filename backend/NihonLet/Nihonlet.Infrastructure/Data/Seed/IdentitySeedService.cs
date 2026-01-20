using Microsoft.AspNetCore.Identity;

namespace Nihonlet.Infrastructure.Data.Seed
{
    public sealed class IdentitySeedService
    {
        private const string DefaultUserRole = "User";

        private readonly RoleManager<IdentityRole<Guid>> _roleManager;

        public IdentitySeedService(RoleManager<IdentityRole<Guid>> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task SeedAsync()
        {
            if (!await _roleManager.RoleExistsAsync(DefaultUserRole))
            {
                var role = new IdentityRole<Guid>(DefaultUserRole);
                await _roleManager.CreateAsync(role);
            }
        }
    }
}
