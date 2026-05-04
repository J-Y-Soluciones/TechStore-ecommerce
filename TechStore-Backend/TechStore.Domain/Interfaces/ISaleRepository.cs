using TechStore.Domain.Entities;

namespace TechStore.Domain.Interfaces
{
    public interface ISaleRepository
    {
        Task<IEnumerable<Sale>> GetAllAsync();
        Task<Sale?> GetByIdAsync(int id);
        Task<Sale> AddAsync(Sale sale);
        
    }
}