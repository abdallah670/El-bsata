using ElBsata.Domain.Entities;
namespace ElBsata.Application.Common.Interfaces;
public interface IIdentityService
{
    Task<AppUser?> ValidateUserAsync(string username, string password);
    Task<string> GenerateTokenAsync(AppUser user);
}