import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import { StatusBadge } from '../components/shared/StatusBadge';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { Input } from '../components/shared/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import ShinyText from '../components/ShinyText';
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
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] shadow-[0px_4px_20px_rgba(139,149,165,0.1)]">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-3xl font-bold">
              <ShinyText text="CAR LAB" speed={3} />
            </Link>
            <Link
              to="/login"
              className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-6 py-2 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all shadow-[0px_4px_12px_rgba(168,178,193,0.3)]"
            >
              Вход для сотрудников
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search form */}
        {!token && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              <ShinyText text="Отследить заявку" speed={4} />
            </h2>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                type="text"
                placeholder="Введите номер заявки"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                className="flex-1"
              />
              <PrimaryButton type="submit">НАЙТИ</PrimaryButton>
            </form>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Link to="/" className="text-[#A8B2C1] hover:text-[#E5E9ED] transition-colors">
                ← Вернуться на главную
              </Link>
            </div>
          </div>
        )}

        {/* Request details */}
        {request && !isLoading && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">
                    <ShinyText text={`Заявка #${request.requestNumber}`} speed={4} />
                  </h1>
                  <p className="text-[#8B95A5] mt-1">
                    Создана: {format(new Date(request.createdAt), 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-[#E5E9ED]">Прогресс выполнения</span>
                  <span className="font-bold text-[#A8B2C1]">{request.progressPercentage}%</span>
                </div>
                <div className="w-full bg-[#0A0A0A] rounded-full h-3 border border-[#2A2A2A]">
                  <div
                    className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] h-3 rounded-full transition-all"
                    style={{ width: `${request.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Client info */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6">
              <h2 className="text-xl font-bold text-[#E5E9ED] mb-4">Информация о клиенте</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#8B95A5]">Клиент</p>
                  <p className="font-medium text-[#E5E9ED]">
                    {request.client.firstName} {request.client.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#8B95A5]">Телефон</p>
                  <p className="font-medium text-[#E5E9ED]">{request.client.phone}</p>
                </div>
              </div>
            </div>

            {/* Vehicle info */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6">
              <h2 className="text-xl font-bold text-[#E5E9ED] mb-4">Автомобиль</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#8B95A5]">Марка и модель</p>
                  <p className="font-medium text-[#E5E9ED]">
                    {request.vehicle.brand} {request.vehicle.model}
                  </p>
                </div>
                {request.vehicle.year && (
                  <div>
                    <p className="text-sm text-[#8B95A5]">Год выпуска</p>
                    <p className="font-medium text-[#E5E9ED]">{request.vehicle.year}</p>
                  </div>
                )}
                {request.vehicle.licensePlate && (
                  <div>
                    <p className="text-sm text-[#8B95A5]">Гос. номер</p>
                    <p className="font-medium text-[#E5E9ED]">{request.vehicle.licensePlate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6">
              <h2 className="text-xl font-bold text-[#E5E9ED] mb-4">Описание проблемы</h2>
              <p className="text-[#A8B2C1]">{request.description}</p>
            </div>

            {/* Assigned master */}
            {request.assignedMaster && (
              <div className="bg-gradient-to-r from-[#8B95A5]/10 to-[#A8B2C1]/10 border border-[#A8B2C1]/30 rounded-lg p-4">
                <p className="text-sm text-[#E5E9ED]">
                  <span className="font-medium">Назначенный мастер:</span>{' '}
                  <span className="text-[#A8B2C1]">{request.assignedMaster}</span>
                </p>
              </div>
            )}

            {/* Works */}
            {request.works && request.works.length > 0 && (
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6">
                <h2 className="text-xl font-bold text-[#E5E9ED] mb-4">Выполненные работы</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0A0A0A]">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#8B95A5]">
                          Наименование
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#8B95A5]">Кол-во</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#8B95A5]">Цена</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#8B95A5]">Сумма</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {request.works.map((work) => (
                        <tr key={work.id} className="hover:bg-[#0A0A0A] transition-colors">
                          <td className="px-4 py-3 text-sm text-[#E5E9ED]">{work.workName}</td>
                          <td className="px-4 py-3 text-sm text-[#E5E9ED]">{work.quantity}</td>
                          <td className="px-4 py-3 text-sm text-[#E5E9ED]">{work.unitPrice.toLocaleString('ru-RU')} ₽</td>
                          <td className="px-4 py-3 text-sm font-medium text-[#A8B2C1]">
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
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8B95A5]">Общая сумма</p>
                  <p className="text-3xl font-bold text-[#E5E9ED] mt-1">
                    {request.totalAmount.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#8B95A5]">Статус оплаты</p>
                  <p className="font-medium mt-1">
                    {request.paymentStatus === 'paid' ? (
                      <span className="text-green-400">✓ Оплачено</span>
                    ) : request.paymentStatus === 'partially_paid' ? (
                      <span className="text-yellow-400">Частично оплачено</span>
                    ) : (
                      <span className="text-red-400">Не оплачено</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Status history */}
            {request.statusHistory && request.statusHistory.length > 0 && (
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6">
                <h2 className="text-xl font-bold text-[#E5E9ED] mb-4">История статусов</h2>
                <div className="space-y-3">
                  {request.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span className="text-[#8B95A5]">
                        {format(new Date(history.createdAt), 'dd.MM.yyyy HH:mm')}
                      </span>
                      <span className="text-[#A8B2C1]">→</span>
                      <span className="font-medium text-[#E5E9ED]">{STATUS_LABELS[history.newStatus]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="text-center">
              <Link to="/" className="text-[#A8B2C1] hover:text-[#E5E9ED] transition-colors">
                ← Вернуться на главную
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
