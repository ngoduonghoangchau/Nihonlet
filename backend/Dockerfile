# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy file solution bằng tên chính xác (Tránh dùng dấu sao *)
COPY NihonLet.slnx ./

# Copy các file dự án (.csproj) để restore thư viện trước
# Lưu ý: 'src' phải viết thường đúng như trong ảnh của bạn
COPY src/NihonLet.API/NihonLet.API.csproj src/NihonLet.API/
COPY src/NihonLet.Application/NihonLet.Application.csproj src/NihonLet.Application/
COPY src/NihonLet.Domain/NihonLet.Domain.csproj src/NihonLet.Domain/
COPY src/NihonLet.Infrastructure/NihonLet.Infrastructure.csproj src/NihonLet.Infrastructure/

# Chạy restore cho file solution mới
RUN dotnet restore "NihonLet.slnx"

# Copy toàn bộ phần code còn lại
COPY . .

# Publish ứng dụng ra thư mục /out
WORKDIR "/src/src/NihonLet.API"
RUN dotnet publish "NihonLet.API.csproj" -c Release -o /out /p:UseAppHost=false

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

# Cấu hình cổng cho Render
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Chạy file dll chính xác (Lưu ý chữ HOA/thường)
ENTRYPOINT ["dotnet", "NihonLet.API.dll"]