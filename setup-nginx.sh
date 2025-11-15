#!/bin/bash

# Setup Nginx for price-tracker-pro
# Run this script on VPS: chmod +x setup-nginx.sh && sudo ./setup-nginx.sh

set -e

echo "=========================================="
echo "Setting up Nginx for price-tracker-pro"
echo "=========================================="

# Configuration
DOMAIN="vaycuoineo.vn"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
CONFIG_FILE="$NGINX_SITES_AVAILABLE/$DOMAIN"
APP_DIR="/home/ubuntu/apps/price-tracker-pro"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "This script must be run as root (use sudo)"
    exit 1
fi

echo "Step 1: Checking if Nginx is installed..."
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
fi
echo "Nginx is installed: $(nginx -v 2>&1)"

echo ""
echo "Step 2: Creating Nginx configuration..."

# Create the config file with inline content
cat > "$CONFIG_FILE" << 'EOF'
# Nginx configuration for price-tracker-pro
server {
    listen 80;
    listen [::]:80;
    server_name vaycuoineo.vn www.vaycuoineo.vn;

    # Serve frontend static files
    location / {
        root /home/ubuntu/apps/price-tracker-pro/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 7d;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API proxy
    location /health {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /auth {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    location /products {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    location /admin {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    # Disable access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /\.env {
        deny all;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
EOF

echo "Nginx config created at: $CONFIG_FILE"

echo ""
echo "Step 3: Enabling site..."
if [ ! -L "$NGINX_SITES_ENABLED/$DOMAIN" ]; then
    ln -s "$CONFIG_FILE" "$NGINX_SITES_ENABLED/$DOMAIN"
    echo "Site enabled"
else
    echo "Site already enabled"
fi

echo ""
echo "Step 4: Testing Nginx configuration..."
if nginx -t; then
    echo "Configuration test passed"
else
    echo "Configuration test failed!"
    exit 1
fi

echo ""
echo "Step 5: Reloading Nginx..."
systemctl reload nginx
echo "Nginx reloaded"

echo ""
echo "Step 6: Checking frontend build directory..."
FRONTEND_BUILD="$APP_DIR/frontend/dist"
if [ -d "$FRONTEND_BUILD" ]; then
    echo "Frontend build directory exists: $FRONTEND_BUILD"
    echo "Files in build:"
    ls -la "$FRONTEND_BUILD" | head -10
else
    echo "WARNING: Frontend build directory not found at $FRONTEND_BUILD"
    echo "You may need to run: cd $APP_DIR/frontend && npm run build"
fi

echo ""
echo "=========================================="
echo "Nginx setup completed!"
echo "=========================================="
echo ""
echo "Your application should now be accessible at:"
echo "  http://$DOMAIN"
echo ""
echo "To add SSL/HTTPS certificate (Let's Encrypt):"
echo "  sudo apt-get install certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "To check Nginx status:"
echo "  sudo systemctl status nginx"
echo ""
echo "To view error logs:"
echo "  sudo tail -f /var/log/nginx/error.log"
echo ""
