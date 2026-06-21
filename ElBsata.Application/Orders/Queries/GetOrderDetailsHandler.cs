using MediatR;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Domain.Entities;
using System.Linq;
using ElBsata.Application.Orders.DTOs;

namespace ElBsata.Application.Orders.Queries;

public class GetOrderDetailsHandler : IRequestHandler<GetOrderDetailsQuery, OrderDetailsDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetOrderDetailsHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<OrderDetailsDto> Handle(GetOrderDetailsQuery request, CancellationToken cancellationToken)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(request.Id, cancellationToken);
          
        return order is not null ? new OrderDetailsDto
        {
            Id = order.Id,
            Customer = new CustomerInfoDto
            {
                Name = order.Customer.Name,
                Phone = order.Customer.Phone,
                Address = order.Customer.Address
            },
            Items = order.Items.Select(i => new CartItemDto
            {
                ProductId = i.Item.Id,
                ProductName = i.Item.Name,
                Price = i.Item.Price,
                Quantity = i.Quantity
            }).ToList(),
            TotalPrice = order.TotalPrice,
            CreatedAt = order.CreatedAt
        } : null;
    }
}
