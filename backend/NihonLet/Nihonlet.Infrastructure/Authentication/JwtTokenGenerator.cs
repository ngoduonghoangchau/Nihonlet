using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Nihonlet.Application.Common.Interfaces;
using Nihonlet.Application.Common.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Nihonlet.Infrastructure.Authentication
{
    public sealed class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly JwtOptions _options;

        public JwtTokenGenerator(IOptions<JwtOptions> options)
        {
            _options = options.Value;
        }

        public JwtTokenResult GenerateToken(Guid userId, string email, IEnumerable<string> roles, IDictionary<string, string>? additionalClaims = null)
        {
            var now = DateTime.UtcNow;
            var expiresAt = now.AddMinutes(_options.AccessTokenLifetimeMinutes);

            var claims = new List<Claim>
            {
                // Standard claims
                new(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Sub, userId.ToString()),
                new(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Email, email),
                new(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Iat,
                    new DateTimeOffset(now).ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64)
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Custom claims (Premium, Subscription, v.v.)
            if (additionalClaims is not null)
            {
                foreach (var (key, value) in additionalClaims)
                {
                    claims.Add(new Claim(key, value));
                }
            }

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Secret));

            var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                notBefore: now,
                expires: expiresAt,
                signingCredentials: credentials);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            return new JwtTokenResult
            {
                AccessToken = accessToken,
                ExpiresAt = expiresAt
            };
        }
    }
}
