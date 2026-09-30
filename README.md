# TechStore E-commerce - Full Stack Solution 🚀

Este proyecto es una plataforma integral de comercio electrónico que incluye un sistema de ventas para clientes y un panel administrativo avanzado para la gestión de inventario, métricas y usuarios.

## 🏗️ Arquitectura y Diseño
El backend ha sido desarrollado siguiendo los principios de la **Arquitectura Hexagonal** (Puertos y Adaptadores), lo que garantiza un desacoplamiento total entre la lógica de negocio y las tecnologías externas (Base de datos, Frameworks, APIs).

- **Dominio:** Entidades y reglas de negocio puras.
- **Aplicación:** Casos de uso e interfaces.
- **Infraestructura:** Implementación de persistencia (Entity Framework Core), seguridad y servicios externos.
- **API:** Controladores y configuración de entrada.

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** & **Vite**
- **Ant Design** (Componentes de UI)
- **TanStack Query** (Gestión de estado asíncrono)
- **Lucide React** (Iconografía)
- **Tailwind CSS** (Estilos rápidos y responsivos)

### Backend
- **ASP.NET Core 8.0**
- **Entity Framework Core**
- **MySQL** (Base de datos principal)
- **JWT (JSON Web Tokens)** para autenticación segura.
- **DotNetEnv** para gestión de variables de entorno.

## 📸 Vista Previa
![Dashboard TechStore](https://i.ibb.co/b5PC42gB/Tech-Store.jpg)

## ⚙️ Configuración del Proyecto

### Requisitos Previos
- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js & npm](https://nodejs.org/)
- Servidor MySQL activo.

### Instalación

1. **Clonar el repositorio:**
      git clone [https://github.com/jamirascencioflores/tech-store-ecommerce.git](https://github.com/jamirascencioflores/tech-store-ecommerce.git)

   `cd tech-store-ecommerce`

2. **Backend:**
  - Ve a ka carpeta `Techstore-Backend`
  - Crea un archivo `.env` o configura tu `appsettings.json` con las siguientes variables:
    ``` 
    DB_SERVER=localhost DB_USER=tu_usuario
    DB_PASSWORD=tu_contraseña
    ```
   - Ejectuta: `dotnet run`

3. **Frontend:**
  - Ve a la carpeta `TechStore-Frontend`.
  - Instalar dependencias: `npm install`.
  - Iniciar modo desarrollo: `npm run dev`.

## 👤 Autor
**Jamir Ascencio Flores:** - [LinkedIn](https://www.linkedin.com/in/jamir-ascencio/) | [Github](https://github.com/jamirascencioflores)

---