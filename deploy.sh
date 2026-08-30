#!/bin/bash

set -e

echo "🚀 Начинаем деплой..."

# Перейти в директорию проекта
cd /var/www/marketplace

# Получить последние изменения
echo "📦 Получаем обновления..."
git pull origin main

# Установить зависимости backend
echo "📦 Устанавливаем зависимости backend..."
composer install --no-interaction --optimize-autoloader --no-dev

# Установить зависимости frontend
echo "📦 Устанавливаем зависимости frontend..."
cd marketplace-frontend
npm ci
npm run build
cd ..

# Очистить кэш
echo "🧹 Очищаем кэш..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Запустить миграции
echo "🗄️ Запускаем миграции..."
php artisan migrate --force

# Перезапустить Docker
echo "🔄 Перезапускаем Docker..."
docker-compose -f docker-compose.prod.yml up -d --build

# Переиндексация поиска
echo "🔍 Переиндексация поиска..."
docker-compose -f docker-compose.prod.yml exec -T app php artisan search:reindex

echo "✅ Деплой завершен!"
