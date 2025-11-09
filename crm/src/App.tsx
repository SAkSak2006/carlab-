import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { RequestsList } from './pages/RequestsList';
import { RequestDetails } from './pages/RequestDetails';
import { ClientsList } from './pages/ClientsList';
import { ClientDetails } from './pages/ClientDetails';
import { VehiclesList } from './pages/VehiclesList';
import { VehicleDetails } from './pages/VehicleDetails';
import { MastersList } from './pages/MastersList';
import { SpareParts } from './pages/SpareParts';
import { Settings } from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><RequestsList /></ProtectedRoute>} />
      <Route path="/requests/:id" element={<ProtectedRoute><RequestDetails /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><ClientsList /></ProtectedRoute>} />
      <Route path="/clients/:id" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
      <Route path="/vehicles" element={<ProtectedRoute><VehiclesList /></ProtectedRoute>} />
      <Route path="/vehicles/:id" element={<ProtectedRoute><VehicleDetails /></ProtectedRoute>} />
      <Route path="/masters" element={<ProtectedRoute><MastersList /></ProtectedRoute>} />
      <Route path="/parts" element={<ProtectedRoute><SpareParts /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
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
