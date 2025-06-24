# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем .csproj и восстанавливаем зависимости
COPY ./LightInMyJune-API/lightinmyjune-api/lightinmyjune-api.csproj ./lightinmyjune-api/
RUN dotnet restore ./lightinmyjune-api/lightinmyjune-api.csproj

# Копируем весь проект
COPY ./LightInMyJune-API/lightinmyjune-api/ ./lightinmyjune-api/
WORKDIR /src/lightinmyjune-api

# Публикуем
RUN dotnet publish -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "lightinmyjune-api.dll"]