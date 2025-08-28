# Image Node gọn nhẹ
FROM node:20-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Cài deps trước để tận dụng cache
COPY package*.json ./
# Nếu bạn có script build (TS/webpack), đổi thành: RUN npm ci && npm run build
RUN npm ci --omit=dev

# Copy phần còn lại của source
COPY . .

# Biến môi trường runtime
ENV NODE_ENV=production
ENV PORT=3000

# Mở cổng ứng dụng
EXPOSE 3000

# Lệnh khởi động (tùy bạn cấu hình "start" trong package.json)
CMD ["npm", "start"]
# hoặc: CMD ["node", "server.js"]
