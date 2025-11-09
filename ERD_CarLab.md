# ERD диаграмма информационной системы "Car Lab"

## Диаграмма сущностей и связей (Entity-Relationship Diagram)

```mermaid
erDiagram
    USERS ||--o{ REQUEST_STATUS_HISTORY : "изменяет статус"
    CLIENTS ||--o{ VEHICLES : "владеет"
    CLIENTS ||--o{ SERVICE_REQUESTS : "создает"
    VEHICLES ||--o{ SERVICE_REQUESTS : "обслуживается"
    SERVICE_REQUESTS ||--o{ REQUEST_WORKS : "содержит"
    SERVICE_REQUESTS ||--o{ REQUEST_STATUS_HISTORY : "имеет историю"

    USERS {
        uuid id PK
        string email UK "Уникальный email"
        string password_hash "Хэш пароля"
        string full_name "ФИО сотрудника"
        string role "Роль (admin, master)"
        timestamp created_at "Дата создания"
    }

    CLIENTS {
        uuid id PK
        string first_name "Имя"
        string last_name "Фамилия"
        string phone "Телефон"
        string email "Email (опционально)"
        timestamp created_at "Дата регистрации"
    }

    VEHICLES {
        uuid id PK
        uuid client_id FK "Владелец"
        string brand "Марка"
        string model "Модель"
        int year "Год выпуска"
        string vin "VIN-номер"
        string license_plate "Госномер"
        timestamp created_at "Дата добавления"
    }

    SERVICE_REQUESTS {
        uuid id PK
        string request_number UK "Номер заявки"
        string tracking_token UK "Токен отслеживания"
        uuid client_id FK "Клиент"
        uuid vehicle_id FK "Автомобиль"
        string description "Описание проблемы"
        string status "Статус (new, in_progress, completed, etc.)"
        string assigned_master "Назначенный мастер"
        int progress_percentage "Процент выполнения"
        decimal total_amount "Общая стоимость"
        string payment_status "Статус оплаты (paid, unpaid)"
        timestamp estimated_completion "Планируемая дата завершения"
        timestamp created_at "Дата создания"
        timestamp updated_at "Дата обновления"
    }

    REQUEST_WORKS {
        uuid id PK
        uuid request_id FK "Заявка"
        string work_name "Название работы"
        decimal quantity "Количество"
        decimal unit_price "Цена за единицу"
        decimal total_price "Общая стоимость"
        timestamp created_at "Дата добавления"
    }

    REQUEST_STATUS_HISTORY {
        uuid id PK
        uuid request_id FK "Заявка"
        string old_status "Старый статус"
        string new_status "Новый статус"
        uuid changed_by FK "Кто изменил"
        timestamp created_at "Дата изменения"
    }
```

## Описание связей

### 1. CLIENTS → VEHICLES (Один ко многим)
- Один клиент может владеть несколькими автомобилями
- Каждый автомобиль принадлежит одному клиенту
- **Связь**: `VEHICLES.client_id → CLIENTS.id`

### 2. CLIENTS → SERVICE_REQUESTS (Один ко многим)
- Один клиент может создать множество заявок на обслуживание
- Каждая заявка связана с одним клиентом
- **Связь**: `SERVICE_REQUESTS.client_id → CLIENTS.id`

### 3. VEHICLES → SERVICE_REQUESTS (Один ко многим)
- Один автомобиль может иметь множество заявок на обслуживание
- Каждая заявка относится к одному автомобилю
- **Связь**: `SERVICE_REQUESTS.vehicle_id → VEHICLES.id`

### 4. SERVICE_REQUESTS → REQUEST_WORKS (Один ко многим)
- Одна заявка может содержать множество выполняемых работ
- Каждая работа относится к одной заявке
- **Связь**: `REQUEST_WORKS.request_id → SERVICE_REQUESTS.id`
- **Каскадное удаление**: При удалении заявки удаляются все связанные работы

### 5. SERVICE_REQUESTS → REQUEST_STATUS_HISTORY (Один ко многим)
- Одна заявка имеет историю изменений статуса
- Каждая запись истории относится к одной заявке
- **Связь**: `REQUEST_STATUS_HISTORY.request_id → SERVICE_REQUESTS.id`
- **Каскадное удаление**: При удалении заявки удаляется история

### 6. USERS → REQUEST_STATUS_HISTORY (Один ко многим)
- Один пользователь может изменять статусы множества заявок
- Каждое изменение статуса может быть связано с пользователем (опционально)
- **Связь**: `REQUEST_STATUS_HISTORY.changed_by → USERS.id`

## Ключевые поля

### Первичные ключи (PK)
Все таблицы используют UUID в качестве первичного ключа (`id`)

### Внешние ключи (FK)
- `VEHICLES.client_id` → `CLIENTS.id`
- `SERVICE_REQUESTS.client_id` → `CLIENTS.id`
- `SERVICE_REQUESTS.vehicle_id` → `VEHICLES.id`
- `REQUEST_WORKS.request_id` → `SERVICE_REQUESTS.id`
- `REQUEST_STATUS_HISTORY.request_id` → `SERVICE_REQUESTS.id`
- `REQUEST_STATUS_HISTORY.changed_by` → `USERS.id`

### Уникальные ключи (UK)
- `USERS.email` - уникальный email пользователя
- `SERVICE_REQUESTS.request_number` - уникальный номер заявки
- `SERVICE_REQUESTS.tracking_token` - уникальный токен для отслеживания

## Индексы

Для оптимизации производительности созданы индексы на следующих полях:

**VEHICLES**:
- `client_id` - для быстрого поиска автомобилей клиента

**SERVICE_REQUESTS**:
- `status` - для фильтрации по статусу
- `request_number` - для быстрого поиска по номеру
- `tracking_token` - для отслеживания заявки клиентом
- `client_id` - для поиска заявок клиента

**REQUEST_WORKS**:
- `request_id` - для поиска работ по заявке

**REQUEST_STATUS_HISTORY**:
- `request_id` - для получения истории заявки

## Типы данных

### UUID (Универсальный уникальный идентификатор)
Используется для всех первичных ключей, обеспечивает уникальность записей

### Decimal
Используется для денежных полей:
- `total_amount` - Decimal(10, 2) - до 99,999,999.99
- `unit_price`, `total_price` - Decimal(10, 2)
- `quantity` - Decimal(10, 2) - поддержка дробных значений

### Timestamp
Все временные метки включают дату и время с точностью до миллисекунд

### String
Текстовые поля различной длины для хранения имен, описаний, статусов

## Особенности реализации

1. **Автоматическая генерация**:
   - UUID для всех записей
   - Timestamps для `created_at`
   - Автоматическое обновление `updated_at`

2. **Каскадные операции**:
   - Удаление заявки удаляет все связанные работы и историю
   - Связи клиент-автомобиль и клиент-заявка сохраняются

3. **Мягкие связи**:
   - `assigned_master` - строка (имя мастера), не FK
   - `changed_by` - опциональная связь с пользователем

4. **Бизнес-логика**:
   - Автоматический расчет `total_amount` из суммы `REQUEST_WORKS`
   - Отслеживание прогресса через `progress_percentage`
   - История изменений статусов для аудита
