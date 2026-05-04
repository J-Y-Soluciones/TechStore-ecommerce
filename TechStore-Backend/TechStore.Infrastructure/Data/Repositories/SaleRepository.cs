using Microsoft.EntityFrameworkCore;
using TechStore.Domain.Entities;
using TechStore.Domain.Interfaces;
using TechStore.Infrastructure.Data;

namespace TechStore.Infrastructure.Repositories
{
    public class SaleRepository : ISaleRepository
    {
        private readonly ApplicationDbContext _context;

        public SaleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Sale>> GetAllAsync()
        {
            return await _context.Sales
                .Include(s => s.Cliente) // Trae datos del cliente
                .Include(s => s.Detalles) // Trae los detalles
                .ThenInclude(d => d.Producto) // Y para cada detalle, trae el nombre del producto
                .OrderByDescending(s => s.Fecha)
                .ToListAsync();
        }

        public async Task<Sale?> GetByIdAsync(int id)
        {
            return await _context.Sales
                .Include(s => s.Cliente)
                .Include(s => s.Detalles)
                .ThenInclude(d => d.Producto)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Sale> AddAsync(Sale sale)
        {

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();
            return sale;
        }
    }
}