# API Documentation - CRM Автосервиса

## Общая информация

**Base URL:** `https://api.autoservice.com/api/v1`
**Протокол:** REST API
**Формат:** JSON
**Аутентификация:** JWT Bearer Token
**Кодировка:** UTF-8

---

## 🔐 Аутентификация

### POST `/auth/register`
Регистрация нового пользователя (только для админов).

**Request:**
```json
{
  "email": "master@example.com",
  "password": "SecurePassword123!",
  "first_name": "Иван",
  "last_name": "Петров",
  "middle_name": "Сергеевич",
  "phone": "+79991234567",
  "role_id": "uuid",
  "specializations": ["ГРМ", "АКПП"],
  "hire_date": "2023-01-15"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "master@example.com",
      "first_name": "Иван",
      "last_name": "Петров",
      "role": {
        "id": "uuid",
        "name": "Механик"
      }
    }
  }
}
```

---

### POST `/auth/login`
Вход в систему.

**Request:**
```json
{
  "email": "master@example.com",
  "password": "SecurePassword123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "user": {
      "id": "uuid",
      "email": "master@example.com",
      "first_name": "Иван",
      "last_name": "Петров",
      "avatar_url": "https://cdn.example.com/avatars/user.jpg",
      "role": {
        "id": "uuid",
        "name": "Механик",
        "permissions": {
          "requests": { "create": true, "read": true, "update": true }
        }
      }
    }
  }
}
```

---

### POST `/auth/refresh`
Обновление access token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "access_token": "new_access_token",
    "expires_in": 3600
  }
}
```

---

### POST `/auth/logout`
Выход из системы.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "message": "Выход выполнен успешно"
}
```

---

## 👥 Клиенты (Clients)

### GET `/clients`
Получить список всех клиентов с фильтрацией.

**Query Parameters:**
- `page` (number, default: 1) - Страница
- `limit` (number, default: 20) - Количество на странице
- `search` (string) - Поиск по имени/телефону/email/ИНН
- `type` (string) - Тип: individual, legal, ip, self_employed
- `status` (string) - Статус: active, inactive, blacklist

**Request:**
```
GET /clients?page=1&limit=20&type=individual&search=Иванов
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "type": "individual",
        "first_name": "Иван",
        "last_name": "Иванов",
        "middle_name": "Петрович",
        "phone": "+79991234567",
        "email": "ivanov@example.com",
        "status": "active",
        "vehicles_count": 2,
        "requests_count": 5,
        "total_spent": 45000.00,
        "created_at": "2023-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "total_pages": 8
    }
  }
}
```

---

