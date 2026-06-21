using ElBsata.Domain.ValueObjects;  
namespace ElBsata.Domain.ValueObjects;  
public class CustomerInfo  
{  
    public string Name { get; set; } = string.Empty;  
    public string Phone { get; set; } = string.Empty;  
    public string Address { get; set; } = string.Empty;  
    public Coordinates Coordinates { get; set; } = new();  
    public string? Notes { get; set; }  
} 
