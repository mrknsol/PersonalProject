# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1. Копируем решение и файлы проекта
COPY ["LightInMyJune-API/lightinmyjune-api/lightinmyjune-api.csproj", "lightinmyjune-api/"]
COPY ["LightInMyJune-API/lightinmyjune-api/Data/facts.json", "lightinmyjune-api/Data/"]

# 2. Восстанавливаем зависимости
RUN dotnet restore "lightinmyjune-api/lightinmyjune-api.csproj"

# 3. Копируем ВСЕ остальные файлы
COPY ["LightInMyJune-API/lightinmyjune-api/", "lightinmyjune-api/"]
WORKDIR "/src/lightinmyjune-api"

# 4. Публикуем приложение
RUN dotnet publish -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# 5. Копируем результат публикации
COPY --from=build /app .

# 6. Проверяем наличие файла
RUN if [ ! -f "Data/facts.json" ]; then echo "ERROR: facts.json missing!" && ls -la Data && exit 1; fi

ENTRYPOINT ["dotnet", "lightinmyjune-api.dll"]