# База данных CRM системы автосервиса

## Обзор архитектуры

**СУБД:** PostgreSQL 15+
**ORM:** Prisma
**Общее количество таблиц:** 25+

---

## 📋 Структура таблиц

### 1. **users** - Пользователи системы
Сотрудники автосервиса с доступом к CRM.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  phone VARCHAR(20) UNIQUE,
  avatar_url TEXT,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, on_vacation
  specializations TEXT[], -- ['ГРМ', 'АКПП', 'Электроника']
  rating DECIMAL(3,2) DEFAULT 0.00, -- 0.00 - 5.00
  hire_date DATE,
  last_active_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP -- soft delete
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);
```

---

### 2. **roles** - Роли пользователей
Система ролей с гибкими правами доступа.

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL, -- Администратор, Менеджер, Механик
  description TEXT,
  permissions JSONB NOT NULL, -- { "заявки": { "create": true, "read": true, ... } }
  is_system BOOLEAN DEFAULT false, -- системные роли нельзя удалить
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_roles_name ON roles(name);
```

**Пример permissions JSON:**
```json
{
  "requests": {
    "create": true,
    "read": true,
    "update": true,
    "delete": false,
    "view_all": true
  },
  "clients": {
    "create": true,
    "read": true,
    "update": true,
    "delete": false
  },
  "vehicles": {
    "create": true,
    "read": true,
    "update": true,
    "delete": false
  },
  "masters": {
    "read": true,
    "update": false
  },
  "payments": {
    "read": true,
    "create": false,
    "update": false
  },
  "documents": {
    "read": true,
    "upload": true,
    "delete": false
  },
  "reports": {
    "read": false
  },
  "settings": {
    "read": false,
    "update": false
  }
}
```

---

### 3. **clients** - Клиенты
Физические и юридические лица.

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL, -- individual, legal, ip, self_employed

  -- Физ.лицо
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  middle_name VARCHAR(100),

  -- Юр.лицо
  company_name VARCHAR(255),
  inn VARCHAR(12),
  kpp VARCHAR(9),
  ogrn VARCHAR(15),
  legal_address TEXT,
  actual_address TEXT,
  bank_name VARCHAR(255),
  bik VARCHAR(9),
  checking_account VARCHAR(20),
  correspondent_account VARCHAR(20),
  is_vat_payer BOOLEAN DEFAULT false,

  -- Общие поля
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  default_payment_method VARCHAR(20) DEFAULT 'cash', -- cash, card, sbp, transfer

  -- Метаданные
  source VARCHAR(50), -- website, phone, walk_in, recommendation
  notes TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, blacklist

  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_clients_type ON clients(type);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_inn ON clients(inn);
CREATE INDEX idx_clients_status ON clients(status);
```

---

### 4. **vehicles** - Автомобили

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Основная информация
  brand VARCHAR(100) NOT NULL, -- Toyota, Hyundai, LADA
  model VARCHAR(100) NOT NULL, -- Corolla, Solaris, Vesta
  year INTEGER NOT NULL,
  vin VARCHAR(17) UNIQUE,
  license_plate VARCHAR(20) UNIQUE NOT NULL, -- гос.номер
  sts_number VARCHAR(20), -- номер СТС
  pts_number VARCHAR(20), -- номер ПТС

  -- Технические характеристики
  mileage INTEGER, -- пробег в км
  color VARCHAR(50),
  body_type VARCHAR(50), -- sedan, hatchback, suv, truck
  fuel_type VARCHAR(50), -- gasoline, diesel, electric, hybrid
  transmission VARCHAR(50), -- manual, automatic, cvt, robot
  engine_volume DECIMAL(3,1), -- 1.6, 2.0

  -- Гарантия
  warranty_until DATE,

  -- Статус
  status VARCHAR(20) DEFAULT 'active', -- active, in_service, archived
  last_service_date DATE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_vehicles_client_id ON vehicles(client_id);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicles_brand_model ON vehicles(brand, model);
```

