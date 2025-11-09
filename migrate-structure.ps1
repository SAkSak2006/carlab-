# Migration script for ilialox project restructuring
Write-Host "Starting project restructuring..." -ForegroundColor Green

# Copy public site files
Write-Host "`nCopying public site files..." -ForegroundColor Yellow
Copy-Item "src\pages\Landing.tsx" "public-site\src\pages\" -Force
Copy-Item "src\pages\TrackRequest.tsx" "public-site\src\pages\" -Force
Copy-Item "src\components\ServiceCard.tsx" "public-site\src\components\" -Force
Copy-Item "src\components\ReviewCard.tsx" "public-site\src\components\" -Force
Copy-Item "src\components\StatCard.tsx" "public-site\src\components\" -Force
Copy-Item "src\components\PrimaryButton.tsx" "public-site\src\components\" -Force
Copy-Item "src\components\figma" "public-site\src\components\" -Recurse -Force
Copy-Item "src\assets" "public-site\src\" -Recurse -Force

# Create public site services
New-Item -ItemType Directory -Path "public-site\src\services" -Force | Out-Null
@"
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicApi = {
  submitRequest: async (data: any) => {
    const response = await api.post('/public/requests', data);
    return response.data;
  },
  trackByToken: async (token: string) => {
    const response = await api.get(\`/public/track/\${token}\`);
    return response.data;
  },
  trackByNumber: async (requestNumber: string) => {
    const response = await api.get(\`/public/track/number/\${requestNumber}\`);
    return response.data;
  },
};
"@ | Out-File "public-site\src\services\api.ts" -Encoding UTF8

# Copy CRM files
Write-Host "`nCopying CRM files..." -ForegroundColor Yellow
Copy-Item "src\pages\Login.tsx" "crm\src\pages\" -Force
Copy-Item "src\pages\Dashboard.tsx" "crm\src\pages\" -Force
Copy-Item "src\pages\RequestsList.tsx" "crm\src\pages\" -Force
Copy-Item "src\pages\RequestDetails.tsx" "crm\src\pages\" -Force
Copy-Item "src\contexts" "crm\src\" -Recurse -Force
Copy-Item "src\services" "crm\src\" -Recurse -Force
Copy-Item "src\types" "crm\src\" -Recurse -Force
Copy-Item "src\utils" "crm\src\" -Recurse -Force
Copy-Item "src\components\shared" "crm\src\components\" -Recurse -Force
Copy-Item "src\components\crm" "crm\src\components\" -Recurse -Force

# Copy UI components (shadcn) to CRM
If (Test-Path "src\components\ui") {
    Copy-Item "src\components\ui" "crm\src\components\" -Recurse -Force
}

# Create CRM main.tsx and App.tsx
Write-Host "`nCreating CRM application files..." -ForegroundColor Yellow
@"
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
"@ | Out-File "crm\src\main.tsx" -Encoding UTF8

@"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { RequestsList } from './pages/RequestsList';
import { RequestDetails } from './pages/RequestDetails';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className=''min-h-screen flex items-center justify-center''>
        <div className=''animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600''></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to=''/login'' replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path=''/login'' element={<Login />} />
      <Route path=''/dashboard'' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path=''/requests'' element={<ProtectedRoute><RequestsList /></ProtectedRoute>} />
      <Route path=''/requests/:id'' element={<ProtectedRoute><RequestDetails /></ProtectedRoute>} />
      <Route path=''*'' element={<Navigate to=''/login'' replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
"@ | Out-File "crm\src\App.tsx" -Encoding UTF8

Write-Host "`n✅ File migration complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Install dependencies for public-site: cd public-site && npm install" -ForegroundColor White
Write-Host "2. Install dependencies for CRM: cd crm && npm install" -ForegroundColor White
Write-Host "3. Test public-site: cd public-site && npm run dev" -ForegroundColor White
Write-Host "4. Test CRM: cd crm && npm run dev" -ForegroundColor White
Write-Host "5. Once everything works, you can delete the old 'src' folder" -ForegroundColor White
