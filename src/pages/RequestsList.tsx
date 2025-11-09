import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CRMLayout } from '../components/crm/CRMLayout';
import { StatusBadge } from '../components/shared/StatusBadge';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { Input } from '../components/shared/Input';
import { requestsApi } from '../services/api';
import type { ServiceRequest } from '../types';
import { format } from 'date-fns';

export const RequestsList: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadRequests();
  }, [statusFilter, search]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;

      const data = await requestsApi.listRequests(params);
      setRequests(data.requests);
    } catch (err: any) {
      setError('Ошибка загрузки заявок');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterButtons = [
    { value: 'all', label: 'Все' },
    { value: 'new', label: 'Новые' },
    { value: 'in_progress', label: 'В работе' },
    { value: 'completed', label: 'Завершенные' },
    { value: 'cancelled', label: 'Отмененные' },
  ];

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Заявки</h1>
          <p className="text-gray-600 mt-1">Список всех заявок на обслуживание</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status filter */}
            <div className="flex gap-2 flex-wrap">
              {filterButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setStatusFilter(btn.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    statusFilter === btn.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 md:max-w-xs">
              <Input
                type="text"
                placeholder="Поиск по номеру или клиенту..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Requests list */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : error ? (
            <div className="text-center py-20 text-red-600">{error}</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>Заявки не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-6">
              {requests.map((request) => (
                <Link
                  key={request.id}
                  to={`/requests/${request.id}`}
                  className="block border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Заявка #{request.requestNumber}
                        </h3>
                        <StatusBadge status={request.status} />
                      </div>

                      {/* Client & Vehicle */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Клиент</p>
                          <p className="font-medium text-gray-900">
                            {request.client.firstName} {request.client.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{request.client.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Автомобиль</p>
                          <p className="font-medium text-gray-900">
                            {request.vehicle.brand} {request.vehicle.model}
                          </p>
                          {request.vehicle.licensePlate && (
                            <p className="text-sm text-gray-600">{request.vehicle.licensePlate}</p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{request.description}</p>

                      {/* Footer info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {request.assignedMaster && (
                          <span>
                            👨‍🔧 {request.assignedMaster}
                          </span>
                        )}
                        <span>📊 {request.progressPercentage}%</span>
                        <span>{request.worksCount || 0} работ</span>
                        <span>{format(new Date(request.createdAt), 'dd.MM.yyyy HH:mm')}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="ml-4 text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {request.totalAmount.toLocaleString('ru-RU')} ₽
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {request.paymentStatus === 'paid' ? '✅ Оплачено' : '⏳ Не оплачено'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </CRMLayout>
  );
};
