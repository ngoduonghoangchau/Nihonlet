using Nihonlet.Application.Common.Models;

namespace Nihonlet.Application.Common.Interfaces
{
    public interface IJwtTokenGenerator
    {
        JwtTokenResult GenerateToken(Guid userId, string email, IEnumerable<string> roles, IDictionary<string, string>? additionalClaims = null);
    }
}
