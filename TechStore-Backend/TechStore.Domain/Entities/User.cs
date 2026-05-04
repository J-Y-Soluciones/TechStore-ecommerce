namespace TechStore.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // En producción, esto debería ir encriptado
        public string Role { get; set; } = "Admin";
    }
}