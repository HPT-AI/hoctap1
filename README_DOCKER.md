# Hướng Dẫn Chạy Ứng Dụng Giải Phương Trình với Docker

## 📋 Tổng Quan
Dự án này đã được Dockerize để dễ dàng triển khai và chạy. Bao gồm:
- **Frontend React**: Chạy trên port 80 (nginx)
- **Backend Flask**: Chạy trên port 5000

## 🐳 Yêu Cầu Hệ Thống
- **Docker**: Phiên bản 20.10 trở lên
- **Docker Compose**: Phiên bản 1.29 trở lên

## 🚀 Cách Chạy Ứng Dụng

### Bước 1: Tải về và giải nén dự án
```bash
# Giải nén file zip đã tải về
unzip equation-solver-docker.zip
cd equation-solver-docker
```

### Bước 2: Chạy ứng dụng với Docker Compose
```bash
# Build và chạy tất cả services
docker-compose up --build

# Hoặc chạy ở chế độ nền (background)
docker-compose up --build -d
```

### Bước 3: Truy cập ứng dụng
- **Frontend React**: http://localhost
- **Backend Flask**: http://localhost:5000

## 🎯 Cách Sử Dụng

### Giải Phương Trình Bậc 2
1. Truy cập http://localhost
2. Click tab "Giải Phương Trình Bậc 2"
3. Nhập các hệ số a, b, c
4. Click "Giải Phương Trình"

### Giải Hệ Phương Trình Tuyến Tính
1. Truy cập http://localhost
2. Click tab "Giải Hệ Phương Trình"
3. Một tab mới sẽ mở với ứng dụng Flask tại http://localhost:5000
4. Chọn kích thước hệ phương trình (2x2, 3x3, 4x4)
5. Nhập ma trận hệ số A và vector vế phải b
6. Click "Giải Hệ Phương Trình"

## 🛠 Các Lệnh Docker Hữu Ích

### Xem logs của services
```bash
# Xem logs của tất cả services
docker-compose logs

# Xem logs của frontend
docker-compose logs frontend

# Xem logs của backend
docker-compose logs backend

# Theo dõi logs real-time
docker-compose logs -f
```

### Dừng và khởi động lại services
```bash
# Dừng tất cả services
docker-compose down

# Khởi động lại
docker-compose up

# Rebuild và khởi động lại
docker-compose up --build
```

### Xóa containers và images
```bash
# Dừng và xóa containers
docker-compose down

# Xóa cả volumes (nếu có)
docker-compose down -v

# Xóa images đã build
docker-compose down --rmi all
```

## 📁 Cấu Trúc Dự Án Docker

```
equation-solver-docker/
├── docker-compose.yml           # Định nghĩa services
├── equation-solver-source/
│   └── equation-solver/         # React Frontend
│       ├── Dockerfile          # Docker config cho frontend
│       ├── nginx.conf          # Nginx configuration
│       ├── src/
│       ├── package.json
│       └── ...
└── equation-solver-backend/     # Flask Backend
    ├── Dockerfile              # Docker config cho backend
    ├── src/
    ├── requirements.txt
    └── ...
```

## 🌟 Tính Năng Docker

### Multi-stage Build
- Frontend sử dụng multi-stage build để tối ưu kích thước image
- Stage 1: Build React app với Node.js
- Stage 2: Serve static files với Nginx

### Network Isolation
- Frontend và Backend chạy trong cùng một Docker network
- Tự động service discovery giữa các containers

### Port Mapping
- Frontend: Container port 80 → Host port 80
- Backend: Container port 5000 → Host port 5000

## 🐛 Xử Lý Lỗi Thường Gặp

### 1. Port đã được sử dụng
```bash
# Kiểm tra process đang sử dụng port
netstat -tulpn | grep :80
netstat -tulpn | grep :5000

# Dừng process hoặc thay đổi port trong docker-compose.yml
```

### 2. Docker build failed
```bash
# Xóa cache và rebuild
docker-compose build --no-cache

# Kiểm tra logs chi tiết
docker-compose up --build
```

### 3. Container không khởi động
```bash
# Kiểm tra logs
docker-compose logs [service_name]

# Kiểm tra trạng thái containers
docker-compose ps
```

### 4. Không thể truy cập ứng dụng
- Đảm bảo Docker containers đang chạy: `docker-compose ps`
- Kiểm tra port mapping trong docker-compose.yml
- Thử truy cập http://localhost thay vì http://127.0.0.1

## 🔧 Tùy Chỉnh Cấu Hình

### Thay đổi ports
Chỉnh sửa file `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Thay đổi port frontend thành 8080
  backend:
    ports:
      - "5001:5000"  # Thay đổi port backend thành 5001
```

### Environment Variables
Thêm biến môi trường trong `docker-compose.yml`:
```yaml
services:
  backend:
    environment:
      - FLASK_ENV=production
      - DEBUG=False
```

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra Docker và Docker Compose đã được cài đặt
2. Đảm bảo ports 80 và 5000 không bị chiếm dụng
3. Xem logs chi tiết với `docker-compose logs`
4. Thử rebuild với `docker-compose up --build --no-cache`

---
**Chúc bạn sử dụng ứng dụng Docker thành công! 🐳**

