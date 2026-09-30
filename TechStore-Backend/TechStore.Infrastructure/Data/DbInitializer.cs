using System;
using System.Collections.Generic;
using System.Linq;
using TechStore.Domain.Entities;

namespace TechStore.Infrastructure.Data
{
    public static class DbInitializer
    {
        public static void Seed(ApplicationDbContext context)
        {
            // 1. Sembrar Usuarios si no existen
            if (!context.Users.Any())
            {
                var usuarios = new[]
                {
                    new User
                    {
                        Username = "admin",
                        Password = "Password123!",
                        Role = "Admin"
                    }
                };
                context.Users.AddRange(usuarios);
                context.SaveChanges();
            }

            // 2. Sembrar Categorías si no existen
            if (!context.Categories.Any())
            {
                var categorias = new[]
                {
                    new Category { Nombre = "Laptops", Descripcion = "Portátiles gamers y ultrabooks corporativos" },
                    new Category { Nombre = "Periféricos", Descripcion = "Teclados mecánicos, ratones ópticos y headsets" },
                    new Category { Nombre = "Componentes", Descripcion = "Tarjetas de video, procesadores y placas madre" },
                    new Category { Nombre = "Monitores", Descripcion = "Pantallas gamer IPS, OLED y alta tasa de refresco" },
                    new Category { Nombre = "Almacenamiento", Descripcion = "Unidades SSD NVMe M.2 y discos mecánicos" }
                };

                context.Categories.AddRange(categorias);
                context.SaveChanges();
            }

            // 3. Sembrar Productos si no existen (12 productos con variedad de stock)
            if (!context.Products.Any())
            {
                var catLaptops = context.Categories.First(c => c.Nombre == "Laptops");
                var catPerifericos = context.Categories.First(c => c.Nombre == "Periféricos");
                var catComponentes = context.Categories.First(c => c.Nombre == "Componentes");
                var catMonitores = context.Categories.First(c => c.Nombre == "Monitores");
                var catAlmacenamiento = context.Categories.First(c => c.Nombre == "Almacenamiento");

                var productos = new[]
                {
                    // Laptops
                    new Product
                    {
                        CategoriaId = catLaptops.Id,
                        Nombre = "Laptop Gamer Pro",
                        Marca = "ASUS",
                        Modelo = "ROG Zephyrus G14",
                        Descripcion = "Ryzen 9 8945HS, 32GB RAM, RTX 4070, 1TB SSD",
                        Precio = 1899.99m,
                        Stock = 7,
                        Codigo = "LAP-001",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-2)
                    },
                    new Product
                    {
                        CategoriaId = catLaptops.Id,
                        Nombre = "Laptop Corporativa ThinkPad",
                        Marca = "Lenovo",
                        Modelo = "T14 Gen 4",
                        Descripcion = "Core i7 1365U, 16GB RAM, 512GB SSD Iris Xe",
                        Precio = 1250.00m,
                        Stock = 12,
                        Codigo = "LAP-002",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-1)
                    },
                    // Periféricos
                    new Product
                    {
                        CategoriaId = catPerifericos.Id,
                        Nombre = "Teclado Mecánico RGB",
                        Marca = "Keychron",
                        Modelo = "K2 Pro QMK",
                        Descripcion = "Switches Red mecánicos hot-swappable inalámbrico",
                        Precio = 119.00m,
                        Stock = 24,
                        Codigo = "PER-001",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-3)
                    },
                    new Product
                    {
                        CategoriaId = catPerifericos.Id,
                        Nombre = "Mouse Inalámbrico Ultraligero",
                        Marca = "Logitech G",
                        Modelo = "PRO X SUPERLIGHT 2",
                        Descripcion = "Sensor HERO 2 32K DPI, peso 60g, switches híbridos",
                        Precio = 149.99m,
                        Stock = 3, // Stock crítico (alerta en UI)
                        Codigo = "PER-002",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-2)
                    },
                    new Product
                    {
                        CategoriaId = catPerifericos.Id,
                        Nombre = "Auriculares Gaming 7.1",
                        Marca = "HyperX",
                        Modelo = "Cloud III Wireless",
                        Descripcion = "Batería de hasta 120 horas, drivers 53mm en ángulo",
                        Precio = 139.50m,
                        Stock = 15,
                        Codigo = "PER-003",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-1)
                    },
                    // Componentes
                    new Product
                    {
                        CategoriaId = catComponentes.Id,
                        Nombre = "Tarjeta Gráfica RTX 4070 Super",
                        Marca = "MSI",
                        Modelo = "Ventus 2X OC 12GB",
                        Descripcion = "12GB GDDR6X, DLSS 3.5, Ray Tracing",
                        Precio = 649.00m,
                        Stock = 4, // Stock bajo
                        Codigo = "COM-001",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-2)
                    },
                    new Product
                    {
                        CategoriaId = catComponentes.Id,
                        Nombre = "Procesador Ryzen 7",
                        Marca = "AMD",
                        Modelo = "7800X3D",
                        Descripcion = "8 núcleos, 16 hilos, 3D V-Cache para gaming puro",
                        Precio = 389.00m,
                        Stock = 9,
                        Codigo = "COM-002",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-2)
                    },
                    new Product
                    {
                        CategoriaId = catComponentes.Id,
                        Nombre = "Tarjeta Gráfica RTX 4060",
                        Marca = "ASUS",
                        Modelo = "Dual OC Edition",
                        Descripcion = "8GB GDDR6, diseño compacto de 2 ventiladores",
                        Precio = 329.00m,
                        Stock = 11,
                        Codigo = "COM-003",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-3)
                    },
                    // Monitores
                    new Product
                    {
                        CategoriaId = catMonitores.Id,
                        Nombre = "Monitor Gaming 27'' QHD",
                        Marca = "LG",
                        Modelo = "UltraGear 27GP850",
                        Descripcion = "Nano IPS 165Hz (OC 180Hz), 1ms GtG, G-Sync compatible",
                        Precio = 349.99m,
                        Stock = 6,
                        Codigo = "MON-001",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-1)
                    },
                    new Product
                    {
                        CategoriaId = catMonitores.Id,
                        Nombre = "Monitor Curvo 34'' Ultrawide",
                        Marca = "Samsung",
                        Modelo = "Odyssey G5",
                        Descripcion = "Resolución WQHD, 165Hz, curvatura 1000R, FreeSync",
                        Precio = 489.00m,
                        Stock = 2, // Stock crítico
                        Codigo = "MON-002",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-1)
                    },
                    // Almacenamiento
                    new Product
                    {
                        CategoriaId = catAlmacenamiento.Id,
                        Nombre = "SSD NVMe M.2 2TB",
                        Marca = "Samsung",
                        Modelo = "990 PRO",
                        Descripcion = "Lectura 7450 MB/s, PCIe 4.0 NVMe 2.0 ideal PS5 y PC",
                        Precio = 179.99m,
                        Stock = 18,
                        Codigo = "ALM-001",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-2)
                    },
                    new Product
                    {
                        CategoriaId = catAlmacenamiento.Id,
                        Nombre = "SSD NVMe M.2 1TB",
                        Marca = "Kingston",
                        Modelo = "KC3000",
                        Descripcion = "Lectura 7000 MB/s con disipador de grafeno",
                        Precio = 98.50m,
                        Stock = 30,
                        Codigo = "ALM-002",
                        FechaRegistro = DateTime.UtcNow.AddMonths(-3)
                    }
                };

                context.Products.AddRange(productos);
                context.SaveChanges();
            }

            // 4. Sembrar Clientes si no existen (5 clientes peruanos variados)
            if (!context.Clients.Any())
            {
                var clientes = new[]
                {
                    new Client
                    {
                        Nombre = "Juan Perez Rivera",
                        DniRuc = "72345678",
                        Direccion = "Av. Javier Prado Este 1234, Lima",
                        Telefono = "987654321",
                        Email = "juan.perez@gmail.com"
                    },
                    new Client
                    {
                        Nombre = "Tech Solutions SAC",
                        DniRuc = "20123456789",
                        Direccion = "Calle Las Begonias 450, San Isidro",
                        Telefono = "912345678",
                        Email = "contacto@techsolutions.pe"
                    },
                    new Client
                    {
                        Nombre = "Mariana Quispe Alva",
                        DniRuc = "45891234",
                        Direccion = "Jr. Lampa 842, Cercado de Lima",
                        Telefono = "974123654",
                        Email = "marian.quispe@hotmail.com"
                    },
                    new Client
                    {
                        Nombre = "Inversiones Digitales EIRL",
                        DniRuc = "20601294851",
                        Direccion = "Av. Benavides 2150, Miraflores",
                        Telefono = "965823147",
                        Email = "facturacion@inversionesdigitales.pe"
                    },
                    new Client
                    {
                        Nombre = "Carlos Mendoza Barreto",
                        DniRuc = "09456712",
                        Direccion = "Av. La Marina 1520, San Miguel",
                        Telefono = "951236874",
                        Email = "carlos.mendoza@yahoo.com"
                    }
                };

                context.Clients.AddRange(clientes);
                context.SaveChanges();
            }

            // 5. Sembrar Historial de Ventas si no existen (Distribuidas a lo largo del año y días recientes)
            if (!context.Sales.Any())
            {
                var clientes = context.Clients.ToList();
                var prods = context.Products.ToDictionary(p => p.Codigo);

                var ventas = new List<Sale>();

                // Helper para armar venta con detalles
                Sale CrearVenta(Client cliente, DateTime fecha, string metodoPago, params (Product prod, int cant)[] items)
                {
                    var detalles = items.Select(i => new SaleDetail
                    {
                        ProductoId = i.prod.Id,
                        Cantidad = i.cant,
                        PrecioUnitario = i.prod.Precio,
                        Subtotal = i.prod.Precio * i.cant
                    }).ToList();

                    return new Sale
                    {
                        ClienteId = cliente.Id,
                        Fecha = fecha,
                        MetodoPago = metodoPago,
                        Total = detalles.Sum(d => d.Subtotal),
                        Detalles = detalles
                    };
                }

                // --- HISTORIAL MENSUAL (Alimenta la gráfica de Tendencias y Proyección) ---
                // Noviembre 2025 (~10 meses atrás)
                ventas.Add(CrearVenta(clientes[0], DateTime.Now.AddMonths(-10), "Transferencia Bancaria",
                    (prods["PER-001"], 2), (prods["ALM-002"], 2)));

                // Enero 2026 (~8 meses atrás)
                ventas.Add(CrearVenta(clientes[1], DateTime.Now.AddMonths(-8), "Tarjeta de Crédito",
                    (prods["COM-003"], 3)));

                // Marzo 2026 (~6 meses atrás)
                ventas.Add(CrearVenta(clientes[2], DateTime.Now.AddMonths(-6), "Efectivo",
                    (prods["MON-001"], 1), (prods["PER-002"], 2)));

                // Mayo 2026 (~4 meses atrás)
                ventas.Add(CrearVenta(clientes[3], DateTime.Now.AddMonths(-4), "Transferencia Bancaria",
                    (prods["LAP-002"], 1), (prods["ALM-001"], 2)));

                // Junio 2026 (~3 meses atrás)
                ventas.Add(CrearVenta(clientes[4], DateTime.Now.AddMonths(-3), "Tarjeta de Débito",
                    (prods["COM-001"], 2)));

                // Julio 2026 (~2 meses atrás)
                ventas.Add(CrearVenta(clientes[0], DateTime.Now.AddMonths(-2), "Tarjeta de Crédito",
                    (prods["LAP-001"], 1), (prods["PER-003"], 2)));

                // Agosto 2026 (~1 mes atrás)
                ventas.Add(CrearVenta(clientes[1], DateTime.Now.AddMonths(-1), "Transferencia Bancaria",
                    (prods["MON-002"], 1), (prods["COM-002"], 1)));

                // --- VENTAS RECIENTES (Alimenta la gráfica diaria y de últimos 7 días) ---
                // Hace 6 días
                ventas.Add(CrearVenta(clientes[2], DateTime.Now.AddDays(-6), "Efectivo",
                    (prods["PER-001"], 2)));

                // Hace 4 días
                ventas.Add(CrearVenta(clientes[3], DateTime.Now.AddDays(-4), "Tarjeta de Crédito",
                    (prods["ALM-001"], 2), (prods["PER-002"], 1)));

                // Hace 3 días
                ventas.Add(CrearVenta(clientes[4], DateTime.Now.AddDays(-3), "Transferencia Bancaria",
                    (prods["COM-001"], 1)));

                // Hace 2 días
                ventas.Add(CrearVenta(clientes[0], DateTime.Now.AddDays(-2), "Tarjeta de Débito",
                    (prods["MON-001"], 1), (prods["PER-003"], 1)));

                // Hace 1 día
                ventas.Add(CrearVenta(clientes[1], DateTime.Now.AddDays(-1), "Tarjeta de Crédito",
                    (prods["LAP-002"], 1)));

                // Hoy
                ventas.Add(CrearVenta(clientes[2], DateTime.Now, "Efectivo",
                    (prods["COM-003"], 1), (prods["PER-001"], 1)));

                context.Sales.AddRange(ventas);
                context.SaveChanges();
            }
        }
    }
}