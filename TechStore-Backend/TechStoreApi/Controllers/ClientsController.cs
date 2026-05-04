using Microsoft.AspNetCore.Mvc;
using TechStore.Domain.Entities;
using TechStore.Domain.Interfaces;

namespace TechStoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly IClientRepository _repository;

        public ClientsController(IClientRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            return Ok(await _repository.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _repository.GetByIdAsync(id);
            if (client == null) return NotFound();
            return Ok(client);
        }

        [HttpPost]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            // Opcional: Podríamos validar si el DNI ya existe antes de guardar
            try
            {
                await _repository.AddAsync(client);
                return CreatedAtAction(nameof(GetClient), new { id = client.Id }, client);
            }
            catch (Exception ex)
            {
                // Si el DNI está repetido, la base de datos lanzará un error (porque pusimos IsUnique)
                return BadRequest($"Error al guardar: {ex.Message}. Verifique si el DNI ya existe.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(int id, Client client)
        {
            if (id != client.Id) return BadRequest();
            await _repository.UpdateAsync(client);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}