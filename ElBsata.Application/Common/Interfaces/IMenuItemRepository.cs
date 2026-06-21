using ElBsata.Domain.Entities;

namespace ElBsata.Application.Common.Interfaces;

public interface IMenuItemRepository : IGenericRepository<MenuItem>
{
    public Task<List<MenuItem>> GetItemsAsync(string? category, string? search, CancellationToken cancellationToken = default);
}