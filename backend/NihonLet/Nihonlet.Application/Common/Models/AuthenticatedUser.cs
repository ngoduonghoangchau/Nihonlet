namespace Nihonlet.Application.Common.Models
{
    public sealed record AuthenticatedUser(Guid UserId, string Email, IDictionary<string, string>? AdditionalClaims = null);
}
