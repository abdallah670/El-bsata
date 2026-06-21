using MediatR;
namespace ElBsata.Application.Auth.Commands;
public record LoginCommand(string Username, string Password) : IRequest<LoginResult?>;
public class LoginResult { public string? Token { get; set; } }