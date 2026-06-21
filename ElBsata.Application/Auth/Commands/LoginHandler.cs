using MediatR;
using ElBsata.Application.Common.Interfaces;
namespace ElBsata.Application.Auth.Commands;
public class LoginHandler : IRequestHandler<LoginCommand, LoginResult?>
{
    private readonly IIdentityService _identityService;
    public LoginHandler(IIdentityService identityService) => _identityService = identityService;
    public async Task<LoginResult?> Handle(LoginCommand cmd, CancellationToken ct)
    {
        var user = await _identityService.ValidateUserAsync(cmd.Username, cmd.Password);
        if (user == null) return null;
        var token = await _identityService.GenerateTokenAsync(user);
        return new LoginResult { Token = token };
    }
}