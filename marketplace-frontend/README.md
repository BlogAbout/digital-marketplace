# Digital Marketplace

Платформа для продажи цифровых товаров с мессенджером, блогами и системой статистики.

## 🚀 Возможности

### Для покупателей
- 🔍 Поиск и фильтрация товаров
- 🛒 Покупка цифровых товаров
- 💬 Общение с продавцами
- 📝 Чтение блогов
- ⭐ Подписки на продавцов

### Для продавцов
- 📦 Управление товарами
- 📊 Статистика продаж
- 💰 Баланс и вывод средств
- 🎫 Промокоды
- 📈 Аналитика

### Дополнительно
- 🔐 Безопасная аутентификация
- 🌙 Темная/светлая тема
- 🌍 Мультиязычность (RU/EN)
- 📱 Адаптивный дизайн
- 🔔 Push уведомления

## 📋 Требования

- PHP 8.4+
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- RabbitMQ 3+
- Elasticsearch 8+
- Docker & Docker Compose

## 🛠️ Установка

### Backend

```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/digital-marketplace.git
cd digital-marketplace

# Установить зависимости
composer install

# Настроить окружение
cp .env.example .env
php artisan key:generate

# Запустить Docker
docker-compose up -d

# Запустить миграции
docker-compose exec app php artisan migrate

# Заполнить тестовыми данными
docker-compose exec app php artisan db:seed --class=TestDataSeeder
```

### Frontend

```bash
cd marketplace-frontend

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

## 📁 Структура проекта

```text
digital-marketplace/
├── app/
│   ├── Modules/
│   │   ├── Core/           # Базовые классы
│   │   ├── User/           # Пользователи
│   │   ├── Shop/           # Магазин
│   │   ├── Blog/           # Блоги
│   │   ├── Social/         # Подписки
│   │   ├── Messenger/      # Мессенджер
│   │   ├── Support/        # Поддержка
│   │   ├── Dispute/        # Споры
│   │   ├── Statistics/     # Статистика
│   │   └── Notification/   # Уведомления
├── marketplace-frontend/   # React приложение
├── docker/                 # Docker конфигурация
├── tests/                  # Тесты
└── docs/                   # Документация
```

## 🧪 Тестирование

```bash
# Backend тесты
docker-compose exec app php artisan test

# Frontend тесты
cd marketplace-frontend
npm run test
```

## 📚 API документация

Swagger UI: http://localhost:8080/api/documentation

## 🔧 Полезные команды

```bash
# Переиндексация поиска
php artisan search:reindex

# Агрегация статистики
php artisan statistics:aggregate

# Генерация VAPID ключей
php artisan vapid:generate

# Очистка кэша
php artisan optimize:clear
```

## 🚀 Деплой

См. docs/DEPLOYMENT.md

## 📄 Лицензия

MIT License
