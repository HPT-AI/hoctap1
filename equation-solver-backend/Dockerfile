# Dockerfile cho Flask Backend
FROM python:3.11-slim-buster

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy requirements.txt và cài đặt dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ source code
COPY . .

# Expose port 5000
EXPOSE 5000

# Chạy ứng dụng Flask
CMD ["python", "src/main.py"]

