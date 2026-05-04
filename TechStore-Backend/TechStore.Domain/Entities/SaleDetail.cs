using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TechStore.Domain.Entities
{
    [Table("detalle_venta")]
    public class SaleDetail
    {
        public int Id { get; set; }

        [Column("venta_id")]
        public int VentaId { get; set; }

        [Column("producto_id")]
        public int ProductoId { get; set; }

        public int Cantidad { get; set; }

        [Column("precio_unitario", TypeName = "decimal(10,2)")]
        public decimal PrecioUnitario { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Subtotal { get; set; }

        // Relaciones
        [JsonIgnore]
        public virtual Sale? Venta { get; set; }
        [JsonIgnore]
        public virtual Product? Producto { get; set; }

    }
}