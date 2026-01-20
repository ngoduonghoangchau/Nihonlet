using MediatR;
using Microsoft.AspNetCore.Mvc;
using Nihonlet.Application.Auth.Commands.Login;
using Nihonlet.Application.Auth.Commands.Register;
using NihonLet.API.Common.Responses;
using NihonLet.API.Contracts.Auth;

namespace NihonLet.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var command = new RegisterCommand(
                request.Email,
                request.Password,
                request.ConfirmPassword
            );

            var result = await _mediator.Send(command);

            return Ok(ApiResponse<RegisterResult>.Ok(result, "User registered successfully"));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var command = new LoginCommand(request.Email, request.Password);

            var result = await _mediator.Send(command);

            return Ok(ApiResponse<LoginResult>.Ok(result, "Login successful"));
        }

    }
}
