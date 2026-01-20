namespace Nihonlet.Application.Common.Models
{
    public sealed class JwtTokenResult
    {
        public string AccessToken { get; init; } = null!;
        public DateTime ExpiresAt { get; init; }
    }
}