---

### 5. **service_requests** - Заявки на обслуживание

```sql
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_number VARCHAR(20) UNIQUE NOT NULL, -- 294894, 593423

  -- Связи
  client_id UUID NOT NULL REFERENCES clients(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  assigned_master_id UUID REFERENCES users(id),
  manager_id UUID REFERENCES users(id),

  -- Даты и время
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  scheduled_date TIMESTAMP, -- дата приёма
  completed_at TIMESTAMP,

  -- Статус
  status VARCHAR(30) DEFAULT 'new', -- new, in_progress, waiting_parts, waiting_client, diagnostics, ready, completed, cancelled, overdue
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent

  -- Описание
  description TEXT,
  client_complaint TEXT, -- что не так с автомобилем
  diagnostics_result TEXT,

  -- Финансы
  total_amount DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  final_amount DECIMAL(10,2) DEFAULT 0.00,
  payment_status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, partially_paid, paid

  -- Прогресс
  progress_percentage INTEGER DEFAULT 0, -- 0-100

  -- Дополнительно
  is_urgent BOOLEAN DEFAULT false,
  is_warranty BOOLEAN DEFAULT false,
  source VARCHAR(50), -- website, phone, walk_in

  deleted_at TIMESTAMP
);

CREATE INDEX idx_requests_number ON service_requests(request_number);
CREATE INDEX idx_requests_client_id ON service_requests(client_id);
CREATE INDEX idx_requests_vehicle_id ON service_requests(vehicle_id);
CREATE INDEX idx_requests_master_id ON service_requests(assigned_master_id);
CREATE INDEX idx_requests_status ON service_requests(status);
CREATE INDEX idx_requests_scheduled_date ON service_requests(scheduled_date);
CREATE INDEX idx_requests_created_at ON service_requests(created_at);
```

---

### 6. **service_works** - Работы по заявке

```sql
CREATE TABLE service_works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,

  -- Информация о работе
  name VARCHAR(255) NOT NULL, -- Ремонт передней подвески, Замена масла
  description TEXT,

  -- Финансы
  price DECIMAL(10,2) NOT NULL,
  quantity DECIMAL(8,2) DEFAULT 1.00,
  total_price DECIMAL(10,2) NOT NULL,

  -- Исполнитель
  master_id UUID REFERENCES users(id),

  -- Статус
  status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, cancelled

  -- Время
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_duration INTEGER, -- минуты

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_works_request_id ON service_works(request_id);
CREATE INDEX idx_works_master_id ON service_works(master_id);
CREATE INDEX idx_works_status ON service_works(status);
```

---

### 7. **spare_parts** - Запчасти (каталог)

```sql
CREATE TABLE spare_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Основная информация
  article VARCHAR(100) UNIQUE NOT NULL, -- артикул
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Категория
  category VARCHAR(100), -- Двигатель, Подвеска, Электрика
  brand VARCHAR(100), -- производитель запчасти

  -- Финансы
  purchase_price DECIMAL(10,2),
  selling_price DECIMAL(10,2) NOT NULL,

  -- Склад
  quantity_in_stock INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 0, -- минимальный остаток для уведомления
  unit VARCHAR(20) DEFAULT 'шт', -- шт, л, кг

  -- Поставщик
  supplier_name VARCHAR(255),
  supplier_phone VARCHAR(20),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_parts_article ON spare_parts(article);
CREATE INDEX idx_parts_category ON spare_parts(category);
CREATE INDEX idx_parts_brand ON spare_parts(brand);
```

---

### 8. **request_spare_parts** - Запчасти использованные в заявке

```sql
CREATE TABLE request_spare_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
  work_id UUID REFERENCES service_works(id), -- к какой работе относится

  quantity DECIMAL(8,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL, -- цена продажи
  total_price DECIMAL(10,2) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_req_parts_request_id ON request_spare_parts(request_id);
CREATE INDEX idx_req_parts_part_id ON request_spare_parts(spare_part_id);
```

