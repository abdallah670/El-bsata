

using MediatR;
using ElBsata.Application.Orders.DTOs;

namespace ElBsata.Application.Orders.Queries;

public class GetOrderDetailsQuery : IRequest<OrderDetailsDto>
{
    public string Id { get; set; } = string.Empty;
}
