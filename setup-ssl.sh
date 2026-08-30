#!/bin/bash

set -e

DOMAIN=${1:-example.com}
EMAIL=${2:-admin@example.com}

echo "🔒 Настройка SSL для $DOMAIN..."

# Остановить nginx
docker-compose -f docker-compose.prod.yml stop nginx

# Получить сертификат
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Перезапустить nginx
docker-compose -f docker-compose.prod.yml start nginx

echo "✅ SSL настроен!"
