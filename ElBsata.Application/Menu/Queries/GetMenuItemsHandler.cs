using MediatR;
using Microsoft.EntityFrameworkCore;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Domain.Entities;
namespace ElBsata.Application.Menu.Queries;
public class GetMenuItemsHandler : IRequestHandler<GetMenuItemsQuery, List<MenuItem>>
{
    private readonly IUnitOfWork _unitOfWork;
    public GetMenuItemsHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;
    public async Task<List<MenuItem>> Handle(GetMenuItemsQuery request, CancellationToken ct)
        => await _unitOfWork.MenuItems.GetAllAsync(ct);
}