import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-900/90 text-green-100 border-green-700',
    error: 'bg-red-900/90 text-red-100 border-red-700',
    info: 'bg-blue-900/90 text-blue-100 border-blue-700',
    warning: 'bg-yellow-900/90 text-yellow-100 border-yellow-700',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg border shadow-lg ${typeStyles[type]} animate-slide-in`}
    >
      <span className="text-xl font-bold">{icons[type]}</span>
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-xl font-bold opacity-70 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{ id: number; message: string; type: ToastType }>;
  removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ marginTop: index > 0 ? '8px' : '0' }}>
          <Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
};

// Hook for toast management
let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = React.useState<Array<{ id: number; message: string; type: ToastType }>>([]);

  const showToast = React.useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
    warning: (message: string) => showToast(message, 'warning'),
  };
};
