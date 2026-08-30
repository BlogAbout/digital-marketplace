# Руководство разработчика

## Архитектура

### Модули

Каждый модуль содержит:
- Controllers — обработка HTTP запросов
- Models — модели данных
- Services — бизнес-логика
- Repositories — работа с БД
- Requests — валидация
- Resources — API ответы

### База данных

- Таблицы в единственном числе
- UUID для всех сущностей
- Soft Deletes

### API

- REST API
- JSON ответы
- Bearer токены
- Rate limiting

## Разработка

### Создание нового модуля

```bash
# Создать структуру
mkdir -p app/Modules/NewModule/{Controllers,Models,Services,Repositories,Requests,Resources}

# Создать миграцию
php artisan make:migration create_new_module_table
```

## Правила кода

- Использовать PHP 8.4+
- Типизировать все параметры
- Использовать PHPDoc
- Следовать PSR-12
