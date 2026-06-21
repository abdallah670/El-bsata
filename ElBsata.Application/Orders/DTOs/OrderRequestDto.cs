namespace ElBsata.Application.Orders.DTOs;

public class OrderRequestDto
{
    public CustomerInfoDto Customer { get; set; } = new();
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalPrice { get; set; }
}

public class CustomerInfoDto
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public CoordinatesDto? Coordinates { get; set; }
}

public class CoordinatesDto
{
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public double? Accuracy { get; set; }
}

public class CartItemDto
{
    public string ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal? Price { get; set; }
    public int Quantity { get; set; }
}

public class OrderDto
{
    public string Id { get; set; } = string.Empty;
    public CustomerInfoDto Customer { get; set; } = new();
    public int ItemsCount { get; set; }
    public decimal TotalPrice { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class OrderDetailsDto
{
    public string Id { get; set; } = string.Empty;
    public CustomerInfoDto Customer { get; set; } = new();
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalPrice { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string? EmailLog { get; set; }
    public string Status { get; set; } = string.Empty;
}
