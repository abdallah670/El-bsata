using ElBsata.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElBsata.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<MenuCategory> MenuCategories { get; }
    DbSet<MenuItem> MenuItems { get; }
    DbSet<Order> Orders { get; }
    DbSet<AppUser> Users { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}