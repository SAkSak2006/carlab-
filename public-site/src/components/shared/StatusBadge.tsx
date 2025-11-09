import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Ожидает',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  in_progress: {
    label: 'В работе',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  waiting_parts: {
    label: 'Ожидание запчастей',
    className: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  ready: {
    label: 'Готов',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  completed: {
    label: 'Завершен',
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  },
  cancelled: {
    label: 'Отменен',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};
