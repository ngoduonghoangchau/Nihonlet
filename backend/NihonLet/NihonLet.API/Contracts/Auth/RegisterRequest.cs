using System.ComponentModel.DataAnnotations;

namespace NihonLet.API.Contracts.Auth
{
    public sealed class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; init; } = null!;

        [Required]
        [MinLength(8)]
        public string Password { get; init; } = null!;

        [Required]
        public string ConfirmPassword { get; init; } = null!;
    }
}
