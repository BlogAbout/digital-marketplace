FROM php:8.4-fpm

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/*

# Установка PHP расширений
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo_pgsql \
    mbstring \
    xml \
    bcmath \
    opcache \
    zip \
    gd

# Установка Redis через PECL
RUN pecl install redis && docker-php-ext-enable redis

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Устанавливаем зависимости
RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-interaction --no-dev --prefer-dist

RUN chmod -R 777 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
