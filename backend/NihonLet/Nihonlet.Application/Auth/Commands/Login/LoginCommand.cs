using MediatR;

namespace Nihonlet.Application.Auth.Commands.Login;

public sealed record LoginCommand(string Email,string Password) : IRequest<LoginResult>;