### GET `/clients/:id`
Получить детальную информацию о клиенте.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "individual",
    "first_name": "Иван",
    "last_name": "Иванов",
    "middle_name": "Петрович",
    "phone": "+79991234567",
    "email": "ivanov@example.com",
    "status": "active",
    "default_payment_method": "card",
    "source": "website",
    "notes": "Постоянный клиент",
    "vehicles": [
      {
        "id": "uuid",
        "brand": "Toyota",
        "model": "Camry",
        "year": 2018,
        "license_plate": "А123БВ777"
      }
    ],
    "recent_requests": [
      {
        "id": "uuid",
        "request_number": "294894",
        "status": "completed",
        "total_amount": 12000.00,
        "created_at": "2023-10-01T09:00:00Z"
      }
    ],
    "statistics": {
      "total_requests": 8,
      "total_spent": 56000.00,
      "average_check": 7000.00,
      "last_visit": "2023-10-15T14:30:00Z"
    },
    "created_at": "2023-01-15T10:30:00Z",
    "updated_at": "2023-10-15T14:30:00Z"
  }
}
```

---

### POST `/clients`
Создать нового клиента.

**Request (Physical Person):**
```json
{
  "type": "individual",
  "first_name": "Сергей",
  "last_name": "Петров",
  "middle_name": "Иванович",
  "phone": "+79991234568",
  "email": "petrov@example.com",
  "default_payment_method": "cash",
  "source": "phone",
  "notes": "Рекомендация от Иванова"
}
```

**Request (Legal Entity):**
```json
{
  "type": "legal",
  "company_name": "ООО \"ТрансСервис\"",
  "inn": "7701234567",
  "kpp": "770101001",
  "ogrn": "1234567890123",
  "legal_address": "г. Москва, ул. Пушкина, д. 15",
  "actual_address": "г. Москва, ул. Ленина, д. 20",
  "phone": "+74951234567",
  "email": "info@trans.ru",
  "bank_name": "ПАО Сбербанк",
  "bik": "044525225",
  "checking_account": "40702810123456789012",
  "correspondent_account": "30101810400000000225",
  "is_vat_payer": true,
  "default_payment_method": "bank_transfer"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "individual",
    "first_name": "Сергей",
    "last_name": "Петров",
    "phone": "+79991234568",
    "email": "petrov@example.com",
    "status": "active",
    "created_at": "2023-11-07T12:00:00Z"
  }
}
```

---

### PUT `/clients/:id`
Обновить информацию о клиенте.

**Request:**
```json
{
  "phone": "+79991234569",
  "email": "new_email@example.com",
  "notes": "Обновлённая заметка"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "phone": "+79991234569",
    "email": "new_email@example.com",
    "updated_at": "2023-11-07T12:30:00Z"
  }
}
```

---

### DELETE `/clients/:id`
Удалить клиента (soft delete).

**Response 200:**
```json
{
  "success": true,
  "message": "Клиент успешно удалён"
}
```

---

## 🚗 Автомобили (Vehicles)

### GET `/vehicles`
Получить список автомобилей.

**Query Parameters:**
- `page`, `limit`
- `client_id` (uuid) - Фильтр по клиенту
- `search` (string) - Поиск по VIN/гос.номеру/марке
- `brand` (string) - Марка автомобиля
- `status` (string) - active, in_service, archived

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "client": {
          "id": "uuid",
          "full_name": "Смирнова Наталья Викторовна"
        },
        "brand": "Hyundai",
        "model": "Solaris",
        "year": 2019,
        "license_plate": "М456ОТ199",
        "vin": "KMHC81BDXKU123456",
        "status": "active",
        "last_service_date": "2023-09-15",
        "mileage": 87500
      }
    ],
    "pagination": { ... }
  }
}
```

---

