export const STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  waiting_parts: 'Ожидание запчастей',
  ready: 'Готов',
  completed: 'Завершен',
  cancelled: 'Отменен',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Не оплачено',
  partially_paid: 'Частично оплачено',
  paid: 'Оплачено',
};
