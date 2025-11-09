# Структура проекта CRM Автосервиса

## Обзор архитектуры

**Архитектура:** Монорепозиторий (Monorepo)
**Структура:** Frontend + Backend в одном репозитории
**Управление:** Turborepo / Nx (опционально)

---

## 📁 Корневая структура

```
autoservice-crm/
├── apps/
│   ├── frontend/           # React приложение (CRM)
│   ├── landing/            # Landing page (публичная часть)
│   └── backend/            # Node.js API сервер
│
├── packages/
│   ├── ui/                 # Shared UI компоненты
│   ├── types/              # Shared TypeScript типы
│   ├── utils/              # Утилиты и хелперы
│   └── config/             # Конфигурации (ESLint, Prettier, TS)
│
├── docs/                   # Документация проекта
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   └── DEPLOYMENT.md
│
├── scripts/                # Скрипты для автоматизации
│   ├── seed-database.ts
│   ├── generate-migrations.ts
│   └── deploy.sh
│
├── .github/                # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-staging.yml
│       └── deploy-production.yml
│
├── docker/                 # Docker конфигурации
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── .env.example
├── .gitignore
├── package.json
├── turbo.json
└── README.md
```

---

## 🎨 Frontend (CRM) - `/apps/frontend`

```
apps/frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── assets/
│       ├── images/
│       └── fonts/
│
├── src/
│   ├── app/                        # App Router (Next.js 14+) или основная структура
│   │   ├── (auth)/                 # Группа маршрутов для авторизации
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/            # Группа маршрутов для CRM
│   │   │   ├── layout.tsx          # Основной Layout с Sidebar
│   │   │   ├── page.tsx            # Главная страница (Дашборд)
│   │   │   │
│   │   │   ├── requests/           # Модуль "Заявки"
│   │   │   │   ├── page.tsx        # Список заявок
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx    # Детальная карточка заявки
│   │   │   │   └── new/
│   │   │   │       └── page.tsx    # Создание заявки
│   │   │   │
│   │   │   ├── clients/            # Модуль "Клиенты"
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── vehicles/           # Модуль "Автомобили"
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── masters/            # Модуль "Мастера"
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── analytics/          # Модуль "Аналитика"
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── documents/          # Модуль "Документы"
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── payments/           # Модуль "Платежи"
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── settings/           # Модуль "Настройки"
│   │   │       ├── page.tsx
│   │   │       ├── users/
│   │   │       │   └── page.tsx
│   │   │       ├── roles/
│   │   │       │   └── page.tsx
│   │   │       └── integrations/
│   │   │           └── page.tsx
│   │   │
│   │   ├── api/                    # API Routes (Next.js)
│   │   │   └── webhooks/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx              # Root Layout
│   │   └── not-found.tsx
│   │
│   ├── components/                 # Компоненты приложения
│   │   ├── requests/
│   │   │   ├── RequestCard.tsx
│   │   │   ├── RequestTable.tsx
│   │   │   ├── RequestFilters.tsx
│   │   │   ├── RequestStatusBadge.tsx
│   │   │   └── CreateRequestModal.tsx
│   │   │
│   │   ├── clients/
│   │   │   ├── ClientCard.tsx
│   │   │   ├── ClientTable.tsx
│   │   │   ├── CreateClientForm.tsx
│   │   │   └── ClientTypeSelector.tsx
│   │   │
│   │   ├── vehicles/
│   │   │   ├── VehicleCard.tsx
│   │   │   ├── VehicleTable.tsx
│   │   │   └── VehicleInfoModal.tsx
│   │   │
│   │   ├── masters/
│   │   │   ├── MasterCard.tsx
│   │   │   ├── MasterProfile.tsx
│   │   │   └── MasterStatistics.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── HeatmapChart.tsx
│   │   │   ├── WorkTypesChart.tsx
│   │   │   └── StatCard.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Notifications.tsx
│   │   │   └── UserMenu.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Drawer.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Spinner.tsx
│   │   │
│   │   └── forms/
│   │       ├── FormField.tsx
│   │       ├── FormError.tsx
│   │       └── FormWrapper.tsx
│   │
│   ├── features/                   # Feature-based modules
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── authApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   ├── stores/
│   │   │   │   └── authStore.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── requests/
│   │   │   ├── api/
│   │   │   │   └── requestsApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useRequests.ts
│   │   │   │   ├── useRequestDetails.ts
│   │   │   │   └── useCreateRequest.ts
│   │   │   ├── stores/
│   │   │   │   └── requestsStore.ts
│   │   │   └── types/
│   │   │       └── requests.types.ts
│   │   │
│   │   ├── clients/
│   │   │   └── ...
│   │   │
│   │   ├── vehicles/
│   │   │   └── ...
│   │   │
│   │   ├── masters/
│   │   │   └── ...
│   │   │
│   │   └── analytics/
│   │       └── ...
│   │
│   ├── lib/                        # Библиотеки и утилиты
│   │   ├── api/
│   │   │   ├── apiClient.ts        # Axios / Fetch wrapper
│   │   │   ├── endpoints.ts        # API endpoints константы
│   │   │   └── interceptors.ts     # Request/Response interceptors
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useFilters.ts
│   │   │   └── useWebSocket.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.ts       # Форматирование дат, чисел, телефонов
│   │   │   ├── validators.ts       # Валидация форм
│   │   │   ├── constants.ts        # Константы приложения
│   │   │   └── helpers.ts          # Вспомогательные функции
│   │   │
│   │   └── providers/
│   │       ├── QueryProvider.tsx   # React Query
│   │       ├── ThemeProvider.tsx   # Темы
│   │       └── AuthProvider.tsx    # Авторизация
│   │
│   ├── stores/                     # Глобальные stores (Zustand / Redux)
│   │   ├── authStore.ts
│   │   ├── notificationsStore.ts
│   │   ├── settingsStore.ts
│   │   └── index.ts
│   │
│   ├── types/                      # TypeScript типы
│   │   ├── api.types.ts
│   │   ├── models.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts
│   │
│   ├── styles/                     # Стили
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   │
│   ├── config/                     # Конфигурации
│   │   ├── routes.ts               # Маршруты приложения
│   │   ├── permissions.ts          # Права доступа
│   │   └── env.ts                  # Env переменные
│   │
│   └── main.tsx                    # Entry point
│
├── .env.local
├── .env.production
├── next.config.js                  # Next.js config
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🌐 Landing Page - `/apps/landing`

```
apps/landing/
├── public/
│   └── assets/
│       └── images/
│
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── About.tsx
│   │   ├── Gallery.tsx
│   │   ├── Reviews.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── sections/
│   │   └── ...
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🔧 Backend - `/apps/backend`

