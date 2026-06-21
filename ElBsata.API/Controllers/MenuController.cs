using MediatR;
using ElBsata.Application.Menu.Queries;
using Microsoft.AspNetCore.Mvc;
namespace ElBsata.API.Controllers;
[ApiController]
[Route("api/menu")]
public class MenuController : ControllerBase
{
    private readonly IMediator _mediator;
    public MenuController(IMediator mediator) => _mediator = mediator;
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() => Ok(await _mediator.Send(new GetMenuCategoriesQuery()));
    [HttpGet("items")]
    public async Task<IActionResult> GetItems() => Ok(await _mediator.Send(new GetMenuItemsQuery()));
    [HttpGet("items/search")]
    public async Task<IActionResult> SearchItems([FromQuery] string? search, [FromQuery] string? category)
        => Ok(await _mediator.Send(new SearchMenuItemsQuery(search, category)));
}
