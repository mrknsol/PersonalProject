# Сборка проекта
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Копируем всё сразу (т.к. .csproj и исходники рядом)
COPY . . 

# Восстановление зависимостей
RUN dotnet restore ./lightinmyjune-api.csproj

# Публикуем в релизе
RUN dotnet publish ./lightinmyjune-api.csproj -c Release -o /out

# Финальный образ
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /out .

EXPOSE 80

ENTRYPOINT ["dotnet", "lightinmyjune-api.dll"]