using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechStore.Infrastructure.Data;

namespace TechStoreApi.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Productos más vendidos

        [AllowAnonymous]
        [HttpGet("top-selling")]
        public async Task<IActionResult> TopSellingProducts()
        {
            var report = await _context.SaleDetails
                .Include(sd => sd.Producto)
                .GroupBy(sd => sd.Producto!.Nombre)
                .Select(g => new
                {
                    Producto = g.Key,
                    TotalVendido = g.Sum(x => x.Cantidad)
                })
                .OrderByDescending(x => x.TotalVendido)
                .Take(10)
                .ToListAsync();

            return Ok(report);
        }

        // Productos sin categoría
        [HttpGet("without-category")]
        public async Task<IActionResult> ProductsWithoutCategory()
        {
            var products = await _context.Products
                .Where(p => p.CategoriaId == 0)
                .ToListAsync();

            return Ok(products);
        }

        // Productos con bajo stock
        [HttpGet("low-stock")]
        public async Task<IActionResult> LowStockProducts(int threshold = 5)
        {
            var products = await _context.Products
                .Where(p => p.Stock <= threshold)
                .ToListAsync();

            return Ok(products);
        }

        // Ingresos por categoría
        [HttpGet("income-by-category")]
        public async Task<IActionResult> IncomeByCategory()
        {
            var report = await _context.SaleDetails
                .Include(sd => sd.Producto)
                .ThenInclude(p => p!.Categoria)
                .GroupBy(sd => sd.Producto!.Categoria!.Nombre)
                .Select(g => new
                {
                    Categoria = g.Key,
                    Ingresos = g.Sum(x => x.Cantidad * x.PrecioUnitario)
                })
                .ToListAsync();

            return Ok(report);
        }

        // Reporte de variación de precios
        // (solo si hay histórico, si no → ejemplo simple)
        [HttpGet("price-variation")]
        public async Task<IActionResult> PriceVariation()
        {
            var report = await _context.Products
                .Select(p => new
                {
                    Producto = p.Nombre,
                    PrecioActual = p.Precio
                })
                .ToListAsync();

            return Ok(report);
        }
    }
}
