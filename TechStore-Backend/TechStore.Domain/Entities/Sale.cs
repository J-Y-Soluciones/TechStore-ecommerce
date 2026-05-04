using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TechStore.Domain.Entities
{
    [Table("venta")]
    public class Sale
    {
        public int Id { get; set; }

        [Column("cliente_id")]
        public int ClienteId { get; set; }

        public DateTime Fecha { get; set; } = DateTime.Now;

        [Column(TypeName = "decimal(10,2)")]
        public decimal Total { get; set; }

        [Column("metodo_pago")]
        public string MetodoPago { get; set; } = string.Empty;

        // Relaciones
        [JsonIgnore]
        public virtual Client? Cliente { get; set; }
        [JsonIgnore]
        public virtual ICollection<SaleDetail> Detalles { get; set; } = new List<SaleDetail>();
    }
}