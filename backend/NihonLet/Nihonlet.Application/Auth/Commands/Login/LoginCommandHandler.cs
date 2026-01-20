using MediatR;
using Nihonlet.Application.Common.Exceptions;
using Nihonlet.Application.Common.Interfaces;

namespace Nihonlet.Application.Auth.Commands.Login
{
    public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResult>
    {
        private readonly IIdentityService _identityService;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public LoginCommandHandler(IIdentityService identityService, IJwtTokenGenerator jwtTokenGenerator)
        {
            _identityService = identityService;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _identityService.ValidateUserAsync(request.Email, request.Password);

            if (user is null)
                throw new UnauthorizedException("Invalid email or password.");

            var roles = await _identityService.GetUserRolesAsync(user.UserId);

            var token = _jwtTokenGenerator.GenerateToken(user.UserId, user.Email, roles, user.AdditionalClaims);

            return new LoginResult(token.AccessToken, token.ExpiresAt);
        }
    }
}
