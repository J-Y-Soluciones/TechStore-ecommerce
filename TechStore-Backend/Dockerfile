# Etapa 1: Compilación (.NET 8 SDK)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar proyectos y restaurar dependencias
COPY ["TechStoreApi/TechStoreApi.csproj", "TechStoreApi/"]
COPY ["TechStore.Application/TechStore.Application.csproj", "TechStore.Application/"]
COPY ["TechStore.Domain/TechStore.Domain.csproj", "TechStore.Domain/"]
COPY ["TechStore.Infrastructure/TechStore.Infrastructure.csproj", "TechStore.Infrastructure/"]

RUN dotnet restore "TechStoreApi/TechStoreApi.csproj"

# Copiar código restante y compilar
COPY . .
WORKDIR "/src/TechStoreApi"
RUN dotnet publish "TechStoreApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: Runtime (.NET 8 ASP.NET)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TechStoreApi.dll"]