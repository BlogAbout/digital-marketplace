# Тестирование

## Типы тестов

### Unit тесты (Vitest)

```bash
npm run test
```

### E2E тесты (Playwright)

```bash
npm run test:e2e
```

### Тесты с UI

```bash
npm run test:e2e:ui

````

### Тесты с отладкой

```bash
npm run test:e2e:debug
````

### Структура тестов

```text
e2e/
├── auth.spec.ts          # Тесты аутентификации
├── products.spec.ts      # Тесты товаров
├── navigation.spec.ts    # Тесты навигации
├── messenger.spec.ts     # Тесты мессенджера
├── profile.spec.ts       # Тесты профиля
├── visual.spec.ts        # Визуальные тесты
├── accessibility.spec.ts # Тесты доступности
└── performance.spec.ts   # Тесты производительности
```

### Запуск

```bash
# Все тесты
npm run test:e2e

# Конкретный тест
npx playwright test e2e/auth.spec.ts

# Headed режим
npm run test:e2e:headed

# Debug режим
npm run test:e2e:debug
```
