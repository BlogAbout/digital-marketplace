# Конвенции именования базы данных

## Таблицы
- Все названия таблиц в **единственном числе**
- В нижнем регистре
- Слова разделяются знаком подчеркивания `_`
- Каждая модель обязана указывать свойство `$table`

### Примеры:
- `user` - пользователи
- `shop_product` - товары магазина
- `shop_category` - категории товаров
- `shop_order` - заказы
- `blog_post` - посты блога
- `chat_message` - сообщения чата
- `user_transaction` - транзакции пользователя

## Поля
- Первичный ключ: `id` (UUID)
- Внешние ключи: `{table_name}_id`
- Временные метки: `created_at`, `updated_at`, `deleted_at`
- Названия полей в нижнем регистре, слова через `_`

## Модели
- Название модели в CamelCase
- Обязательное указание `protected $table`
- Наследование от `BaseModel`

### Примеры:
```php
class User extends BaseModel
{
    protected $table = 'user';
}

class ShopProduct extends BaseModel
{
    protected $table = 'shop_product';
}
```

## Связи

- belongsTo: shop_category → shop_product (через category_id)
- hasMany: shop_product → shop_image (через product_id)
- morphMany: для полиморфных связей

## Индексы

- Уникальные: {table}_{field}_unique
- Обычные: {table}_{field}_index
- Составные: {table}_{field1}_{field2}_index
