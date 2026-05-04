using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechStore.Domain.Entities;
using TechStore.Domain.Interfaces;
using TechStore.Infrastructure.Data;

namespace TechStoreApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly ISaleRepository _repository;
        private readonly ApplicationDbContext _context;

        public SalesController(ISaleRepository repository, ApplicationDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetSales()
        {
            try
            {
                var sales = await _context.Sales
                    .Include(s => s.Cliente) // Incluir cliente
                    .Include(s => s.Detalles) // Incluir detalles
                        .ThenInclude(d => d.Producto) // Incluir producto dentro de detalles
                    .OrderByDescending(s => s.Fecha) // Opcional: ordenar por fecha
                    .Select(s => new // Proyección para evitar ciclos
                    {
                        // Datos básicos de la venta
                        s.Id,
                        s.ClienteId,
                        Fecha = s.Fecha.ToString("yyyy-MM-ddTHH:mm:ss"), // Formato ISO
                        s.Total,
                        s.MetodoPago,

                        // Datos del cliente (sin relaciones cíclicas)
                        Cliente = s.Cliente != null ? new
                        {
                            s.Cliente.Id,
                            s.Cliente.Nombre,
                            s.Cliente.DniRuc,
                            s.Cliente.Direccion,
                            s.Cliente.Telefono,
                            s.Cliente.Email
                        } : null,

                        // Detalles de la venta (sin relaciones cíclicas)
                        Detalles = s.Detalles.Select(d => new
                        {
                            d.Id,
                            d.VentaId,
                            d.ProductoId,
                            d.Cantidad,
                            d.PrecioUnitario,
                            d.Subtotal,

                            // Datos del producto (sin relaciones cíclicas)
                            Producto = d.Producto != null ? new
                            {
                                d.Producto.Id,
                                d.Producto.Nombre,
                                d.Producto.Marca,
                                d.Producto.Modelo,
                                d.Producto.Descripcion,
                                d.Producto.Precio,
                                d.Producto.Stock,
                                d.Producto.Codigo,
                                FechaRegistro = d.Producto.FechaRegistro.ToString("yyyy-MM-ddTHH:mm:ss")
                            } : null
                        }).ToList()
                    })
                    .AsNoTracking() // IMPORTANTE: mejora rendimiento
                    .ToListAsync();

                return Ok(sales);
            }
            catch (Exception ex)
            {
                // Log del error
                Console.WriteLine($"Error en GetSales: {ex.Message}");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // MÉTODO PARA UNA SOLA VENTA
        [HttpGet("{id}")]
        public async Task<ActionResult> GetSale(int id)
        {
            try
            {
                var sale = await _context.Sales
                    .Include(s => s.Cliente)
                    .Include(s => s.Detalles)
                        .ThenInclude(d => d.Producto)
                    .Where(s => s.Id == id)
                    .Select(s => new
                    {
                        s.Id,
                        s.ClienteId,
                        Fecha = s.Fecha.ToString("yyyy-MM-ddTHH:mm:ss"),
                        s.Total,
                        s.MetodoPago,

                        Cliente = s.Cliente != null ? new
                        {
                            s.Cliente.Id,
                            s.Cliente.Nombre,
                            s.Cliente.DniRuc,
                            s.Cliente.Direccion,
                            s.Cliente.Telefono,
                            s.Cliente.Email
                        } : null,

                        Detalles = s.Detalles.Select(d => new
                        {
                            d.Id,
                            d.VentaId,
                            d.ProductoId,
                            d.Cantidad,
                            d.PrecioUnitario,
                            d.Subtotal,

                            Producto = d.Producto != null ? new
                            {
                                d.Producto.Id,
                                d.Producto.Nombre,
                                d.Producto.Marca,
                                d.Producto.Modelo,
                                d.Producto.Descripcion,
                                d.Producto.Precio,
                                d.Producto.Stock,
                                d.Producto.Codigo,
                                FechaRegistro = d.Producto.FechaRegistro.ToString("yyyy-MM-ddTHH:mm:ss")
                            } : null
                        }).ToList()
                    })
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                if (sale == null)
                    return NotFound($"Venta con ID {id} no encontrada");

                return Ok(sale);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en GetSale: {ex.Message}");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Sale>> PostSale(Sale sale)
        {            
            decimal totalCalculado = 0;
            foreach (var detalle in sale.Detalles)
            {
                detalle.Subtotal = detalle.Cantidad * detalle.PrecioUnitario;
                totalCalculado += detalle.Subtotal;
            }
            sale.Total = totalCalculado;
            sale.Fecha = DateTime.Now; // Fecha del servidor

            await _repository.AddAsync(sale);

            return CreatedAtAction(nameof(GetSale), new { id = sale.Id }, sale);
        }
    }
}