using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TechStore.Domain.Entities
{
    [Table("producto")]
    public class Product
    {
        public int Id { get; set; }

        [Column("categoria_id")]
        public int CategoriaId { get; set; }

        public string Nombre { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public string Modelo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }

        public int Stock { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
        public virtual Category? Categoria { get; set; }
        public virtual ICollection<SaleDetail> DetallesVenta { get; set; } = new List<SaleDetail>();
    }
}