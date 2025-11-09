import { Master, CommonService } from '../types';

// Mock data - Masters list (hardcoded for prototype)
export const MASTERS: Master[] = [
  { id: '1', name: 'Иван Петров', specialization: 'Механик' },
  { id: '2', name: 'Алексей Сидоров', specialization: 'Электрик' },
  { id: '3', name: 'Дмитрий Кузнецов', specialization: 'Диагност' },
  { id: '4', name: 'Сергей Иванов', specialization: 'Кузовной ремонт' },
];

// Common services for quick selection
export const COMMON_SERVICES: CommonService[] = [
  { name: 'Замена масла', defaultPrice: 1500 },
  { name: 'Диагностика двигателя', defaultPrice: 2000 },
  { name: 'Замена тормозных колодок', defaultPrice: 3500 },
  { name: 'Развал-схождение', defaultPrice: 2500 },
  { name: 'Замена свечей', defaultPrice: 1200 },
  { name: 'Замена фильтров', defaultPrice: 800 },
  { name: 'Ремонт подвески', defaultPrice: 5000 },
  { name: 'Замена ремня ГРМ', defaultPrice: 4500 },
  { name: 'Чистка инжектора', defaultPrice: 3000 },
  { name: 'Ремонт стартера', defaultPrice: 2500 },
];

// Status labels (Russian)
export const STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  in_progress: 'В работе',
  completed: 'Завершен',
  cancelled: 'Отменен',
};

// Status colors for badges
export const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// Payment status labels
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: 'Не оплачен',
  partially_paid: 'Частично оплачен',
  paid: 'Оплачен',
};

// Payment status colors
export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-800',
  partially_paid: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
};

// Navigation items for CRM sidebar
export const CRM_NAV_ITEMS = [
  { path: '/dashboard', label: 'Панель управления', icon: 'LayoutDashboard' },
  { path: '/requests', label: 'Заявки', icon: 'FileText' },
];
