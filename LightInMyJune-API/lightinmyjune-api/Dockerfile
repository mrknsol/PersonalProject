# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Копируем только нужную подпапку, где .csproj
COPY lightinmyjune-api/*.csproj ./lightinmyjune-api/
WORKDIR /app/lightinmyjune-api
RUN dotnet restore

# Копируем всё остальное
COPY . .
RUN dotnet publish lightinmyjune-api/lightinmyjune-api.csproj -c Release -o /out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /out .
ENTRYPOINT ["dotnet", "lightinmyjune-api.dll"]