# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1. Копируем только .csproj файл
COPY ["LightInMyJune-API/lightinmyjune-api/lightinmyjune-api.csproj", "./"]
RUN dotnet restore

# 2. Копируем ВСЁ остальное (включая Data)
COPY . .

# 3. Переходим в папку проекта
WORKDIR "/src/LightInMyJune-API/lightinmyjune-api"

# 4. Публикуем приложение
RUN dotnet publish -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# 5. Копируем результат публикации
COPY --from=build /app .

# 6. Проверяем наличие файла с детальной диагностикой
RUN if [ ! -f "Data/facts.json" ]; then \
        echo "ERROR: facts.json missing!"; \
        echo "Current directory: $(pwd)"; \
        echo "Contents of Data folder:"; \
        ls -la Data || true; \
        echo "All files in app folder:"; \
        ls -laR .; \
        exit 1; \
    fi

ENTRYPOINT ["dotnet", "lightinmyjune-api.dll"]