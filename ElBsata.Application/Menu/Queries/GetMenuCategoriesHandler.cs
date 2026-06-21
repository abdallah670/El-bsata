using MediatR;
using Microsoft.EntityFrameworkCore;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Domain.Entities;
namespace ElBsata.Application.Menu.Queries;
public class GetMenuCategoriesHandler : IRequestHandler<GetMenuCategoriesQuery, List<MenuCategory>>
{
    private readonly IUnitOfWork _unitOfWork;
    public GetMenuCategoriesHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;
    public async Task<List<MenuCategory>> Handle(GetMenuCategoriesQuery request, CancellationToken ct)
        => await _unitOfWork.MenuCategories.GetAllAsync(ct);
}