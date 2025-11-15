# Price Tracker Pro - VPS Deployment Guide

## Tổng Quan Deployment

Hướng dẫn chi tiết để deploy dự án `price-tracker-pro` lên VPS với domain `vaycuoineo.vn`.

## Các Script Được Cung Cấp

### 1. `deploy.sh` - Script Deploy Tự Động
**Công dụng**: Tự động cập nhật code từ git, build frontend, và khởi động lại backend

**Cách sử dụng**:
```bash
# Copy file lên VPS hoặc clone từ git
cd /home/ubuntu/apps/price-tracker-pro

# Cấp quyền thực thi
chmod +x deploy.sh

# Chạy script
./deploy.sh
```

**Script sẽ thực hiện**:
1. ✅ Dừng backend process cũ
2. ✅ Pull code mới từ git
3. ✅ Cài dependencies backend
4. ✅ Cài dependencies frontend
5. ✅ Build frontend (tạo file static)
6. ✅ Khởi động lại backend
7. ✅ Verify backend hoạt động

### 2. `setup-nginx.sh` - Setup Nginx Configuration
**Công dụng**: Cấu hình Nginx để serve frontend và proxy backend

**Cách sử dụng**:
```bash
# Copy file lên VPS
cd /home/ubuntu/apps/price-tracker-pro

# Cấp quyền thực thi
chmod +x setup-nginx.sh

# Chạy với quyền sudo
sudo ./setup-nginx.sh
```

**Script sẽ thực hiện**:
1. ✅ Kiểm tra Nginx đã cài chưa (cài nếu chưa)
2. ✅ Tạo Nginx config file
3. ✅ Enable site
4. ✅ Test config
5. ✅ Reload Nginx

## Deployment Steps - Từng Bước

### Bước 1: SSH vào VPS
```bash
ssh ubuntu@vaycuoineo.vn
# hoặc ssh -i /path/to/key.pem ubuntu@your-vps-ip
```

### Bước 2: Kiểm tra môi trường hiện tại
```bash
# Kiểm tra Node.js
node --version
npm --version

# Kiểm tra Git
git --version

# Kiểm tra project
cd /home/ubuntu/apps/price-tracker-pro
ls -la
```

### Bước 3: Clone/Update repo (nếu chưa có)
```bash
# Nếu chưa clone
cd /home/ubuntu/apps
git clone https://github.com/robothutbuimivn/price-tracker-pro.git
cd price-tracker-pro

# Nếu đã có, chỉ cần pull
cd /home/ubuntu/apps/price-tracker-pro
git pull origin main
```

### Bước 4: Copy deploy scripts
```bash
# Scripts đã có trong repo
chmod +x deploy.sh setup-nginx.sh
```

### Bước 5: Lần đầu tiên setup Nginx
```bash
sudo ./setup-nginx.sh
```

### Bước 6: Deploy dự án
```bash
./deploy.sh
```

### Bước 7: Kiểm tra backend
```bash
# Kiểm tra backend đang chạy không
curl http://localhost:8080/health

# Xem logs
tail -f /home/ubuntu/apps/price-tracker-pro/backend/backend.log

# Hoặc nếu dùng PM2
pm2 logs price-tracker-backend
```

### Bước 8: Kiểm tra Nginx
```bash
# Test config
sudo nginx -t

# Kiểm tra status
sudo systemctl status nginx

# Xem error logs nếu có
sudo tail -f /var/log/nginx/error.log
```

### Bước 9: Truy cập ứng dụng
```
http://vaycuoineo.vn
```

## Các Lệnh Hữu Ích Khi Deployment

### Quản Lý Backend Process

#### Nếu dùng PM2:
```bash
# Xem danh sách process
pm2 list

# Xem logs
pm2 logs price-tracker-backend

# Restart
pm2 restart price-tracker-backend

# Stop
pm2 stop price-tracker-backend

# Start
pm2 start /home/ubuntu/apps/price-tracker-pro/backend/server.js --name "price-tracker-backend"

# Lưu danh sách process
pm2 save
pm2 startup
```

