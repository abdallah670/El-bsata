using ElBsata.Domain.Enums;  
using ElBsata.Domain.ValueObjects;  
namespace ElBsata.Domain.Entities;  
public class Order  
{  
    public string Id { get; set; } = string.Empty;  
    public CustomerInfo Customer { get; set; } = new();  
    public List<CartItem> Items { get; set; } = new();  
    public decimal TotalPrice { get; set; }  
    public string CreatedAt { get; set; } = string.Empty;  
    public OrderStatus Status { get; set; } = OrderStatus.Pending;  
    public string? EmailLog { get; set; }  
} 
