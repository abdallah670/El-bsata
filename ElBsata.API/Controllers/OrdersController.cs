using MediatR;
using ElBsata.Application.Orders.Commands;
using ElBsata.Application.Orders.DTOs;
using ElBsata.Application.Orders.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ElBsata.API.Controllers;
[ApiController]
[Route("api")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;
    public OrdersController(IMediator mediator) => _mediator = mediator;
    [Authorize]
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _mediator.Send(new GetOrdersQuery());
        return Ok(orders);
        
    }
 
    [Authorize]
    [HttpGet("orders/{id}")]
    public async Task<IActionResult> GetOrderDetails(string id) => Ok(await _mediator.Send(new GetOrderDetailsQuery { Id = id }));
    [HttpPost("order")]
    public async Task<IActionResult> SubmitOrder([FromBody] OrderRequestDto request)
    {
        var result = await _mediator.Send(new SubmitOrderCommand(request));
        if (!result.Success) return BadRequest(new { error = result.Message });
        return Ok(new { success = true, orderId = result.OrderId, emailSent = result.EmailSent, isMock = result.IsMock, message = result.Message, order = result.Order });
    }
}
