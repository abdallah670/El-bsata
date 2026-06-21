using MediatR;
using ElBsata.Application.Auth.Commands;
using Microsoft.AspNetCore.Mvc;
namespace ElBsata.API.Controllers;
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    public AuthController(IMediator mediator) => _mediator = mediator;
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);
        if (result == null || string.IsNullOrEmpty(result.Token))
            return Unauthorized(new { message = "اسم المستخدم أو كلمة المرور غير صحيحة" });
        return Ok(new { token = result.Token });
    }
}