### GET `/vehicles/:id`
Детальная информация об автомобиле.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "client": {
      "id": "uuid",
      "first_name": "Наталья",
      "last_name": "Смирнова",
      "phone": "+79991234570"
    },
    "brand": "Hyundai",
    "model": "Solaris",
    "year": 2019,
    "vin": "KMHC81BDXKU123456",
    "license_plate": "М456ОТ199",
    "sts_number": "77АХ123456",
    "pts_number": "77УТ654321",
    "mileage": 87500,
    "color": "Серебристый",
    "body_type": "sedan",
    "fuel_type": "gasoline",
    "transmission": "automatic",
    "engine_volume": 1.6,
    "warranty_until": "2024-04-18",
    "status": "active",
    "last_service_date": "2023-09-15",
    "photos": [
      {
        "id": "uuid",
        "url": "https://cdn.example.com/vehicles/photo1.jpg"
      }
    ],
    "documents": [
      {
        "id": "uuid",
        "category": "sts",
        "file_name": "СТС.pdf",
        "file_size": 1254780,
        "uploaded_at": "2023-05-10T10:00:00Z"
      }
    ],
    "service_history": [
      {
        "id": "uuid",
        "request_number": "593423",
        "date": "2023-09-15",
        "service": "Диагностика подвески",
        "amount": 3500.00
      }
    ],
    "created_at": "2023-04-18T09:00:00Z",
    "updated_at": "2023-09-15T14:00:00Z"
  }
}
```

---

### POST `/vehicles`
Добавить новый автомобиль.

**Request:**
```json
{
  "client_id": "uuid",
  "brand": "LADA",
  "model": "Vesta",
  "year": 2020,
  "vin": "XTA21940SK1234567",
  "license_plate": "О789ВН750",
  "sts_number": "77АА111222",
  "mileage": 45000,
  "color": "Белый",
  "body_type": "sedan",
  "fuel_type": "gasoline",
  "transmission": "manual",
  "engine_volume": 1.8
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "brand": "LADA",
    "model": "Vesta",
    "license_plate": "О789ВН750",
    "created_at": "2023-11-07T13:00:00Z"
  }
}
```

---

### PUT `/vehicles/:id`
Обновить информацию об автомобиле.

---

### DELETE `/vehicles/:id`
Удалить автомобиль.

---

## 📋 Заявки (Service Requests)

### GET `/requests`
Получить список заявок с фильтрацией.

**Query Parameters:**
- `page`, `limit`
- `status` (array) - Массив статусов: ['new', 'in_progress']
- `client_id` (uuid)
- `vehicle_id` (uuid)
- `master_id` (uuid)
- `manager_id` (uuid)
- `date_from` (date) - С даты
- `date_to` (date) - До даты
- `amount_from` (number)
- `amount_to` (number)
- `priority` (string) - low, normal, high, urgent
- `is_urgent` (boolean)
- `search` (string) - Поиск по номеру заявки/клиенту/гос.номеру

**Request:**
```
GET /requests?page=1&limit=20&status[]=new&status[]=in_progress&date_from=2023-10-01&date_to=2023-10-31
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "request_number": "294894",
        "status": "new",
        "priority": "normal",
        "client": {
          "id": "uuid",
          "full_name": "Иванов Артём Сергеевич",
          "phone": "+79991234567"
        },
        "vehicle": {
          "id": "uuid",
          "brand": "Toyota",
          "model": "Corolla",
          "license_plate": "А123ВС777"
        },
        "assigned_master": {
          "id": "uuid",
          "full_name": "Алексеев Д."
        },
        "scheduled_date": "2023-10-03T08:00:00Z",
        "total_amount": 1200.00,
        "progress_percentage": 0,
        "is_urgent": false,
        "created_at": "2023-10-02T14:30:00Z"
      }
    ],
    "pagination": { ... },
    "summary": {
      "total_amount": 125000.00,
      "count_by_status": {
        "new": 15,
        "in_progress": 8,
        "completed": 42
      }
    }
  }
}
```

---

### GET `/requests/:id`
Детальная информация о заявке.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "request_number": "294894",
    "status": "in_progress",
    "priority": "normal",
    "progress_percentage": 30,

    "client": {
      "id": "uuid",
      "type": "individual",
      "full_name": "Иванов Артём Сергеевич",
      "phone": "+79991234567",
      "email": "ivanov@example.com"
    },

    "vehicle": {
      "id": "uuid",
      "brand": "Toyota",
      "model": "Corolla",
      "year": 2018,
      "license_plate": "А123ВС777",
      "vin": "JTDBR32E500123456",
      "mileage": 95000,
      "color": "Серебристый"
    },

    "assigned_master": {
      "id": "uuid",
      "full_name": "Алексеев Дмитрий Иванович",
      "phone": "+79991234580",
      "specializations": ["ГРМ", "Диагностика"]
    },

    "manager": {
      "id": "uuid",
      "full_name": "Петрова Анна Сергеевна"
    },

    "description": "Бесплатная диагностика двигателя",
    "client_complaint": "Странные звуки при запуске двигателя",
    "diagnostics_result": "Необходима замена ремня ГРМ",

    "scheduled_date": "2023-10-03T08:00:00Z",
    "created_at": "2023-10-02T14:30:00Z",
    "updated_at": "2023-10-03T10:15:00Z",

    "works": [
      {
        "id": "uuid",
        "name": "Диагностика двигателя",
        "status": "completed",
        "price": 0.00,
        "quantity": 1,
        "total_price": 0.00,
        "master": {
          "id": "uuid",
          "full_name": "Алексеев Д."
        },
        "started_at": "2023-10-03T08:30:00Z",
        "completed_at": "2023-10-03T10:00:00Z"
      },
      {
        "id": "uuid",
        "name": "Замена ремня ГРМ",
        "status": "in_progress",
        "price": 3500.00,
        "quantity": 1,
        "total_price": 3500.00,
        "estimated_duration": 180
      }
    ],

    "spare_parts": [
      {
        "id": "uuid",
        "spare_part": {
          "id": "uuid",
          "name": "Ремень ГРМ Toyota",
          "article": "13568-0D010"
        },
        "quantity": 1,
        "price": 2800.00,
        "total_price": 2800.00
      }
    ],

    "total_amount": 6300.00,
    "discount_amount": 0.00,
    "final_amount": 6300.00,
    "payment_status": "unpaid",

    "payments": [],

    "documents": [
      {
        "id": "uuid",
        "category": "photo",
        "file_name": "engine_photo.jpg",
        "url": "https://cdn.example.com/requests/photo.jpg",
        "uploaded_at": "2023-10-03T09:00:00Z"
      }
    ],

    "comments": [
      {
        "id": "uuid",
        "content": "Клиент в курсе, устранить не планирует.",
        "author": {
          "id": "uuid",
          "full_name": "Семёнова Е."
        },
        "created_at": "2023-10-03T09:15:00Z"
      }
    ],

    "status_history": [
      {
        "old_status": null,
        "new_status": "new",
        "changed_by": {
          "full_name": "Система"
        },
        "created_at": "2023-10-02T14:30:00Z"
      },
      {
        "old_status": "new",
        "new_status": "in_progress",
        "changed_by": {
          "full_name": "Алексеев Д."
        },
        "comment": "Начал работу",
        "created_at": "2023-10-03T08:30:00Z"
      }
    ],

    "is_urgent": false,
    "is_warranty": false,
    "source": "website"
  }
}
```

