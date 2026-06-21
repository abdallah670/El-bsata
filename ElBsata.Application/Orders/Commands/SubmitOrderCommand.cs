using MediatR;
using ElBsata.Application.Orders.DTOs;
namespace ElBsata.Application.Orders.Commands;
public record SubmitOrderCommand(OrderRequestDto Request) : IRequest<SubmitOrderResult>;
public class SubmitOrderResult
{
    public bool Success { get; set; }
    public string OrderId { get; set; } = string.Empty;
    public bool EmailSent { get; set; }
    public bool IsMock { get; set; }
    public string Message { get; set; } = string.Empty;
    public Domain.Entities.Order? Order { get; set; }
}