using ElBsata.Domain.Entities;  
namespace ElBsata.Domain.Entities;  
public class CartItem  
{  
    public MenuItem Item { get; set; } = new();  
    public int Quantity { get; set; }  

    
} 
