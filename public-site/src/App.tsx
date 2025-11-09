import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import { TrackRequest } from './pages/TrackRequest';

function RedirectToCRM() {
  useEffect(() => {
    window.location.href = 'http://localhost:5173/login';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">Перенаправление в систему управления...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/track" element={<TrackRequest />} />
        <Route path="/track/:token" element={<TrackRequest />} />
        <Route path="/login" element={<RedirectToCRM />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
