# 2-Day Prototype Plan
## Ilialox Auto Service CRM - Rapid Prototype

**Timeline:** 48 hours
**Goal:** Demonstrate core functionality with working prototype
**Approach:** Functional MVP with simplified features, some mock data

---

## 🎯 Prototype Scope

### ✅ What Will Be FULLY FUNCTIONAL
1. **Public Request Submission** (Landing Page Form)
   - Client fills form with contact info
   - Vehicle details input
   - Problem description
   - Generates unique request number
   - Shows tracking link

2. **Request Tracking Page** (Public)
   - Client can track their request by number or link
   - See current status and progress
   - View assigned master and estimated completion

3. **CRM Authentication**
   - Simple login (email/password)
   - JWT token-based auth
   - Protected routes

4. **CRM: Requests List**
   - View all service requests
   - Filter by status (New, In Progress, Completed)
   - Search by request number or client name
   - See key info: client, vehicle, status, amount

5. **CRM: Request Details**
   - Full request information
   - Update status (dropdown)
   - Assign master (dropdown with predefined list)
   - Add works/services with prices
   - Update progress percentage
   - Calculate total amount

6. **CRM: Simple Dashboard**
   - Total requests count
   - Requests by status (cards)
   - Today's revenue
   - Pending requests count

### 🎨 What Will Be MOCKED/SIMPLIFIED
1. **Masters** - Predefined list in code (no CRUD)
2. **Services Catalog** - Predefined list of common services
3. **Client Management** - Clients created automatically when request submitted
4. **Vehicle Database** - Vehicles created automatically with request
5. **Payment Tracking** - Simple paid/unpaid flag only
6. **Notifications** - Not implemented in prototype
7. **Analytics Charts** - Static numbers only, no graphs
8. **File Uploads** - Not implemented
9. **User Management** - Single admin user only
10. **Integrations** - Not implemented

### ❌ What Will NOT Be Included
- Spare parts inventory
- Document management
- Master schedules
- Advanced analytics
- Real-time notifications
- WhatsApp/Telegram/SMS integrations
- Email notifications
- Multi-user roles
- Settings pages
- Audit logs

---

## 🏗️ Technical Stack (Optimized for Speed)

### Backend
- **Runtime:** Node.js 20+ with Express.js
- **Database:** PostgreSQL (simplified schema - 6 tables only)
- **ORM:** Prisma (rapid schema definition)
- **Auth:** jsonwebtoken for JWT
- **Validation:** express-validator
- **CORS:** cors middleware

### Frontend
- **Framework:** React 18 with Vite (already set up)
- **Routing:** React Router v6
- **UI Library:** TailwindCSS + Radix UI (already in project)
- **State:** React Context API (no Redux to save time)
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod validation

### Deployment (Optional)
- **Local only** for 2-day demo
- Docker setup for easy sharing (if time permits)

---

## 📊 Simplified Database Schema (6 Tables)

```sql
-- 1. Users (CRM access)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clients (auto-created from requests)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Vehicles (auto-created from requests)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER,
  vin VARCHAR(17),
  license_plate VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Service Requests (main entity)
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number VARCHAR(20) UNIQUE NOT NULL,
  tracking_token VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id),
  vehicle_id UUID REFERENCES vehicles(id),
  description TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'new',
  assigned_master VARCHAR(100),
  progress_percentage INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  estimated_completion TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Request Works (services added to request)
CREATE TABLE request_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  work_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Request Status History (for tracking)
CREATE TABLE request_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  old_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,
  changed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_requests_status ON service_requests(status);
CREATE INDEX idx_requests_number ON service_requests(request_number);
CREATE INDEX idx_requests_token ON service_requests(tracking_token);
CREATE INDEX idx_requests_client ON service_requests(client_id);
CREATE INDEX idx_vehicles_client ON vehicles(client_id);
```

---

## 📁 Project Structure (Simplified)

