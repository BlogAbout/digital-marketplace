# CI/CD Pipeline

## Workflow

1. **Backend Tests**
    - PHP 8.4
    - PostgreSQL 16
    - PHPUnit тесты
    - Pint (code style)
    - PHPStan (static analysis)

2. **Frontend Build**
    - Node.js 20
    - TypeScript проверка
    - Vite сборка

## Secrets

Необходимые secrets в GitHub:
- `DOCKER_USERNAME` — имя пользователя Docker Hub
- `DOCKER_PASSWORD` — пароль Docker Hub
- `DEPLOY_HOST` — хост сервера
- `DEPLOY_USER` — пользователь сервера
- `DEPLOY_KEY` — SSH ключ

## Настройка Secrets

1. Перейти в репозиторий на GitHub
2. Settings → Secrets → Actions
3. Добавить необходимые secrets
