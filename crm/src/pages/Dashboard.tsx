import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CRMLayout } from '../components/crm/CRMLayout';
import { StatusBadge } from '../components/shared/StatusBadge';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { dashboardApi } from '../services/api';
import type { DashboardStats, RecentRequest } from '../types';
import { format } from 'date-fns';
import ShinyText from '../components/ShinyText';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardApi.getStats();
      setStats(data.stats);
      setRecentRequests(data.recentRequests);
    } catch (err: any) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <CRMLayout>
        <LoadingSpinner size="lg" className="mt-20" />
      </CRMLayout>
    );
  }

  if (error) {
    return (
      <CRMLayout>
        <div className="text-center mt-20 text-red-400">{error}</div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            <ShinyText text="Панель управления" speed={4} />
          </h1>
          <p className="text-[#8B95A5] mt-1">Общая статистика и последние заявки</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Requests */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6 hover:border-[#A8B2C1] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B95A5]">Всего заявок</p>
                <p className="text-3xl font-bold text-[#E5E9ED] mt-1">{stats?.totalRequests}</p>
              </div>
              <div className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] p-3 rounded-lg">
                <svg className="w-8 h-8 text-[#0A0A0A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* New Requests */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6 hover:border-[#A8B2C1] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B95A5]">Новых</p>
                <p className="text-3xl font-bold text-[#A8B2C1] mt-1">{stats?.requestsByStatus.new}</p>
              </div>
              <div className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] p-3 rounded-lg">
                <svg className="w-8 h-8 text-[#0A0A0A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6 hover:border-[#A8B2C1] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B95A5]">В работе</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">{stats?.requestsByStatus.in_progress}</p>
              </div>
              <div className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] p-3 rounded-lg">
                <svg className="w-8 h-8 text-[#0A0A0A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Today's Revenue */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6 hover:border-[#A8B2C1] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B95A5]">Выручка сегодня</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  {stats?.todayRevenue.toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <div className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] p-3 rounded-lg">
                <svg className="w-8 h-8 text-[#0A0A0A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6 hover:border-[#A8B2C1] transition-all">
            <p className="text-sm text-[#8B95A5]">Завершено</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats?.requestsByStatus.completed}</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6 hover:border-[#A8B2C1] transition-all">
            <p className="text-sm text-[#8B95A5]">Заявок сегодня</p>
            <p className="text-2xl font-bold text-[#E5E9ED] mt-1">{stats?.todayRequests}</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-6 hover:border-[#A8B2C1] transition-all">
            <p className="text-sm text-[#8B95A5]">Ожидают оплаты</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{stats?.pendingRequests}</p>
          </div>
        </div>

        {/* Recent requests */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)]">
          <div className="p-6 border-b border-[#2A2A2A]">
            <h2 className="text-xl font-bold text-[#E5E9ED]">Последние заявки</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0A0A0A]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Номер</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Клиент</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Автомобиль</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Сумма</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {recentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-[#0A0A0A] transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`requests/${request.id}`} className="text-[#A8B2C1] hover:text-[#E5E9ED] font-medium transition-colors">
                        #{request.requestNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#E5E9ED]">{request.clientName}</td>
                    <td className="px-6 py-4 text-sm text-[#E5E9ED]">{request.vehicle}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#E5E9ED]">
                      {request.totalAmount.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8B95A5]">
                      {format(new Date(request.createdAt), 'dd.MM.yyyy HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-[#2A2A2A]">
            <Link to="/crm/requests" className="text-[#A8B2C1] hover:text-[#E5E9ED] text-sm font-medium transition-colors">
              Посмотреть все заявки →
            </Link>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
};
