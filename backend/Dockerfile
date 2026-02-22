# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy các file .csproj và restore dependencies
COPY *.slnx .
COPY src/NihonLet.API/*.csproj src/NihonLet.API/
COPY src/NihonLet.Application/*.csproj src/NihonLet.Application/
COPY src/NihonLet.Domain/*.csproj src/NihonLet.Domain/
COPY src/NihonLet.Infrastructure/*.csproj src/NihonLet.Infrastructure/
RUN dotnet restore

# Copy toàn bộ code và build
COPY . .
WORKDIR /app/src/NihonLet.API
RUN dotnet publish -c Release -o /out

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

# Cấu hình cổng (Render dùng cổng 10000 mặc định)
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "NihonLet.API.dll"]