---

### POST `/requests`
Создать новую заявку.

**Request:**
```json
{
  "client_id": "uuid",
  "vehicle_id": "uuid",
  "scheduled_date": "2023-11-10T09:00:00Z",
  "description": "Замена масла и фильтров",
  "client_complaint": "Подошло время ТО",
  "priority": "normal",
  "is_urgent": false,
  "source": "phone",
  "assigned_master_id": "uuid"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "request_number": "294895",
    "status": "new",
    "scheduled_date": "2023-11-10T09:00:00Z",
    "created_at": "2023-11-07T15:00:00Z"
  }
}
```

---

### POST `/requests/public`
**Публичная заявка с сайта** (без авторизации).

**Request:**
```json
{
  "client": {
    "first_name": "Сергей",
    "last_name": "Иванов",
    "phone": "+79991234590",
    "email": "sergey@example.com"
  },
  "vehicle": {
    "brand": "Volkswagen",
    "model": "Polo",
    "year": 2017,
    "license_plate": "В555ХХ777"
  },
  "description": "Замена колодок и тормозных дисков",
  "preferred_date": "2023-11-12"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Заявка принята! Мы свяжемся с вами в течение 15 минут.",
  "data": {
    "request_number": "294896",
    "tracking_url": "https://autoservice.com/track/abc123def456",
    "access_token": "abc123def456"
  }
}
```

---

### GET `/requests/track/:token`
**Публичное отслеживание заявки** (без авторизации).

**Response 200:**
```json
{
  "success": true,
  "data": {
    "request_number": "294896",
    "status": "in_progress",
    "progress_percentage": 45,
    "vehicle": {
      "brand": "Volkswagen",
      "model": "Polo",
      "license_plate": "В555ХХ777"
    },
    "scheduled_date": "2023-11-12T10:00:00Z",
    "estimated_completion": "2023-11-12T14:00:00Z",
    "current_work": "Замена тормозных колодок",
    "total_amount": 8900.00,
    "payment_status": "unpaid",
    "created_at": "2023-11-10T16:30:00Z",
    "updated_at": "2023-11-12T11:20:00Z"
  }
}
```

---

### PUT `/requests/:id`
Обновить заявку.

**Request:**
```json
{
  "status": "in_progress",
  "assigned_master_id": "uuid",
  "diagnostics_result": "Износ тормозных колодок 80%",
  "priority": "high"
}
```

---

### PATCH `/requests/:id/status`
Изменить только статус заявки.

**Request:**
```json
{
  "status": "completed",
  "comment": "Работы завершены, автомобиль готов к выдаче"
}
```

---

