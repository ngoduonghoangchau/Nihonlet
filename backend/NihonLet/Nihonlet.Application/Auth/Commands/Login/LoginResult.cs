namespace Nihonlet.Application.Auth.Commands.Login
{
    public sealed record LoginResult(string AccessToken, DateTime ExpiresAt);
}
