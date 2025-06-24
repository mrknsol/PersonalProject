# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Копируем .csproj и восстанавливаем зависимости
COPY ./LightInMyJune-API/lightinmyjune-api/lightinmyjune-api.csproj ./LightInMyJune-API/
RUN dotnet restore ./LightInMyJune-API/lightinmyjune-api/lightinmyjune-api.csproj

# Копируем остальной код и публикуем
COPY . .
RUN dotnet publish ./LightInMyJune-API/lightinmyjune-api/lightinmyjune-api.csproj -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "lightinmyjune-api.dll"]