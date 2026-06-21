using MediatR;
using ElBsata.Domain.Entities;
namespace ElBsata.Application.Menu.Queries;
public record GetMenuItemsSearchQuery(string? Search, string? Category) : IRequest<List<MenuItem>>;
