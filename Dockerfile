# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем только .csproj и восстанавливаем зависимости
COPY ["LightInMyJune-API/lightinmyjune-api/lightinmyjune-api.csproj", "lightinmyjune-api/"]
RUN dotnet restore "lightinmyjune-api/lightinmyjune-api.csproj"

# Копируем ВСЁ остальное (включая Data/facts.json)
COPY ./LightInMyJune-API/lightinmyjune-api/ ./lightinmyjune-api/
WORKDIR "/src/lightinmyjune-api"
RUN dotnet publish -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
# Копируем папку Data из исходников
COPY --from=build /src/lightinmyjune-api/Data ./Data

ENTRYPOINT ["dotnet", "lightinmyjune-api.dll"]