```
apps/backend/
├── prisma/
│   ├── schema.prisma               # Prisma схема БД
│   ├── migrations/                 # Миграции
│   └── seed.ts                     # Seed данные для разработки
│
├── src/
│   ├── modules/                    # Модульная структура
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validation.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── guards/
│   │   │       ├── auth.guard.ts
│   │   │       └── roles.guard.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── users.validation.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── clients/
│   │   │   ├── clients.controller.ts
│   │   │   ├── clients.service.ts
│   │   │   ├── clients.routes.ts
│   │   │   ├── clients.validation.ts
│   │   │   └── dto/
│   │   │       ├── create-client.dto.ts
│   │   │       └── update-client.dto.ts
│   │   │
│   │   ├── vehicles/
│   │   │   └── ...
│   │   │
│   │   ├── requests/
│   │   │   ├── requests.controller.ts
│   │   │   ├── requests.service.ts
│   │   │   ├── requests.routes.ts
│   │   │   ├── requests.validation.ts
│   │   │   ├── dto/
│   │   │   └── public/              # Публичные endpoints
│   │   │       ├── public-requests.controller.ts
│   │   │       └── public-requests.service.ts
│   │   │
│   │   ├── works/
│   │   │   └── ...
│   │   │
│   │   ├── spare-parts/
│   │   │   └── ...
│   │   │
│   │   ├── payments/
│   │   │   └── ...
│   │   │
│   │   ├── documents/
│   │   │   ├── documents.controller.ts
│   │   │   ├── documents.service.ts
│   │   │   └── upload/
│   │   │       └── upload.middleware.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   └── notifications.gateway.ts  # WebSocket
│   │   │
│   │   ├── analytics/
│   │   │   └── ...
│   │   │
│   │   ├── settings/
│   │   │   └── ...
│   │   │
│   │   ├── integrations/
│   │   │   ├── telegram/
│   │   │   │   ├── telegram.service.ts
│   │   │   │   └── telegram.bot.ts
│   │   │   ├── whatsapp/
│   │   │   │   └── whatsapp.service.ts
│   │   │   ├── sms/
│   │   │   │   └── sms.service.ts
│   │   │   └── email/
│   │   │       └── email.service.ts
│   │   │
│   │   └── roles/
│   │       └── ...
│   │
│   ├── common/                     # Общие модули
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── logger.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   └── cors.middleware.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── permissions.guard.ts
│   │   │   └── roles.guard.ts
│   │   │
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── permissions.decorator.ts
│   │   │
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   │
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   │
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   ├── config/                     # Конфигурация
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   ├── s3.config.ts
│   │   └── index.ts
│   │
│   ├── database/                   # Database
│   │   ├── prisma.service.ts
│   │   └── redis.service.ts
│   │
│   ├── utils/                      # Утилиты
│   │   ├── password.util.ts        # Hashing
│   │   ├── jwt.util.ts             # JWT генерация/валидация
│   │   ├── logger.util.ts          # Winston logger
│   │   ├── date.util.ts
│   │   └── validators.util.ts
│   │
│   ├── types/                      # TypeScript типы
│   │   ├── express.d.ts            # Расширение Express types
│   │   ├── models.types.ts
│   │   └── common.types.ts
│   │
│   ├── jobs/                       # Background jobs (Bull)
│   │   ├── email-queue.job.ts
│   │   ├── sms-queue.job.ts
│   │   └── notification-queue.job.ts
│   │
│   ├── app.ts                      # Express app initialization
│   ├── server.ts                   # HTTP server
│   └── main.ts                     # Entry point
│
├── tests/                          # Тесты
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env.development
├── .env.production
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📦 Shared Packages - `/packages`

### `/packages/ui`
Переиспользуемые UI компоненты (на основе Radix UI).

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── Button.test.tsx
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Modal/
│   │   └── ...
│   │
│   ├── index.ts
│   └── styles.css
│
├── package.json
└── tsconfig.json
```

