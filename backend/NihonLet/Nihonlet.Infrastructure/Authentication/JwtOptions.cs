namespace Nihonlet.Infrastructure.Authentication
{
    public sealed class JwtOptions
    {
        public string Issuer { get; init; } = null!;
        public string Audience { get; init; } = null!;
        public string Secret { get; init; } = null!;
        public int AccessTokenLifetimeMinutes { get; init; } = 60;
    }
}