### DELETE `/requests/:id`
Отменить заявку.

**Request:**
```json
{
  "reason": "Клиент отказался от ремонта"
}
```

---

## 🔧 Работы (Service Works)

### POST `/requests/:requestId/works`
Добавить работу к заявке.

**Request:**
```json
{
  "name": "Замена масла двигателя",
  "description": "Замена масла + фильтр",
  "price": 1500.00,
  "quantity": 1,
  "master_id": "uuid",
  "estimated_duration": 60
}
```

---

### PUT `/requests/:requestId/works/:workId`
Обновить работу.

---

### PATCH `/requests/:requestId/works/:workId/status`
Изменить статус работы (pending → in_progress → completed).

---

### DELETE `/requests/:requestId/works/:workId`
Удалить работу.

---

## 🔩 Запчасти (Spare Parts)

### GET `/spare-parts`
Получить каталог запчастей.

**Query Parameters:**
- `search` - Поиск по названию/артикулу
- `category` - Категория
- `brand` - Производитель
- `in_stock` (boolean) - Только в наличии

---

### POST `/spare-parts`
Добавить запчасть в каталог.

---

### POST `/requests/:requestId/spare-parts`
Добавить запчасть в заявку.

**Request:**
```json
{
  "spare_part_id": "uuid",
  "quantity": 2,
  "price": 850.00
}
```

---

## 💳 Платежи (Payments)

### GET `/payments`
Список всех платежей.

---

### POST `/requests/:requestId/payments`
Добавить платёж к заявке.

**Request:**
```json
{
  "amount": 5000.00,
  "payment_method": "card",
  "transaction_id": "pay_123456"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 5000.00,
    "payment_method": "card",
    "status": "completed",
    "payment_date": "2023-11-07T16:00:00Z"
  }
}
```

---

## 📄 Документы (Documents)

### POST `/documents/upload`
Загрузить документ.

**Request (multipart/form-data):**
```
file: [файл]
entity_type: "request"
entity_id: "uuid"
category: "photo"
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "file_name": "photo1.jpg",
    "file_path": "https://cdn.example.com/documents/xyz.jpg",
    "file_size": 2048576,
    "category": "photo",
    "uploaded_at": "2023-11-07T16:30:00Z"
  }
}
```

---

### GET `/documents/:id`
Скачать документ.

---

### DELETE `/documents/:id`
Удалить документ.

---

## 💬 Комментарии (Comments)

### POST `/comments`
Добавить комментарий.

**Request:**
```json
{
  "entity_type": "request",
  "entity_id": "uuid",
  "content": "Клиент просил перезвонить после 18:00",
  "type": "note"
}
```

---

## 👨‍🔧 Мастера (Masters)

### GET `/masters`
Список всех мастеров.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "full_name": "Тимофеев Алексей Сергеевич",
        "phone": "+79991234585",
        "email": "timofeev@example.com",
        "avatar_url": "https://cdn.example.com/avatars/master.jpg",
        "specializations": ["ГРМ", "АКПП", "Электроника", "ДВС", "Кузовной ремонт"],
        "rating": 4.8,
        "status": "active",
        "hire_date": "2019-07-21",
        "statistics": {
          "work_experience_years": 6,
          "total_requests": 1345,
          "current_requests": 0,
          "completed_requests": 1345,
          "cancelled_requests": 3,
          "average_check": 12500.00,
          "requests_this_month": 8
        },
        "last_active_at": "2023-11-07T15:45:00Z"
      }
    ]
  }
}
```

---

### GET `/masters/:id`
Профиль мастера.

---

### GET `/masters/:id/requests`
История заявок мастера.

---

### GET `/masters/:id/schedule`
Расписание мастера.

---

## 🔔 Уведомления (Notifications)

### GET `/notifications`
Получить уведомления текущего пользователя.

**Query Parameters:**
- `is_read` (boolean) - Только прочитанные/непрочитанные

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Новое сообщение в заявке №2234",
        "message": "Клиент: Петрова А.Н. — «Подтвердите, пожалуйста, время записи»",
        "type": "new_message",
        "is_read": false,
        "link_type": "request",
        "link_id": "uuid",
        "created_at": "2023-11-07T09:12:00Z"
      }
    ],
    "unread_count": 23
  }
}
```