### `/packages/types`
Общие TypeScript типы для Frontend и Backend.

```
packages/types/
├── src/
│   ├── api/
│   │   ├── requests.types.ts
│   │   ├── clients.types.ts
│   │   └── ...
│   │
│   ├── models/
│   │   ├── user.types.ts
│   │   ├── client.types.ts
│   │   └── ...
│   │
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

### `/packages/utils`
Утилиты для Frontend и Backend.

```
packages/utils/
├── src/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

---

## 🐳 Docker Setup

### `/docker/docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: autoservice_crm
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ../apps/backend
      dockerfile: ../../docker/Dockerfile.backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://admin:password@postgres:5432/autoservice_crm
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ../apps/frontend
      dockerfile: ../../docker/Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

---

## 🚀 Scripts - `/scripts`

### `seed-database.ts`
Заполнение базы тестовыми данными.

### `generate-prisma-client.ts`
Генерация Prisma Client.

### `backup-database.sh`
Резервное копирование БД.

---

## 📝 Environment Variables

### Backend `.env`
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/autoservice_crm"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="1h"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="development"

# File Upload (AWS S3)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="autoservice-files"
AWS_REGION="us-east-1"

# Integrations
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
WHATSAPP_API_KEY="your-whatsapp-api-key"
SMS_API_KEY="your-sms-api-key"
SENDGRID_API_KEY="your-sendgrid-api-key"

# URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:4000"
```

### Frontend `.env`
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_WS_URL="ws://localhost:4000"
```

---

## 🎯 Принципы организации кода

1. **Модульность** - каждый модуль изолирован
2. **Feature-based structure** - группировка по функциям
3. **Clean Architecture** - разделение слоёв (Controller → Service → Repository)
4. **DRY** - переиспользование через shared packages
5. **Type Safety** - строгая типизация TypeScript
6. **Testing** - unit, integration, e2e тесты

---

Структура готова! Переходим к спринтам.
