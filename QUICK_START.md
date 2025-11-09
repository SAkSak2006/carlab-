# Quick Start Guide - 2-Day Prototype
## Ilialox Auto Service CRM

Follow these steps to get the prototype running.

---

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ installed and running
- Git installed
- Code editor (VS Code recommended)

---

## Step 1: Database Setup (5 minutes)

1. Create PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE ilialox_crm;
\q
```

2. Note your database connection details:
   - Host: localhost
   - Port: 5432 (default)
   - Database: ilialox_crm
   - User: postgres (or your user)
   - Password: your_password

---

## Step 2: Backend Setup (10 minutes)

1. Create backend folder and navigate:
```bash
mkdir backend
cd backend
```

2. Initialize Node.js project:
```bash
npm init -y
```

3. Install dependencies:
```bash
npm install express cors dotenv prisma @prisma/client jsonwebtoken bcryptjs express-validator
npm install -D nodemon
```

4. Create `.env` file in `backend/` folder:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ilialox_crm"
JWT_SECRET="your-secret-key-change-this-in-production-min-32-chars"
PORT=5000
NODE_ENV=development
```

5. Initialize Prisma:
```bash
npx prisma init
```

6. Copy the Prisma schema (already created in `backend/prisma/schema.prisma`)

7. Run database migration:
```bash
npx prisma migrate dev --name init
```

8. Generate Prisma Client:
```bash
npx prisma generate
```

9. Seed admin user:
```bash
node src/utils/seed.js
```

10. Start backend server:
```bash
npm run dev
```

Backend should now be running on `http://localhost:5000`

---

## Step 3: Frontend Setup (5 minutes)

1. Navigate back to root folder:
```bash
cd ..
```

2. Install new frontend dependencies:
```bash
npm install react-router-dom axios react-hook-form zod @hookform/resolvers date-fns
```

3. Create `.env` file in root folder:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start frontend dev server:
```bash
npm run dev
```

Frontend should now be running on `http://localhost:5173`

---

## Step 4: Test the Application

### Test Public Flow:
1. Open `http://localhost:5173`
2. Scroll to request form
3. Fill in client details, vehicle info, and problem description
4. Submit form
5. Copy the request number and tracking link
6. Open tracking link to see request status

### Test CRM Flow:
1. Navigate to `http://localhost:5173/login`
2. Login with credentials:
   - Email: `admin@ilialox.com`
   - Password: `admin123`
3. View dashboard with statistics
4. Click "Заявки" (Requests) in sidebar
5. See list of all requests
6. Click on a request to see details
7. Update status, assign master, add works
8. Verify changes are saved

---

## Default Admin Credentials

**Email:** admin@ilialox.com
**Password:** admin123

⚠️ Change these credentials after first login in production!

---

## API Endpoints (for testing)

### Public Endpoints
- `POST http://localhost:5000/api/public/requests` - Submit new request
- `GET http://localhost:5000/api/public/track/:token` - Track request

### Auth Endpoints
- `POST http://localhost:5000/api/auth/login` - Login

### Protected Endpoints (require Authorization header)
- `GET http://localhost:5000/api/dashboard/stats` - Dashboard statistics
- `GET http://localhost:5000/api/requests` - List all requests
- `GET http://localhost:5000/api/requests/:id` - Get request details
- `PATCH http://localhost:5000/api/requests/:id/status` - Update status
- `PATCH http://localhost:5000/api/requests/:id/assign` - Assign master
- `POST http://localhost:5000/api/requests/:id/works` - Add work item
- `PATCH http://localhost:5000/api/requests/:id/progress` - Update progress

---

## Project Structure After Setup

```
ilialox/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   └── package.json
├── src/
│   ├── pages/
│   ├── components/
│   ├── contexts/
│   ├── services/
│   └── types/
├── .env
└── package.json
```

---

## Troubleshooting

### Database connection error
- Check if PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Ensure database exists: `psql -U postgres -l`

### Backend not starting
- Check if port 5000 is available: `netstat -ano | findstr :5000`
- Review error messages in console
- Verify all dependencies installed: `npm install`

### Frontend not connecting to backend
- Verify VITE_API_URL in root `.env` file
- Check if backend is running on port 5000
- Check browser console for CORS errors

### Prisma errors
- Regenerate client: `npx prisma generate`
- Reset database: `npx prisma migrate reset` (⚠️ deletes all data)
- Check Prisma schema syntax

### Login not working
- Verify admin user was seeded
- Check JWT_SECRET in backend `.env`
- Clear browser localStorage and cookies

---

## Development Commands

### Backend
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start           # Start production server
npx prisma studio   # Open Prisma Studio (database GUI)
npx prisma migrate dev --name <name>  # Create new migration
```

### Frontend
```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## Next Steps

1. ✅ Get both servers running
2. ✅ Test public request submission
3. ✅ Test CRM login and request management
4. 🔨 Start customizing UI components
5. 🔨 Add more sample data
6. 🔨 Refine business logic
7. 🔨 Improve error handling
8. 🔨 Add loading states
9. 🔨 Polish UI/UX
10. 🚀 Deploy for demo

---

## Useful Links

- **Prisma Docs:** https://www.prisma.io/docs
- **React Router:** https://reactrouter.com
- **TailwindCSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/primitives

---

## Support

If you encounter issues:
1. Check console logs (both frontend and backend)
2. Review API responses in browser DevTools Network tab
3. Check database data in Prisma Studio
4. Verify environment variables are set correctly

**Good luck building! 🚀**
