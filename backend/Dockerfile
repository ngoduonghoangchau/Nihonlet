# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy file solution mới (.slnx)
COPY *.slnx ./

# Copy toàn bộ folder src vào để đảm bảo không thiếu project nào
# Lưu ý: 'src' phải viết thường nếu folder của bạn là 'src'
COPY src/ ./src/

# Chạy lệnh restore cho toàn bộ solution
RUN dotnet restore

# Build dự án API
WORKDIR /app/src/NihonLet.API
RUN dotnet publish -c Release -o /out

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

# Cấu hình cổng cho Render
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Đảm bảo file .dll này viết đúng HOA/thường như trong thư mục của bạn
ENTRYPOINT ["dotnet", "NihonLet.API.dll"]