```
ilialox/
├── backend/                    # NEW - API Server
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # Prisma client
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verification
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js      # POST /api/auth/login
│   │   │   ├── public.routes.js    # POST /api/public/requests, GET /api/public/track/:token
│   │   │   └── requests.routes.js  # CRUD for requests (protected)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── publicController.js
│   │   │   └── requestsController.js
│   │   ├── services/
│   │   │   └── requestService.js   # Business logic
│   │   ├── utils/
│   │   │   ├── generateRequestNumber.js
│   │   │   └── generateToken.js
│   │   └── server.js           # Express app entry
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── .env
│   └── package.json
│
├── src/                        # EXISTING - Frontend (will be modified)
│   ├── pages/
│   │   ├── Landing.tsx         # Existing landing (add request form)
│   │   ├── TrackRequest.tsx    # NEW - Public tracking page
│   │   ├── Login.tsx           # NEW - CRM login
│   │   ├── Dashboard.tsx       # NEW - CRM dashboard
│   │   ├── RequestsList.tsx    # NEW - CRM requests list
│   │   └── RequestDetails.tsx  # NEW - CRM request details
│   ├── components/
│   │   ├── landing/            # Existing components
│   │   ├── crm/
│   │   │   ├── Sidebar.tsx     # CRM navigation
│   │   │   ├── RequestCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── WorkItemForm.tsx
│   │   └── shared/
│   │       ├── Input.tsx
│   │       ├── Button.tsx      # Existing
│   │       └── Select.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx     # Auth state management
│   ├── services/
│   │   └── api.ts              # Axios instance + API calls
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── utils/
│   │   └── constants.ts        # Mock data (masters, services)
│   └── App.tsx                 # Router setup
│
└── package.json                # Update with new dependencies
```

---

## 🚀 Implementation Timeline

### **DAY 1 (12-14 hours)** - Backend + Infrastructure

#### Hour 1-2: Backend Setup
- [ ] Create `backend/` folder structure
- [ ] Initialize Node.js project: `npm init -y`
- [ ] Install dependencies:
  ```bash
  npm install express cors dotenv prisma @prisma/client jsonwebtoken bcryptjs express-validator
  npm install -D nodemon @types/node
  ```
- [ ] Setup `.env` file with DATABASE_URL and JWT_SECRET
- [ ] Create `server.js` with basic Express app

#### Hour 3-4: Database Setup
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Define schema in `prisma/schema.prisma` (6 models)
- [ ] Create PostgreSQL database
- [ ] Run migration: `npx prisma migrate dev --name init`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Seed one admin user (email: admin@ilialox.com, password: admin123)

#### Hour 5-6: Authentication API
- [ ] Create auth middleware (`middleware/auth.js`)
- [ ] Build auth controller with login endpoint
- [ ] Create auth routes: `POST /api/auth/login`
- [ ] Test with Postman/Thunder Client

#### Hour 7-9: Public API (Landing Form)
- [ ] Build public controller:
  - `POST /api/public/requests` - Create request (creates client + vehicle + request)
  - `GET /api/public/track/:token` - Get request by tracking token
- [ ] Implement request number generator (6 random digits)
- [ ] Implement tracking token generator (UUID)
- [ ] Test public endpoints

#### Hour 10-12: Protected CRM API
- [ ] Build requests controller:
  - `GET /api/requests` - List all requests (with filters)
  - `GET /api/requests/:id` - Get request details
  - `PATCH /api/requests/:id/status` - Update status
  - `PATCH /api/requests/:id/assign` - Assign master
  - `POST /api/requests/:id/works` - Add work item
  - `PATCH /api/requests/:id/progress` - Update progress
- [ ] Implement business logic in `requestService.js`
- [ ] Add validation with express-validator
- [ ] Test all endpoints

#### Hour 13-14: Dashboard API
- [ ] Build stats endpoint: `GET /api/dashboard/stats`
- [ ] Calculate:
  - Total requests count
  - Requests by status (new, in_progress, completed, cancelled)
  - Today's total revenue
  - Pending requests count
- [ ] Test dashboard endpoint

**End of Day 1:** Backend fully functional and tested

---

### **DAY 2 (12-14 hours)** - Frontend Development

#### Hour 1-2: Frontend Setup
- [ ] Install new dependencies in root:
  ```bash
  npm install react-router-dom axios react-hook-form zod @hookform/resolvers
  npm install date-fns
  ```
