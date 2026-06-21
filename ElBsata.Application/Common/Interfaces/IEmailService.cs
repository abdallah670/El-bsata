using ElBsata.Domain.Entities;
namespace ElBsata.Application.Common.Interfaces;
public interface IEmailService
{
    Task<bool> SendOrderEmailAsync(Order order);
}