---

### 9. **payments** - Платежи

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id),
  client_id UUID NOT NULL REFERENCES clients(id),

  -- Сумма
  amount DECIMAL(10,2) NOT NULL,

  -- Способ оплаты
  payment_method VARCHAR(30) NOT NULL, -- cash, card, sbp, bank_transfer

  -- Статус
  status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed, refunded

  -- Информация о транзакции
  transaction_id VARCHAR(100),

  -- Кто принял платёж
  received_by UUID REFERENCES users(id),

  -- Даты
  payment_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_request_id ON payments(request_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
```

---

### 10. **documents** - Документы

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- К чему привязан документ
  entity_type VARCHAR(30) NOT NULL, -- request, vehicle, client
  entity_id UUID NOT NULL,

  -- Информация о файле
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL, -- путь к файлу (S3, локальный)
  file_type VARCHAR(50), -- application/pdf, image/jpeg
  file_size INTEGER, -- в байтах

  -- Категория
  category VARCHAR(50), -- sts, pts, act, photo, invoice

  -- Кто загрузил
  uploaded_by UUID REFERENCES users(id),

  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_category ON documents(category);
```

---

### 11. **comments** - Комментарии и пометки

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- К чему привязан комментарий
  entity_type VARCHAR(30) NOT NULL, -- request, vehicle, client
  entity_id UUID NOT NULL,

  -- Контент
  content TEXT NOT NULL,

  -- Автор
  author_id UUID NOT NULL REFERENCES users(id),

  -- Тип
  type VARCHAR(20) DEFAULT 'comment', -- comment, note, system

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

---

### 12. **notifications** - Уведомления

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Содержание
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  -- Тип
  type VARCHAR(50) NOT NULL, -- new_request, payment_received, assignment, document_signed, integration_error

  -- Ссылка
  link_type VARCHAR(30), -- request, client, vehicle
  link_id UUID,

  -- Статус
  is_read BOOLEAN DEFAULT false,

  -- Действия (если есть кнопки)
  action_buttons JSONB, -- [{"label": "Подтвердить", "action": "confirm"}]

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

---

### 13. **activity_log** - Журнал активности

```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),

  -- Действие
  action VARCHAR(50) NOT NULL, -- create, update, delete, view, login
  entity_type VARCHAR(30) NOT NULL, -- request, client, vehicle, user
  entity_id UUID,

  -- Детали
  description TEXT,
  changes JSONB, -- что изменилось

  -- Технические данные
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_created_at ON activity_log(created_at);
```

---

### 14. **request_status_history** - История изменения статусов заявок

```sql
CREATE TABLE request_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,

  -- Статус
  old_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,

  -- Кто изменил
  changed_by UUID REFERENCES users(id),

  -- Комментарий
  comment TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_status_history_request_id ON request_status_history(request_id);
CREATE INDEX idx_status_history_created_at ON request_status_history(created_at);
```

---

### 15. **integrations** - Настройки интеграций

```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Название
  name VARCHAR(100) UNIQUE NOT NULL, -- telegram, whatsapp, google_calendar
  display_name VARCHAR(100) NOT NULL, -- Telegram, WhatsApp Business API

  -- Статус
  is_enabled BOOLEAN DEFAULT false,

  -- Настройки (токены, ключи API)
  settings JSONB, -- {"api_key": "...", "bot_token": "..."}

  -- Последняя синхронизация
  last_sync_at TIMESTAMP,
  last_error TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_integrations_name ON integrations(name);
```

---

### 16. **schedules** - Расписание работы мастеров

```sql
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  master_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Дата
  date DATE NOT NULL,

  -- Время работы
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  -- Тип дня
  type VARCHAR(20) DEFAULT 'work', -- work, vacation, sick_leave, day_off

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_schedules_master_id ON schedules(master_id);
CREATE INDEX idx_schedules_date ON schedules(date);
CREATE UNIQUE INDEX idx_schedules_master_date ON schedules(master_id, date);
```

---

### 17. **time_slots** - Временные слоты для записи

```sql
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  master_id UUID REFERENCES users(id),

  -- Дата и время
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  -- Статус
  is_available BOOLEAN DEFAULT true,
  request_id UUID REFERENCES service_requests(id),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_time_slots_master_id ON time_slots(master_id);
CREATE INDEX idx_time_slots_date ON time_slots(date);
CREATE INDEX idx_time_slots_available ON time_slots(is_available);
```

---

### 18. **sms_log** - История отправки SMS

```sql
CREATE TABLE sms_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Получатель
  phone VARCHAR(20) NOT NULL,
  client_id UUID REFERENCES clients(id),

  -- Сообщение
  message TEXT NOT NULL,

  -- Статус
  status VARCHAR(20) DEFAULT 'sent', -- sent, delivered, failed

  -- Провайдер
  provider VARCHAR(50), -- twilio, smsc
  provider_message_id VARCHAR(100),

  -- Ошибки
  error_message TEXT,

  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sms_log_phone ON sms_log(phone);
CREATE INDEX idx_sms_log_client_id ON sms_log(client_id);
CREATE INDEX idx_sms_log_sent_at ON sms_log(sent_at);
```

---

### 19. **email_log** - История отправки Email

```sql
CREATE TABLE email_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Получатель
  email VARCHAR(255) NOT NULL,
  client_id UUID REFERENCES clients(id),

  -- Письмо
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,

  -- Статус
  status VARCHAR(20) DEFAULT 'sent', -- sent, delivered, bounced, failed

  -- Провайдер
  provider VARCHAR(50), -- sendgrid, mailgun
  provider_message_id VARCHAR(100),

  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_log_email ON email_log(email);
CREATE INDEX idx_email_log_client_id ON email_log(client_id);
CREATE INDEX idx_email_log_sent_at ON email_log(sent_at);
```

---

### 20. **settings** - Настройки системы

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Ключ-значение
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,

  -- Описание
  description TEXT,

  -- Категория
  category VARCHAR(50), -- general, finance, notifications, integrations

  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);
