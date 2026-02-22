# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1. Chỉ copy các file .csproj vào đúng cấu trúc để restore trước (tối ưu cache)
COPY src/NihonLet.API/NihonLet.API.csproj src/NihonLet.API/
COPY src/NihonLet.Application/NihonLet.Application.csproj src/NihonLet.Application/
COPY src/NihonLet.Domain/NihonLet.Domain.csproj src/NihonLet.Domain/
COPY src/NihonLet.Infrastructure/NihonLet.Infrastructure.csproj src/NihonLet.Infrastructure/

# 2. Chạy restore trực tiếp trên Project API
# Lệnh này sẽ tự động tìm các project Domain, Application, Infrastructure thông qua Project Reference
RUN dotnet restore src/NihonLet.API/NihonLet.API.csproj

# 3. Copy toàn bộ code còn lại
COPY . .

# 4. Build và Publish dự án API
WORKDIR "/src/src/NihonLet.API"
RUN dotnet publish "NihonLet.API.csproj" -c Release -o /out /p:UseAppHost=false

# Stage 2: Run (Môi trường chạy nhẹ hơn)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

# Cấu hình cho Render
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "NihonLet.API.dll"]