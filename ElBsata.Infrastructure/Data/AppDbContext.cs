using System.Text.Json;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ElBsata.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<AppUser>, IApplicationDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<MenuCategory> MenuCategories => Set<MenuCategory>();
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();
    public DbSet<Order> Orders => Set<Order>();
    DbSet<AppUser> IApplicationDbContext.Users => base.Users;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<MenuCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Label).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Icon).HasMaxLength(10);
            entity.Property(e => e.Desc).HasMaxLength(500);
        });

        builder.Entity<MenuItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Image).HasMaxLength(500);
        });

        builder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasMaxLength(100);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.EmailLog).HasColumnType("nvarchar(max)");
            entity.OwnsOne(e => e.Customer, customer =>
            {
                customer.Property(c => c.Name).HasMaxLength(200).HasColumnName("CustomerName");
                customer.Property(c => c.Phone).HasMaxLength(50).HasColumnName("CustomerPhone");
                customer.Property(c => c.Address).HasMaxLength(500).HasColumnName("CustomerAddress");
                customer.Property(c => c.Notes).HasMaxLength(1000).HasColumnName("CustomerNotes");
                customer.OwnsOne(c => c.Coordinates, coords =>
                {
                    coords.Property(x => x.Latitude).HasColumnName("Latitude");
                    coords.Property(x => x.Longitude).HasColumnName("Longitude");
                    coords.Property(x => x.Accuracy).HasColumnName("Accuracy");
                });
            });
            var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            entity.Property(e => e.Items).HasColumnType("nvarchar(max)").HasConversion(
                v => JsonSerializer.Serialize(v, jsonOptions),
                v => JsonSerializer.Deserialize<List<CartItem>>(v, jsonOptions) ?? new List<CartItem>())
                .Metadata.SetValueComparer(new ValueComparer<List<CartItem>>(
                    (c1, c2) => JsonSerializer.Serialize(c1, jsonOptions) == JsonSerializer.Serialize(c2, jsonOptions),
                    c => c == null ? 0 : JsonSerializer.Serialize(c, jsonOptions).GetHashCode(),
                    c => JsonSerializer.Deserialize<List<CartItem>>(JsonSerializer.Serialize(c, jsonOptions), jsonOptions)!));
        });
    }
}