- [ ] Create folder structure (`pages/`, `contexts/`, `services/`)
- [ ] Setup API service with Axios (`services/api.ts`)
- [ ] Create TypeScript types (`types/index.ts`)
- [ ] Setup React Router in `App.tsx`

#### Hour 3-4: Authentication
- [ ] Create `AuthContext.tsx` with login/logout/token management
- [ ] Build Login page (`pages/Login.tsx`)
- [ ] Create protected route wrapper
- [ ] Implement token persistence in localStorage
- [ ] Test login flow

#### Hour 5-6: Landing Page Request Form
- [ ] Modify existing `Landing.tsx` or create new section
- [ ] Build request submission form:
  - Client info: first name, last name, phone, email
  - Vehicle info: brand, model, year, license plate
  - Description: textarea for problem description
- [ ] Add form validation
- [ ] Show success modal with request number and tracking link
- [ ] Test form submission

#### Hour 7-8: Public Tracking Page
- [ ] Create `TrackRequest.tsx` page
- [ ] Input field for request number or parse token from URL
- [ ] Fetch request data from API
- [ ] Display request information:
  - Status badge with color coding
  - Progress bar (percentage)
  - Client and vehicle details
  - Assigned master
  - List of works/services
  - Total amount
  - Estimated completion date
- [ ] Test tracking page

#### Hour 9-10: CRM Dashboard
- [ ] Create `Dashboard.tsx` with stats cards:
  - Total Requests
  - New Requests
  - In Progress
  - Completed Today
  - Today's Revenue
  - Pending Requests
- [ ] Create CRM layout with sidebar navigation
- [ ] Add simple header with user info and logout button
- [ ] Test dashboard

#### Hour 11-12: CRM Requests List
- [ ] Create `RequestsList.tsx` page
- [ ] Build request card component showing:
  - Request number
  - Client name
  - Vehicle (brand/model)
  - Status badge
  - Total amount
  - Created date
- [ ] Add filters: All / New / In Progress / Completed
- [ ] Add search by request number
- [ ] Make cards clickable (navigate to details)
- [ ] Test list with multiple requests

#### Hour 13-14: CRM Request Details
- [ ] Create `RequestDetails.tsx` page
- [ ] Display full request information
- [ ] Add update forms:
  - Status dropdown (New, In Progress, Completed, Cancelled)
  - Master assignment dropdown (predefined list)
  - Progress slider (0-100%)
  - Add work item form (name, quantity, price)
- [ ] Show works table with subtotals
- [ ] Display total amount (auto-calculated)
- [ ] Payment status toggle (Paid/Unpaid)
- [ ] Status history timeline
- [ ] Test all update operations

**End of Day 2:** Working prototype complete

---

## 🎨 Mock Data / Constants

**Predefined Masters List** (hardcoded in `utils/constants.ts`):
```typescript
export const MASTERS = [
  { id: '1', name: 'Иван Петров', specialization: 'Механик' },
  { id: '2', name: 'Алексей Сидоров', specialization: 'Электрик' },
  { id: '3', name: 'Дмитрий Кузнецов', specialization: 'Диагност' },
  { id: '4', name: 'Сергей Иванов', specialization: 'Кузовной ремонт' },
];
```

**Predefined Services List** (for quick work addition):
```typescript
export const COMMON_SERVICES = [
  { name: 'Замена масла', defaultPrice: 1500 },
  { name: 'Диагностика двигателя', defaultPrice: 2000 },
  { name: 'Замена тормозных колодок', defaultPrice: 3500 },
  { name: 'Развал-схождение', defaultPrice: 2500 },
  { name: 'Замена свечей', defaultPrice: 1200 },
  { name: 'Замена фильтров', defaultPrice: 800 },
];
```

**Request Statuses**:
```typescript
export const REQUEST_STATUSES = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const STATUS_LABELS = {
  new: 'Новый',
  in_progress: 'В работе',
  completed: 'Завершен',
  cancelled: 'Отменен',
};

export const STATUS_COLORS = {
  new: 'blue',
  in_progress: 'yellow',
  completed: 'green',
  cancelled: 'red',
};
```

---

## 🧪 Testing Checklist

