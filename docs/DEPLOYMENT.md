# Руководство по развертыванию

## Подготовка сервера

### Установка Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Установка Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Настройка SSL

### Установка Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

### Получение сертификата

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

## Деплой

### Первый деплой

```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/digital-marketplace.git /var/www/marketplace
cd /var/www/marketplace

# Создать .env
cp .env.production .env

# Запустить deploy скрипт
./deploy.sh
```

### Обновление

```bash
cd /var/www/marketplace
./deploy.sh
```

## Мониторинг

### Логи Docker

```bash
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Логи Laravel

```bash
tail -f storage/logs/laravel.log
```

## Резервное копирование

### База данных

```bash
# Создать бэкап
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U marketplace marketplace > backup.sql

# Восстановить
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U marketplace marketplace < backup.sql
```

### Файлы

```bash
# Создать бэкап
tar -czf storage-backup.tar.gz storage/

# Восстановить
tar -xzf storage-backup.tar.gz
```
