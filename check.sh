#!/bin/bash

echo "=== Проверка Docker контейнеров ==="
docker-compose ps

echo -e "\n=== Проверка PHP ==="
docker-compose exec app php -v

echo -e "\n=== Проверка Laravel ==="
docker-compose exec app php artisan --version

echo -e "\n=== Проверка PostgreSQL ==="
docker-compose exec postgres pg_isready -U marketplace

echo -e "\n=== Проверка Redis ==="
docker-compose exec redis redis-cli -a secret ping

echo -e "\n=== Проверка RabbitMQ ==="
docker-compose exec rabbitmq rabbitmq-diagnostics ping

echo -e "\n=== Проверка Elasticsearch ==="
curl -s http://localhost:9200 | head -n 5

echo -e "\n=== Проверка Nginx ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:8080

echo -e "\n=== Проверка Health Check ==="
curl -s http://localhost:8080/api/health | python3 -m json.tool
