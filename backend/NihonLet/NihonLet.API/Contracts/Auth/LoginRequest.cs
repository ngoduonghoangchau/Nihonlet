using System.ComponentModel.DataAnnotations;

namespace NihonLet.API.Contracts.Auth
{
    public sealed class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; init; } = null!;

        [Required]
        public string Password { get; init; } = null!;
    }
}
