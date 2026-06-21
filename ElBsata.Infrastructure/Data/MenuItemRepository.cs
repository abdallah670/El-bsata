using Microsoft.EntityFrameworkCore;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Domain.Entities;

namespace ElBsata.Infrastructure.Data;

public class MenuItemRepository : GenericRepository<MenuItem>, IMenuItemRepository
{
    public MenuItemRepository(AppDbContext context) : base(context)
    {
    }

    public Task<List<MenuItem>> GetItemsAsync(
        string? category,
        string? search,
        CancellationToken cancellationToken = default)
    {
        var query = _context.MenuItems.AsQueryable();

        // Filter by category
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(i =>
               
                    i.Category == category);
        }

        // Filter by menu item name
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(i =>
                i.Name.Contains(search) );
        }

        return query.ToListAsync(cancellationToken);
    }
}