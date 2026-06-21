using AutoMapper;
using ElBsata.Application.Orders.DTOs;
using ElBsata.Domain.Entities;
using ElBsata.Domain.Enums;
using ElBsata.Domain.ValueObjects;

namespace ElBsata.Application.Mappings;

public class OrderMappingProfile : Profile
{
    public OrderMappingProfile()
    {
        CreateMap<Coordinates, CoordinatesDto>().ReverseMap();
        CreateMap<CustomerInfo, CustomerInfoDto>()
            .ForMember(d => d.Coordinates, o => o.MapFrom(s => s.Coordinates))
            .ReverseMap()
            .ForMember(s => s.Coordinates, o => o.MapFrom(d => d.Coordinates));
        CreateMap<CartItem, CartItemDto>()
            .ForMember(d => d.ProductId, o => o.MapFrom(s => s.Item.Id))
            .ForMember(d => d.ProductName, o => o.MapFrom(s => s.Item.Name))
            .ForMember(d => d.Price, o => o.MapFrom(s => s.Item.Price ?? 0))
            .ReverseMap()
            .ForMember(s => s.Item, o => o.MapFrom(d => new MenuItem
            {
                Id = d.ProductId.ToString(),
                Name = d.ProductName,
                Price = d.Price
            }));
        CreateMap<Order, OrderDto>()
            .ForMember(d => d.ItemsCount, o => o.MapFrom(s => s.Items.Count))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
            .ReverseMap();
        CreateMap<Order, OrderDetailsDto>()
            .ForMember(d => d.Items, o => o.MapFrom(s => s.Items))
            .ForMember(d => d.EmailLog, o => o.MapFrom(s => s.EmailLog))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));
        CreateMap<OrderRequestDto, Order>();
    }
}
