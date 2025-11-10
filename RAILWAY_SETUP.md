# Railway Deployment Setup Guide

## Проблема которую мы решили:
- ❌ 502 Bad Gateway ошибка
- ❌ Backend не запускался
- ❌ Неправильные URL для API (localhost)
- ❌ Отсутствовали environment variables

## Исправления:
✅ Создан `Caddyfile` для проксирования запросов
✅ Создан `start.sh` для запуска backend и frontend
✅ Обновлен `package.json` для правильной сборки
✅ Создан `railway.toml` для конфигурации Railway

---

## Шаги для деплоя на Railway:

### 1. Создайте PostgreSQL базу данных на Railway

1. В вашем проекте Railway нажмите **"New" → "Database" → "PostgreSQL"**
2. Railway автоматически создаст переменную `DATABASE_URL`
3. Скопируйте значение `DATABASE_URL` (будет использовано ниже)

### 2. Настройте переменные окружения

Перейдите в **Settings → Variables** вашего сервиса и добавьте:

#### Обязательные переменные:

```bash
# Database (будет автоматически, если создали PostgreSQL)
DATABASE_URL=<автоматически из PostgreSQL сервиса>

# JWT Configuration
JWT_SECRET=ilialox-production-secret-key-change-this-to-random-string-min32chars
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=production

# Frontend URL (замените на ваш домен Railway)
FRONTEND_URL=https://carlab-production.up.railway.app

# API URL для frontend (относительный путь)
VITE_API_URL=/api
```

#### Как получить FRONTEND_URL:
- После первого деплоя Railway покажет URL типа `https://your-app.up.railway.app`
- Скопируйте этот URL и установите его как `FRONTEND_URL`
- Или настройте custom domain

### 3. Убедитесь что DATABASE_URL правильный

DATABASE_URL должен выглядеть примерно так:
```
postgresql://postgres:PASSWORD@hostname.railway.internal:5432/railway
```

Важно добавить параметры подключения:
```
postgresql://postgres:PASSWORD@hostname.railway.internal:5432/railway?schema=public&connect_timeout=30&pool_timeout=30&connection_limit=10
```

### 4. Запустите Prisma миграции

После настройки переменных окружения:

1. В Railway перейдите в ваш сервис
2. Откройте **Deployments** → последний деплой → **View Logs**
3. Вам нужно будет выполнить миграции. Добавьте в `package.json`:

```json
"scripts": {
  "build": "npm run build:backend && npm run migrate && npm run build:public && npm run build:crm",
  "migrate": "cd backend && npx prisma generate && npx prisma migrate deploy"
}
```

### 5. Перезапустите деплой

1. Сделайте коммит изменений:
```bash
git add .
git commit -m "Configure Railway deployment with Caddy and environment variables"
git push
```

2. Railway автоматически пересоберет и задеплоит

### 6. Проверьте логи

После деплоя проверьте логи в Railway:
- Должны увидеть "Starting backend API..."
- "Backend is ready!"
- "Starting Caddy web server..."

---

## Структура проекта после исправлений:

```
ilialox/
├── Caddyfile              # Конфигурация Caddy для роутинга
├── start.sh               # Скрипт запуска backend + Caddy
├── railway.toml           # Конфигурация Railway
├── package.json           # Обновлен build скрипт
├── backend/               # Express API
│   ├── src/
│   └── prisma/
├── public-site/           # Лендинг (Vite + React)
│   └── dist/              # Built files
├── crm/                   # CRM система (Vite + React)
│   └── dist/              # Built files
└── RAILWAY_SETUP.md       # Этот файл
```

---

## Роутинг в production:

- `https://your-app.railway.app/` → Public site (landing)
- `https://your-app.railway.app/crm` → CRM application
- `https://your-app.railway.app/api/*` → Backend API

---

## Troubleshooting:

### Ошибка "Application failed to respond"
- Проверьте что все environment variables установлены
- Проверьте логи: может быть ошибка подключения к БД
- Убедитесь что `DATABASE_URL` правильный

### Ошибка с базой данных
- Запустите миграции: `cd backend && npx prisma migrate deploy`
- Проверьте что PostgreSQL сервис запущен на Railway

### Frontend показывает ошибки API
- Убедитесь что `VITE_API_URL=/api` (не localhost!)
- Проверьте что backend запустился (смотрите логи)

### Backend не запускается
- Проверьте что установлены все зависимости
- Проверьте логи на наличие ошибок
- Убедитесь что `JWT_SECRET` установлен

---

## Контрольный список:

- [ ] PostgreSQL база создана на Railway
- [ ] Все environment variables установлены
- [ ] `VITE_API_URL=/api` (НЕ localhost!)
- [ ] `FRONTEND_URL` указывает на ваш Railway URL
- [ ] `JWT_SECRET` минимум 32 символа
- [ ] Prisma миграции запущены
- [ ] Код закоммичен и запушен
- [ ] Проверили логи деплоя
- [ ] Приложение отвечает на запросы
