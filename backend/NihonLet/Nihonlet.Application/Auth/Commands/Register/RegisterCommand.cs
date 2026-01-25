using MediatR;
using NihonLet.API.Contracts.Auth;

namespace Nihonlet.Application.Auth.Commands.Register
{
    public sealed record RegisterCommand(
        string Email,
        string Password,
        string ConfirmPassword
    ) : IRequest<RegisterResult>;
}