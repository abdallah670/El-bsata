using MediatR;
using Microsoft.EntityFrameworkCore;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Domain.Entities;
namespace ElBsata.Application.Menu.Queries;
public class SearchMenuItemsHandler : IRequestHandler<SearchMenuItemsQuery, List<MenuItem>>
{
    private readonly IApplicationDbContext _context;
    public SearchMenuItemsHandler(IApplicationDbContext context) => _context = context;
    public async Task<List<MenuItem>> Handle(SearchMenuItemsQuery request, CancellationToken ct)
    {
        var query = _context.MenuItems.AsQueryable();
        if (!string.IsNullOrWhiteSpace(request.Category) && request.Category != "all")
            query = query.Where(i => i.Category == request.Category);
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var s = request.Search.ToLower();
            query = query.Where(i => i.Name.ToLower().Contains(s) || (i.Description != null && i.Description.ToLower().Contains(s)));
        }
        return await query.ToListAsync(ct);
    }
}