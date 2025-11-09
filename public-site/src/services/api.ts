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
    const response = await api.get(`/public/track/${token}`);
    return response.data;
  },
  trackByNumber: async (requestNumber: string) => {
    const response = await api.get(`/public/track/number/${requestNumber}`);
    return response.data;
  },
};