---

### PATCH `/notifications/:id/read`
Отметить как прочитанное.

---

### POST `/notifications/read-all`
Отметить все как прочитанные.

---

## 📊 Аналитика (Analytics)

### GET `/analytics/dashboard`
Данные для главной панели.

**Query Parameters:**
- `date_from` (date)
- `date_to` (date)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 482300.00,
      "change_percentage": 7.6,
      "by_date": [
        { "date": "2023-11-01", "amount": 45000.00 },
        { "date": "2023-11-02", "amount": 52000.00 }
      ]
    },
    "requests": {
      "total": 160,
      "new": 37,
      "in_progress": 15,
      "completed": 98,
      "cancelled": 10
    },
    "clients": {
      "new_clients": 37,
      "returning_clients": 123
    },
    "average_check": 3014.37,
    "peak_hours": {
      "monday": [9, 10, 14, 15],
      "tuesday": [10, 11, 16]
    },
    "work_types": [
      { "name": "Замена масла", "count": 167, "percentage": 39 },
      { "name": "Диагностика", "count": 73, "percentage": 17 },
      { "name": "Ремонт подвески", "count": 120, "percentage": 28 }
    ]
  }
}
```

---

### GET `/analytics/masters`
Статистика по мастерам.

---

### GET `/analytics/revenue`
Детальная аналитика выручки.

---

## ⚙️ Настройки (Settings)

### GET `/settings`
Получить все настройки системы.

---

### PUT `/settings/:key`
Обновить настройку.

---

## 👤 Пользователи (Users)

### GET `/users`
Список пользователей (сотрудников).

---

### GET `/users/:id`
Профиль пользователя.

---

### PUT `/users/:id`
Обновить пользователя.

---

### PUT `/users/:id/avatar`
Загрузить аватар.

---

## 🎭 Роли (Roles)

### GET `/roles`
Список всех ролей.

---

### POST `/roles`
Создать новую роль.

**Request:**
```json
{
  "name": "Диспетчер",
  "description": "Принимает звонки и создаёт заявки",
  "permissions": {
    "requests": { "create": true, "read": true, "update": false, "delete": false },
    "clients": { "create": true, "read": true, "update": true, "delete": false }
  }
}
```

---

## 🔌 Интеграции (Integrations)

### GET `/integrations`
Список всех интеграций.

---

### POST `/integrations/:name/enable`
Включить интеграцию.

**Request:**
```json
{
  "settings": {
    "api_key": "your_api_key",
    "bot_token": "telegram_bot_token"
  }
}
```

---

### POST `/integrations/:name/disable`
Отключить интеграцию.

---

## 🌐 WebSocket Events

**Connection:** `wss://api.autoservice.com/ws`

**Auth:** Query parameter `?token=jwt_token`

### События от сервера:

```json
// Новое уведомление
{
  "event": "notification:new",
  "data": {
    "id": "uuid",
    "title": "Новая заявка №12345",
    "message": "Создана новая заявка от клиента Иванов И.И."
  }
}

// Обновление статуса заявки
{
  "event": "request:status_updated",
  "data": {
    "request_id": "uuid",
    "old_status": "new",
    "new_status": "in_progress"
  }
}

// Новый комментарий
{
  "event": "comment:new",
  "data": {
    "entity_type": "request",
    "entity_id": "uuid",
    "comment": { ... }
  }
}
```

---

## 🚨 Коды ошибок

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Ошибка валидации данных",
    "details": [
      {
        "field": "phone",
        "message": "Некорректный формат телефона"
      }
    ]
  }
}
```

**Коды:**
- `400` - Validation Error
- `401` - Unauthorized (нет токена)
- `403` - Forbidden (недостаточно прав)
- `404` - Not Found
- `409` - Conflict (дубликат)
- `500` - Internal Server Error

---

## 📝 Rate Limiting

- **Лимит:** 1000 запросов в час на IP
- **Header:** `X-RateLimit-Remaining: 995`

---

Готово! API документация завершена.
