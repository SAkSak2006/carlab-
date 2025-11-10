import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import { StatusBadge } from '../components/shared/StatusBadge';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { Input } from '../components/shared/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import type { ServiceRequest } from '../types';
import { format } from 'date-fns';
import { STATUS_LABELS } from '../utils/constants';

export const TrackRequest: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const requestNumberParam = searchParams.get('number');

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchNumber, setSearchNumber] = useState(requestNumberParam || '');

  useEffect(() => {
    if (token) {
      loadRequestByToken(token);
    } else if (requestNumberParam) {
      loadRequestByNumber(requestNumberParam);
    }
  }, [token, requestNumberParam]);

  const loadRequestByToken = async (trackingToken: string) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await publicApi.trackByToken(trackingToken);
      setRequest(data.request);
    } catch (err: any) {
      setError('Заявка не найдена. Проверьте правильность ссылки.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRequestByNumber = async (requestNumber: string) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await publicApi.trackByNumber(requestNumber);
      setRequest(data.request);
    } catch (err: any) {
      setError('Заявка не найдена. Проверьте номер заявки.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchNumber) {
      loadRequestByNumber(searchNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Car Lab Auto Service
          </Link>
          <Link to="/login" className="text-blue-600 hover:underline text-sm">
            Вход для сотрудников
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search form */}
        {!token && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Отследить заявку</h2>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                type="text"
                placeholder="Введите номер заявки"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                className="flex-1"
              />
              <PrimaryButton type="submit">Найти</PrimaryButton>
            </form>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow p-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Link to="/" className="text-blue-600 hover:underline">
                ← Вернуться на главную
              </Link>
            </div>
          </div>
        )}

        {/* Request details */}
        {request && !isLoading && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Заявка #{request.requestNumber}</h1>
                  <p className="text-gray-500 mt-1">
                    Создана: {format(new Date(request.createdAt), 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Прогресс выполнения</span>
                  <span className="font-bold text-blue-600">{request.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${request.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Client info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Информация о клиенте</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Клиент</p>
                  <p className="font-medium text-gray-900">
                    {request.client.firstName} {request.client.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Телефон</p>
                  <p className="font-medium text-gray-900">{request.client.phone}</p>
                </div>
              </div>
            </div>

            {/* Vehicle info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Автомобиль</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Марка и модель</p>
                  <p className="font-medium text-gray-900">
                    {request.vehicle.brand} {request.vehicle.model}
                  </p>
                </div>
                {request.vehicle.year && (
                  <div>
                    <p className="text-sm text-gray-500">Год выпуска</p>
                    <p className="font-medium text-gray-900">{request.vehicle.year}</p>
                  </div>
                )}
                {request.vehicle.licensePlate && (
                  <div>
                    <p className="text-sm text-gray-500">Гос. номер</p>
                    <p className="font-medium text-gray-900">{request.vehicle.licensePlate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Описание проблемы</h2>
              <p className="text-gray-700">{request.description}</p>
            </div>

            {/* Assigned master */}
            {request.assignedMaster && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Назначенный мастер:</span> {request.assignedMaster}
                </p>
              </div>
            )}

            {/* Works */}
            {request.works && request.works.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Выполненные работы</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          Наименование
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Кол-во</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Цена</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Сумма</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {request.works.map((work) => (
                        <tr key={work.id}>
                          <td className="px-4 py-3 text-sm">{work.workName}</td>
                          <td className="px-4 py-3 text-sm">{work.quantity}</td>
                          <td className="px-4 py-3 text-sm">{work.unitPrice.toLocaleString('ru-RU')} ₽</td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {work.totalPrice.toLocaleString('ru-RU')} ₽
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Total amount */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Общая сумма</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {request.totalAmount.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Статус оплаты</p>
                  <p className="font-medium mt-1">
                    {request.paymentStatus === 'paid' ? (
                      <span className="text-green-600">✓ Оплачено</span>
                    ) : request.paymentStatus === 'partially_paid' ? (
                      <span className="text-yellow-600">Частично оплачено</span>
                    ) : (
                      <span className="text-red-600">Не оплачено</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Status history */}
            {request.statusHistory && request.statusHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">История статусов</h2>
                <div className="space-y-3">
                  {request.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">
                        {format(new Date(history.createdAt), 'dd.MM.yyyy HH:mm')}
                      </span>
                      <span>→</span>
                      <span className="font-medium">{STATUS_LABELS[history.newStatus]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="text-center">
              <Link to="/" className="text-blue-600 hover:underline">
                ← Вернуться на главную
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
