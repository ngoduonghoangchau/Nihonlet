using MediatR;
using Nihonlet.Application.Common.Interfaces;
using NihonLet.API.Contracts.Auth;
using Nihonlet.Application.Common.Exceptions;
using ValidationException = Nihonlet.Application.Common.Exceptions.ValidationException;

namespace Nihonlet.Application.Auth.Commands.Register
{
    public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResult>
    {
        private readonly IIdentityService _identityService;

        public RegisterCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<RegisterResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            if (request.Password != request.ConfirmPassword)
                throw new ValidationException("Password do not match");

            var existingUserId = await _identityService.GetUserIdByEmailAsync(request.Email);

            if (existingUserId is not null)
                throw new ConflictException("Email is already registered");

            var (success, errors) = await _identityService.CreateUserAsync(request.Email, request.Password);

            if (!success)
                throw new ValidationException(errors);

            var userId = await _identityService.GetUserIdByEmailAsync(request.Email);

            await _identityService.AssignDefaultRoleAsync(userId!.Value);

            return new RegisterResult(userId.Value, request.Email);
        }
    }
}
