using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechStore.Domain.Entities;
using TechStore.Domain.Interfaces;

namespace TechStoreApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _repository;

        public ProductsController(IProductRepository repository)
        {
            _repository = repository;
        }

        // CRUD BÁSICO

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return Ok(await _repository.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (product.Precio < 0)
                return BadRequest("El precio no puede ser negativo");

            await _repository.AddAsync(product);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
                return BadRequest("El ID no coincide");

            await _repository.UpdateAsync(product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }

        // ENDPOINTS DE BÚSQUEDA

        // Buscar por rango de precios
        [HttpGet("search/price")]
        public async Task<IActionResult> SearchByPrice(decimal min, decimal max)
        {
            var products = (await _repository.GetAllAsync())
                .Where(p => p.Precio >= min && p.Precio <= max);

            return Ok(products);
        }

        // Buscar por stock mínimo o máximo
        [HttpGet("search/stock")]
        public async Task<IActionResult> SearchByStock(int? min, int? max)
        {
            var products = await _repository.GetAllAsync();

            if (min.HasValue)
                products = products.Where(p => p.Stock >= min.Value);

            if (max.HasValue)
                products = products.Where(p => p.Stock <= max.Value);

            return Ok(products);
        }

        // Buscar por fecha de registro
        [HttpGet("search/date")]
        public async Task<IActionResult> SearchByDate(DateTime start, DateTime end)
        {
            var products = (await _repository.GetAllAsync())
                .Where(p => p.FechaRegistro >= start && p.FechaRegistro <= end);

            return Ok(products);
        }

        // Buscar por marca
        [HttpGet("search/brand")]
        public async Task<IActionResult> SearchByBrand(string marca)
        {
            var products = (await _repository.GetAllAsync())
                .Where(p => p.Marca.Contains(marca));

            return Ok(products);
        }
    }
}
