using MediatR;
using ElBsata.Domain.Entities;
namespace ElBsata.Application.Menu.Queries;
public record GetMenuCategoriesQuery : IRequest<List<MenuCategory>>;