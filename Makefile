.PHONY: help install migrate seed test lint format build deploy

help:
	@echo "Доступные команды:"
	@echo "  install  - Установка зависимостей"
	@echo "  migrate  - Запуск миграций"
	@echo "  seed     - Заполнение базы данными"
	@echo "  test     - Запуск тестов"
	@echo "  lint     - Проверка кода"
	@echo "  format   - Форматирование кода"
	@echo "  build    - Сборка проекта"
	@echo "  deploy   - Деплой на production"

install:
	composer install
	cd marketplace-frontend && npm install

migrate:
	docker-compose exec app php artisan migrate

seed:
	docker-compose exec app php artisan db:seed

test:
	docker-compose exec app php artisan test
	cd marketplace-frontend && npm run test

lint:
	docker-compose exec app vendor/bin/pint --test
	docker-compose exec app vendor/bin/phpstan analyse

format:
	docker-compose exec app vendor/bin/pint

build:
	cd marketplace-frontend && npm run build

deploy:
	git pull origin main
	composer install --no-dev --optimize-autoloader
	docker-compose -f docker-compose.prod.yml up -d --build
