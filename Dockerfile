# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем только .csproj для восстановления зависимостей
COPY ["LightInMyJune-API/lightinmyjune-api/*.csproj", "lightinmyjune-api/"]
RUN dotnet restore "lightinmyjune-api/lightinmyjune-api.csproj"

# Копируем ВСЕ остальные файлы
COPY ["LightInMyJune-API/lightinmyjune-api/", "lightinmyjune-api/"]
WORKDIR "/src/lightinmyjune-api"

# Публикуем приложение
RUN dotnet publish -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Копируем только результат публикации (включая Data из-за .csproj настройки)
COPY --from=build /app .

# Проверка существования файла (для отладки)
RUN if [ ! -f "Data/facts.json" ]; then echo "ERROR: facts.json missing!" && exit 1; fi

ENTRYPOINT ["dotnet", "lightinmyjune-api.dll"]