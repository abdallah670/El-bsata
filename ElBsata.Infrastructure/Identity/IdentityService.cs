using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ElBsata.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IConfiguration _config;
    public IdentityService(UserManager<AppUser> userManager, IConfiguration config) { _userManager = userManager; _config = config; }
    public async Task<AppUser?> ValidateUserAsync(string username, string password)
    {
        var user = await _userManager.FindByNameAsync(username);
        return user == null ? null : await _userManager.CheckPasswordAsync(user, password) ? user : null;
    }
    public async Task<string> GenerateTokenAsync(AppUser user)
    {
        var jwtSettings = _config.GetSection("Jwt");
        var keyBytes = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? "ThisIsAVerySecretKeyThatIsAtLeast32BytesLong");
        var roles = await _userManager.GetRolesAsync(user);
        var claims = new List<Claim> { new Claim(JwtRegisteredClaimNames.Sub, user.UserName ?? ""), new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), new Claim(ClaimTypes.NameIdentifier, user.Id) };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));
        var token = new JwtSecurityToken(jwtSettings["Issuer"], jwtSettings["Audience"], claims, expires: DateTime.UtcNow.AddHours(24), signingCredentials: new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256));
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
