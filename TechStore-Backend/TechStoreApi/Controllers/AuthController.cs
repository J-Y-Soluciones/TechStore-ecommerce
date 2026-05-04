using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TechStore.Domain.Entities;
using TechStore.Infrastructure.Data;

namespace TechStoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration; // <--- Nuevo: Para leer appsettings

        // Inyectamos IConfiguration en el constructor
        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginUser)
        {
            // 1. Verificar usuario en BD
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginUser.Username && u.Password == loginUser.Password);

            if (user == null) return Unauthorized("Usuario o contraseña incorrectos");

            // 2. Crear los "Claims" (datos del usuario dentro del token)
            var claims = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            });

            // 3. Obtener la clave desde appsettings.json
            // IMPORTANTE: Debe llamarse igual que en el JSON ("Jwt:Key")
            var keyString = _configuration["Jwt:Key"] ?? "EstaEsMiClaveSecretaSuperSeguraParaElProyectoTechStore2025!";
            var keyBytes = Encoding.UTF8.GetBytes(keyString);

            // 4. Generar el Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddHours(8), // Duración del token
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return Ok(new { token = jwt });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            // Pequeña validación extra: verificar si ya existe el usuario
            var userExists = await _context.Users.AnyAsync(u => u.Username == user.Username);
            if (userExists) return BadRequest("El nombre de usuario ya existe.");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Usuario registrado exitosamente" });
        }
    }
}