```

**Примеры настроек:**
```json
{
  "company_name": "Автосервис ИЛЬЯ ЛОХ",
  "company_phone": "+7 (999) 888-11-11",
  "company_address": "г. Мегион, ул. Примерная, д. 123",
  "working_hours": {
    "start": "08:00",
    "end": "20:00",
    "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  },
  "currency": "RUB",
  "timezone": "Asia/Yekaterinburg",
  "vat_rate": 20,
  "default_discount": 0,
  "sms_enabled": true,
  "email_enabled": true,
  "notification_channels": ["sms", "email", "telegram"]
}
```

---

### 21. **service_catalog** - Каталог услуг

```sql
CREATE TABLE service_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Название
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Категория
  category VARCHAR(100) NOT NULL, -- Ремонт двигателя, Диагностика, ТО

  -- Цена
  base_price DECIMAL(10,2),

  -- Время выполнения
  estimated_duration INTEGER, -- минуты

  -- Статус
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_service_catalog_category ON service_catalog(category);
CREATE INDEX idx_service_catalog_active ON service_catalog(is_active);
```

---

### 22. **reviews** - Отзывы клиентов

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id),
  request_id UUID REFERENCES service_requests(id),

  -- Оценка
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),

  -- Текст отзыва
  comment TEXT,

  -- Статус
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected

  -- Публикация
  is_published BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_client_id ON reviews(client_id);
CREATE INDEX idx_reviews_request_id ON reviews(request_id);
CREATE INDEX idx_reviews_published ON reviews(is_published);
```

---

### 23. **templates** - Шаблоны сообщений

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Название и тип
  name VARCHAR(100) NOT NULL,
  type VARCHAR(30) NOT NULL, -- sms, email, notification

  -- Контент
  subject VARCHAR(255), -- для email
  body TEXT NOT NULL,

  -- Переменные
  variables TEXT[], -- ['client_name', 'request_number', 'amount']

  -- Статус
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_templates_active ON templates(is_active);
```

---

### 24. **masters_statistics** - Статистика мастеров (кэш)

```sql
CREATE TABLE masters_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  master_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Статистика
  total_requests INTEGER DEFAULT 0,
  completed_requests INTEGER DEFAULT 0,
  cancelled_requests INTEGER DEFAULT 0,

  total_revenue DECIMAL(12,2) DEFAULT 0.00,
  average_check DECIMAL(10,2) DEFAULT 0.00,

  -- Период
  period VARCHAR(20) DEFAULT 'all_time', -- all_time, month, year
  period_start DATE,
  period_end DATE,

  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_masters_stats_master_id ON masters_statistics(master_id);
```

---

### 25. **public_request_tracking** - Публичное отслеживание заявок

```sql
CREATE TABLE public_request_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID UNIQUE NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,

  -- Токен доступа
  access_token VARCHAR(64) UNIQUE NOT NULL,

  -- Срок действия
  expires_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_public_tracking_token ON public_request_tracking(access_token);
CREATE INDEX idx_public_tracking_request_id ON public_request_tracking(request_id);
```

---

## 🔗 Связи между таблицами (Entity Relationships)

```
clients (1) ----< (N) vehicles
clients (1) ----< (N) service_requests
clients (1) ----< (N) payments
clients (1) ----< (N) reviews

vehicles (1) ----< (N) service_requests
vehicles (1) ----< (N) documents
vehicles (1) ----< (N) comments

service_requests (1) ----< (N) service_works
service_requests (1) ----< (N) request_spare_parts
service_requests (1) ----< (N) payments
service_requests (1) ----< (N) documents
service_requests (1) ----< (N) comments
service_requests (1) ----< (N) request_status_history

users (1) ----< (N) service_requests (as assigned_master)
users (1) ----< (N) service_requests (as manager)
users (1) ----< (N) service_works (as master)
users (1) ----< (N) schedules
users (1) ----< (N) notifications
users (1) ----< (N) activity_log

roles (1) ----< (N) users

spare_parts (1) ----< (N) request_spare_parts
```

---

## 📊 Индексы для оптимизации производительности

Все критические индексы уже указаны в структуре таблиц выше. Основные:

- **Внешние ключи** (FK) - автоматически индексируются
- **Поля поиска** - email, phone, vin, license_plate
- **Статусы** - status во всех таблицах
- **Даты** - created_at, scheduled_date
- **Composite индексы** - entity_type + entity_id

---

## 🔐 Безопасность

1. **Soft Delete** - deleted_at для восстановления данных
2. **Password Hashing** - bcrypt с солью (cost 12)
3. **UUID** - вместо auto-increment для безопасности
4. **JSONB для permissions** - гибкая настройка прав
5. **Activity Log** - аудит всех действий
6. **Row Level Security (RLS)** - на уровне PostgreSQL

---

## 📈 Триггеры и функции

```sql
-- Автоматическое обновление updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Применить ко всем таблицам
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... и т.д. для всех таблиц с updated_at
```

```sql
-- Автоматический расчёт final_amount в заявке
CREATE OR REPLACE FUNCTION calculate_request_final_amount()
RETURNS TRIGGER AS $$
BEGIN
   NEW.final_amount = NEW.total_amount - NEW.discount_amount;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_final_amount BEFORE INSERT OR UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION calculate_request_final_amount();
```

---

## 💾 Резервное копирование

- **Ежедневные бэкапы** - автоматически в 3:00
- **Хранение** - 30 дней
- **Point-in-time recovery** - до 7 дней назад

---

## 🚀 Миграции

Использовать **Prisma Migrate** или **Flyway** для версионирования схемы БД.

---

Схема готова! Переходим к следующему пункту.
