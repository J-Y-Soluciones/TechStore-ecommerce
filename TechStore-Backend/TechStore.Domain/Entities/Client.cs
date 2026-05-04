using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TechStore.Domain.Entities
{
    [Table("cliente")]
    public class Client
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        [Column("dni_ruc")]
        public string DniRuc { get; set; } = string.Empty;

        public string Direccion { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        // Relación: Un cliente realiza muchas compras
        [JsonIgnore]
        public virtual ICollection<Sale> Ventas { get; set; } = new List<Sale>();
    }
}