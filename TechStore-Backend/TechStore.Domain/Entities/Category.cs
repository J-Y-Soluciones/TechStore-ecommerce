using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema; 

namespace TechStore.Domain.Entities
{
    [Table("categoria")] 
    public class Category
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;

        public virtual ICollection<Product> Productos { get; set; } = new List<Product>();
    }
}