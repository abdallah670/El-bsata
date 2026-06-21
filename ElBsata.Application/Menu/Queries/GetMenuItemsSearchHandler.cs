using MediatR;
using Microsoft.EntityFrameworkCore;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Domain.Entities;

namespace ElBsata.Application.Menu.Queries;

public class GetMenuItemsSearchHandler : IRequestHandler<GetMenuItemsSearchQuery, List<MenuItem>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetMenuItemsSearchHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<List<MenuItem>> Handle(GetMenuItemsSearchQuery request, CancellationToken ct)
    {
        var items = await _unitOfWork.MenuItems.GetAllAsync(ct);

        if (!string.IsNullOrWhiteSpace(request.Category) && request.Category != "all")
        {
            items = items.Where(i => i.Category == request.Category).ToList();
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var s = request.Search.Trim().ToLower();
            items = items.Where(i =>
                i.Name.ToLower().Contains(s) ||
                (i.Description != null && i.Description.ToLower().Contains(s))
            ).ToList();
        }

        return items;
    }
}
