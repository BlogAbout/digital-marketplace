# Digital Marketplace

Платформа для продажи цифровых товаров с мессенджером, блогами и системой статистики.

## Требования

- Docker
- Docker Compose
- Node.js 20+
- Composer 2+

## Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd digital-marketplace

# Запустить Docker
docker-compose up -d

# Установить зависимости
docker-compose exec app composer install
npm install

# Настроить окружение
cp .env.example .env
docker-compose exec app php artisan key:generate

# Запустить миграции
docker-compose exec app php artisan migrate

# Собрать фронтенд
npm run build
```
