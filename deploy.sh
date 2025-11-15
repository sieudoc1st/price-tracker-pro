#!/bin/bash

# Deploy script for price-tracker-pro to VPS
# Usage: chmod +x deploy.sh && ./deploy.sh

set -e  # Exit on error

echo "=========================================="
echo "Price Tracker Pro - Deploy Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/ubuntu/apps/price-tracker-pro"
DOMAIN="vaycuoineo.vn"
BACKEND_PORT="8080"
FRONTEND_BUILD_DIR="$APP_DIR/frontend/dist"

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on the server
if [ ! -d "$APP_DIR" ]; then
    print_error "Directory $APP_DIR not found"
    print_info "This script should be run on the VPS"
    exit 1
fi

cd "$APP_DIR"
print_info "Working directory: $APP_DIR"

# Step 1: Stop existing processes
print_info "Step 1: Stopping existing backend processes..."
if pgrep -f "node server.js" > /dev/null; then
    pkill -f "node server.js" || true
    sleep 2
    print_info "Backend stopped"
else
    print_warning "No running backend process found"
fi

# Step 2: Git pull
print_info "Step 2: Pulling latest code from git..."
git pull origin main
if [ $? -eq 0 ]; then
    print_info "Git pull successful"
else
    print_error "Git pull failed"
    exit 1
fi

# Step 3: Update backend dependencies
print_info "Step 3: Installing backend dependencies..."
cd "$APP_DIR/backend"
npm install --production
if [ $? -eq 0 ]; then
    print_info "Backend dependencies installed"
else
    print_error "Backend npm install failed"
    exit 1
fi
cd "$APP_DIR"

# Step 4: Update frontend dependencies and build
print_info "Step 4: Building frontend..."
cd "$APP_DIR/frontend"
npm install
npm run build
if [ $? -eq 0 ]; then
    print_info "Frontend build successful"
    print_info "Built files in: $FRONTEND_BUILD_DIR"
else
    print_error "Frontend build failed"
    exit 1
fi
cd "$APP_DIR"

# Step 5: Start backend with PM2 or nohup
print_info "Step 5: Starting backend service..."
cd "$APP_DIR/backend"

# Check if PM2 is installed globally
if command -v pm2 &> /dev/null; then
    print_info "Using PM2 to manage backend"
    pm2 stop "price-tracker-backend" 2>/dev/null || true
    pm2 delete "price-tracker-backend" 2>/dev/null || true
    pm2 start server.js --name "price-tracker-backend" --env production
    pm2 save
    print_info "Backend started with PM2"
else
    print_warning "PM2 not found, starting backend with nohup"
    nohup node server.js > backend.log 2>&1 &
    sleep 2
    if pgrep -f "node server.js" > /dev/null; then
        print_info "Backend started successfully (PID: $(pgrep -f 'node server.js'))"
        print_info "Logs: $APP_DIR/backend/backend.log"
    else
        print_error "Failed to start backend"
        exit 1
    fi
fi

cd "$APP_DIR"

# Step 6: Verify backend is running
print_info "Step 6: Verifying backend is running..."
sleep 2
if curl -s http://localhost:$BACKEND_PORT/health | grep -q "ok"; then
    print_info "Backend health check passed"
else
    print_warning "Backend health check may have failed, but service might still be starting"
fi

# Step 7: Nginx configuration (optional)
print_info "Step 7: Checking Nginx configuration..."
if command -v nginx &> /dev/null; then
    print_info "Nginx is installed"
    print_info "You may need to update nginx config to serve frontend from: $FRONTEND_BUILD_DIR"
else
    print_warning "Nginx not installed"
fi

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}Deploy completed successfully!${NC}"
echo "=========================================="
echo ""
echo "Frontend: http://$DOMAIN"
echo "Backend: http://localhost:$BACKEND_PORT"
echo "Health Check: http://localhost:$BACKEND_PORT/health"
echo ""
echo "Frontend files: $FRONTEND_BUILD_DIR"
echo "Backend: $APP_DIR/backend"
echo ""
echo "Next steps:"
echo "1. Configure Nginx to serve frontend from $FRONTEND_BUILD_DIR"
echo "2. Test the application at http://$DOMAIN"
echo "3. Check logs: tail -f $APP_DIR/backend/backend.log"
echo ""
