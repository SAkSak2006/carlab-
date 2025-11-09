// Mock data for prototype

const MASTERS = [
  { id: '1', name: 'Иван Петров', specialization: 'Механик' },
  { id: '2', name: 'Алексей Сидоров', specialization: 'Электрик' },
  { id: '3', name: 'Дмитрий Кузнецов', specialization: 'Диагност' },
  { id: '4', name: 'Сергей Иванов', specialization: 'Кузовной ремонт' },
];

const COMMON_SERVICES = [
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

const REQUEST_STATUSES = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const STATUS_LABELS = {
  new: 'Новый',
  in_progress: 'В работе',
  completed: 'Завершен',
  cancelled: 'Отменен',
};

const PAYMENT_STATUSES = {
  UNPAID: 'unpaid',
  PARTIALLY_PAID: 'partially_paid',
  PAID: 'paid',
};

const PAYMENT_STATUS_LABELS = {
  unpaid: 'Не оплачен',
  partially_paid: 'Частично оплачен',
  paid: 'Оплачен',
};

module.exports = {
  MASTERS,
  COMMON_SERVICES,
  REQUEST_STATUSES,
  STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
};
