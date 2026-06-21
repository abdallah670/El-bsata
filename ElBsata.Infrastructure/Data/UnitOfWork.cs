using Microsoft.EntityFrameworkCore;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Domain.Entities;

namespace ElBsata.Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IGenericRepository<MenuCategory>? _menuCategories;
    private IMenuItemRepository? _menuItems;
    private IGenericRepository<Order>? _orders;
    private IGenericRepository<AppUser>? _users;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IGenericRepository<MenuCategory> MenuCategories => _menuCategories ??= new GenericRepository<MenuCategory>(_context);
    public IMenuItemRepository MenuItems => _menuItems ??= new MenuItemRepository(_context);
    public IGenericRepository<Order> Orders => _orders ??= new GenericRepository<Order>(_context);
    public IGenericRepository<AppUser> Users => _users ??= new GenericRepository<AppUser>(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