#### Nếu dùng nohup:
```bash
# Tìm process ID
ps aux | grep "node server.js"

# Kill process
kill -9 <PID>

# Kiểm tra logs
tail -f /home/ubuntu/apps/price-tracker-pro/backend/backend.log
```

### Quản Lý Nginx
```bash
# Kiểm tra config
sudo nginx -t

# Reload config (không restart)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Stop
sudo systemctl stop nginx

# Status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### Database Management
```bash
# Backup database
cp /home/ubuntu/apps/price-tracker-pro/backend/database.db \
   /home/ubuntu/apps/price-tracker-pro/backend/database.db.backup

# Restore database
cp /home/ubuntu/apps/price-tracker-pro/backend/database.db.backup \
   /home/ubuntu/apps/price-tracker-pro/backend/database.db

# Xem kích thước database
du -h /home/ubuntu/apps/price-tracker-pro/backend/database.db
```

## Troubleshooting

### Backend không khởi động
```bash
# Kiểm tra port 8080 đã đang sử dụng chưa
sudo lsof -i :8080

# Kill process nếu cần
sudo kill -9 <PID>

# Xem logs
tail -f /home/ubuntu/apps/price-tracker-pro/backend/backend.log
```

### Frontend không hiển thị
```bash
# Kiểm tra file build tồn tại
ls -la /home/ubuntu/apps/price-tracker-pro/frontend/dist

# Rebuild frontend
cd /home/ubuntu/apps/price-tracker-pro/frontend
npm run build

# Kiểm tra Nginx config
sudo nginx -t

# Xem Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### CORS Error
```bash
# Kiểm tra backend CORS settings
# File: /home/ubuntu/apps/price-tracker-pro/backend/server.js
# Tìm dòng: const corsOptions = { ... }

# Có thể cần update FRONTEND_URL:
export FRONTEND_URL=http://vaycuoineo.vn
```

### Database Lock
```bash
# Delete cache/lock files
rm -f /home/ubuntu/apps/price-tracker-pro/backend/database.db-wal
rm -f /home/ubuntu/apps/price-tracker-pro/backend/database.db-shm

# Restart backend
./deploy.sh
```

## Cấu Hình Biến Môi Trường

Tạo file `.env` trong thư mục backend (nếu cần):

```bash
# /home/ubuntu/apps/price-tracker-pro/backend/.env
NODE_ENV=production
PORT=8080
DATABASE_PATH=/home/ubuntu/apps/price-tracker-pro/backend/database.db
FRONTEND_URL=http://vaycuoineo.vn
```

## SSL/HTTPS với Let's Encrypt

### Cài đặt
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Chạy certbot
sudo certbot --nginx -d vaycuoineo.vn -d www.vaycuoineo.vn

# Auto-renew certificate
sudo certbot renew --dry-run
```

## Monitoring & Logs

### Xem Real-time Logs
```bash
# Backend logs
tail -f /home/ubuntu/apps/price-tracker-pro/backend/backend.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

### Disk Space Check
```bash
# Kiểm tra dung lượng
df -h

# Kiểm tra thư mục dự án
du -sh /home/ubuntu/apps/price-tracker-pro

# Kiểm tra database size
du -h /home/ubuntu/apps/price-tracker-pro/backend/database.db
```

## Quick Redeploy (sau khi có commit mới)

```bash
cd /home/ubuntu/apps/price-tracker-pro
./deploy.sh
```

**Đó là tất cả! Script sẽ tự động xử lý mọi thứ.**

## Support

Nếu gặp lỗi:
1. Kiểm tra logs (xem mục Troubleshooting)
2. Đảm bảo port 8080 không bị chiếm
3. Đảm bảo frontend/dist tồn tại
4. Kiểm tra Nginx config: `sudo nginx -t`

---

**Last Updated**: 2025-11-15
