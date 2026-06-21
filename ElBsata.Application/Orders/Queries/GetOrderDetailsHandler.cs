using AutoMapper;
using MediatR;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Application.Orders.DTOs;
using ElBsata.Domain.Entities;

namespace ElBsata.Application.Orders.Queries;

public class GetOrderDetailsHandler : IRequestHandler<GetOrderDetailsQuery, OrderDetailsDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetOrderDetailsHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<OrderDetailsDto> Handle(GetOrderDetailsQuery request, CancellationToken cancellationToken)
    {
        var orders = await _unitOfWork.Orders.GetAllAsync(cancellationToken);
        var order = orders.FirstOrDefault(o => o.Id == request.Id);
        return order == null ? new OrderDetailsDto() : _mapper.Map<OrderDetailsDto>(order);
    }
}