### Public Flow
- [ ] Submit request from landing page
- [ ] Receive request number and tracking link
- [ ] Open tracking page and see request status
- [ ] Verify all data is displayed correctly

### CRM Flow
- [ ] Login with admin credentials
- [ ] View dashboard with statistics
- [ ] See all requests in list
- [ ] Filter requests by status
- [ ] Search request by number
- [ ] Open request details
- [ ] Update request status
- [ ] Assign master to request
- [ ] Add work items with prices
- [ ] See total amount auto-calculated
- [ ] Update progress percentage
- [ ] View status history
- [ ] Mark payment as paid
- [ ] Verify changes persist after refresh

### Edge Cases
- [ ] Try to access CRM without login (should redirect)
- [ ] Try invalid tracking token (should show error)
- [ ] Submit request with missing required fields (should show validation)
- [ ] Add work with zero or negative price (should prevent)

---

## 📦 Deliverables

### For Demo/Presentation
1. **Live working application**
   - Public landing page with request form
   - Public tracking page
   - CRM admin panel with login

2. **Sample data** (seed script)
   - 1 admin user
   - 10 sample requests in various statuses
   - Assigned masters
   - Works/services added
   - Some completed, some in progress

3. **Quick start guide** (README)
   - How to install dependencies
   - How to setup database
   - How to run backend and frontend
   - Login credentials
   - Sample request numbers for tracking

### What Works
✅ End-to-end request flow (submission → tracking → management)
✅ Authentication and protected routes
✅ Request CRUD operations
✅ Status management
✅ Work items and pricing
✅ Basic dashboard statistics
✅ Responsive UI with TailwindCSS

### What's Simplified/Mocked
⚠️ Masters are hardcoded list (no CRUD)
⚠️ Services catalog is predefined
⚠️ No file uploads
⚠️ No real notifications
⚠️ No integrations
⚠️ Single admin user only
⚠️ No advanced analytics

---

## 🚀 Next Steps After Prototype

Once prototype is approved, prioritize for full development:

1. **Sprint 1** (2 weeks): Infrastructure + Multi-user auth
2. **Sprint 2** (2 weeks): Full client management + vehicle database
3. **Sprint 3** (2 weeks): Complete masters module with schedules
4. **Sprint 4** (2 weeks): Spare parts inventory
5. **Sprint 5** (2 weeks): Payment tracking and invoicing
6. **Sprint 6** (2 weeks): Document management
7. **Sprint 7** (2 weeks): Analytics dashboard
8. **Sprint 8** (2 weeks): Notifications system
9. **Sprint 9** (2 weeks): Telegram/WhatsApp integration
10. **Sprint 10+**: Settings, roles, audit logs, etc.

Refer to `DEVELOPMENT_PLAN.md` for full roadmap.

---

## 💡 Development Tips

### For Backend
- Use `nodemon` for auto-restart during development
- Test each endpoint with Postman before frontend integration
- Log all errors clearly for debugging
- Use transactions for operations that modify multiple tables

### For Frontend
- Start with simple components, add polish later
- Use React DevTools to debug state issues
- Keep API calls centralized in `services/api.ts`
- Use loading states for better UX during API calls
- Add error boundaries for graceful error handling

### Time-Saving Tricks
- Copy-paste and adapt existing Radix UI components from landing
- Use TailwindCSS utility classes instead of writing custom CSS
- Keep validation simple (required fields only)
- Skip animations in prototype (add later)
- Use browser localStorage for auth token (no refresh token complexity)
- Don't over-engineer - working code > perfect code for prototype

---

## 📝 Notes

This plan is aggressive but achievable for an experienced full-stack developer working focused 12-14 hour days. The key is to:

1. **Don't over-engineer** - Build minimum viable features
2. **Skip perfection** - Working prototype > polished app
3. **Use existing code** - Leverage current landing page components
4. **Mock when possible** - Hardcode lists instead of building CRUD
5. **Test frequently** - Catch issues early
6. **Stay focused** - Ignore features not in scope

The result will be a functional prototype that demonstrates the core value proposition of the CRM system and can serve as a foundation for full development.

**Good luck! 🚀**
