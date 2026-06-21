using AutoMapper;
using MediatR;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Application.Orders.DTOs;
using ElBsata.Domain.Entities;

namespace ElBsata.Application.Orders.Queries;

public class GetOrdersHandler : IRequestHandler<GetOrdersQuery, List<OrderDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetOrdersHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<OrderDto>> Handle(GetOrdersQuery request, CancellationToken ct)
    {
        var orders = await _unitOfWork.Orders.GetAllAsync(ct);
        var orderDtos = orders
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => _mapper.Map<OrderDto>(o))
            .ToList();
        return orderDtos;
    }
}