# Dockerfile cho React Frontend
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --legacy-peer-deps

# Copy toàn bộ source code
COPY . .

# Build ứng dụng React
RUN npm run build

# Sử dụng nginx để serve static files
FROM nginx:alpine

# Copy built files từ stage trước
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

