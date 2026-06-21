using MediatR;
using ElBsata.Application.Orders.DTOs;
namespace ElBsata.Application.Orders.Queries;
public record GetOrdersQuery : IRequest<List<OrderDto>>
;