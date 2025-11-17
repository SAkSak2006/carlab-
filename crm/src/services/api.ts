import axios from 'axios';
import type {
  AuthResponse,
  ServiceRequest,
  DashboardStats,
  RecentRequest,
  PublicRequestData,
  PublicRequestResponse,
  RequestWork,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn('[api] 401 Unauthorized - clearing auth and redirecting to login');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Use /crm/login because CRM app has basename="/crm"
      window.location.href = '/crm/login';
    }
    return Promise.reject(error);
  }
);

// =========================
// Authentication API
// =========================

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    console.log('[authApi] Sending login request...', { email });
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    console.log('[authApi] Login response:', { status: response.status, hasData: !!response.data });
    return response.data;
  },
};

// =========================
// Public API (no auth required)
// =========================

export const publicApi = {
  // Submit new request from landing page
  submitRequest: async (data: PublicRequestData): Promise<PublicRequestResponse> => {
    const response = await api.post<PublicRequestResponse>('/public/requests', data);
    return response.data;
  },

  // Track request by token
  trackByToken: async (token: string): Promise<{ request: ServiceRequest }> => {
    const response = await api.get(`/public/track/${token}`);
    return response.data;
  },

  // Track request by number
  trackByNumber: async (requestNumber: string): Promise<{ request: ServiceRequest }> => {
    const response = await api.get(`/public/track/number/${requestNumber}`);
    return response.data;
  },
};

// =========================
// Dashboard API (protected)
// =========================

export const dashboardApi = {
  getStats: async (): Promise<{ stats: DashboardStats; recentRequests: RecentRequest[] }> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

// =========================
// Requests API (protected)
// =========================

export const requestsApi = {
  // List requests with filters
  listRequests: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    requests: ServiceRequest[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> => {
    const response = await api.get('/requests', { params });
    return response.data;
  },

  // Get request details
  getRequest: async (id: string): Promise<{ request: ServiceRequest }> => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  // Update request status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean }> => {
    const response = await api.patch(`/requests/${id}/status`, { status });
    return response.data;
  },

  // Assign master
  assignMaster: async (id: string, masterName: string): Promise<{ success: boolean }> => {
    const response = await api.patch(`/requests/${id}/assign`, { masterName });
    return response.data;
  },

  // Update progress
  updateProgress: async (id: string, progress: number): Promise<{ success: boolean }> => {
    const response = await api.patch(`/requests/${id}/progress`, { progress });
    return response.data;
  },

  // Add work item
  addWork: async (
    id: string,
    data: { workName: string; quantity: number; unitPrice: number }
  ): Promise<{ success: boolean; work: RequestWork; totalAmount: number }> => {
    const response = await api.post(`/requests/${id}/works`, data);
    return response.data;
  },

  // Delete work item
  deleteWork: async (id: string, workId: string): Promise<{ success: boolean; totalAmount: number }> => {
    const response = await api.delete(`/requests/${id}/works/${workId}`);
    return response.data;
  },

  // Update payment status
  updatePayment: async (id: string, paymentStatus: string): Promise<{ success: boolean }> => {
    const response = await api.patch(`/requests/${id}/payment`, { paymentStatus });
    return response.data;
  },
};

export default api;
