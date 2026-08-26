FROM php:8.4-fpm-alpine

# Установка системных зависимостей
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev \
    autoconf \
    g++ \
    make \
    gmp-dev \
    $PHPIZE_DEPS \
    linux-headers

# Установка PHP расширений
RUN docker-php-ext-install \
    pdo_pgsql \
    mbstring \
    xml \
    bcmath \
    opcache \
    gmp

# Установка zip
RUN docker-php-ext-configure zip \
    && docker-php-ext-install zip

# Установка gd
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Установка pcntl (важно для Reverb!)
RUN docker-php-ext-configure pcntl --enable-pcntl \
    && docker-php-ext-install pcntl

# Установка posix
RUN docker-php-ext-install posix

# Установка Redis через PECL (если доступно)
RUN pecl install redis || echo "Redis extension already installed"

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-interaction --no-dev --prefer-dist

# Создать необходимые директории
RUN mkdir -p storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# Исправить права
RUN chmod -R 777 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
