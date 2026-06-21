using Microsoft.EntityFrameworkCore;
using ElBsata.Domain.Entities;

namespace ElBsata.Application.Common.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<MenuCategory> MenuCategories { get; }
    IMenuItemRepository MenuItems { get; }
    IGenericRepository<Order> Orders { get; }
    IGenericRepository<AppUser> Users { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
