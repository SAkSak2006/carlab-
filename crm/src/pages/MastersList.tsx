import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CRMLayout } from '../components/crm/CRMLayout';
import { Input } from '../components/shared/Input';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import ShinyText from '../components/ShinyText';

// Mock data for demonstration
const mockMasters = [
  {
    id: 1,
    firstName: 'Иван',
    lastName: 'Петров',
    phone: '+7 (999) 111-22-33',
    email: 'ivan.petrov@carlab.com',
    specialization: 'Диагностика и ремонт двигателя',
    experience: 10,
    rating: 4.9,
    activeRequests: 3,
    completedRequests: 156,
    totalEarnings: 850000,
    status: 'active',
    avatar: null,
  },
  {
    id: 2,
    firstName: 'Сергей',
    lastName: 'Смирнов',
    phone: '+7 (999) 222-33-44',
    email: 'sergey.smirnov@carlab.com',
    specialization: 'Кузовной ремонт и покраска',
    experience: 8,
    rating: 4.8,
    activeRequests: 2,
    completedRequests: 98,
    totalEarnings: 620000,
    status: 'active',
    avatar: null,
  },
  {
    id: 3,
    firstName: 'Михаил',
    lastName: 'Васильев',
    phone: '+7 (999) 333-44-55',
    email: 'mikhail.vasiliev@carlab.com',
    specialization: 'Электрика и электроника',
    experience: 12,
    rating: 5.0,
    activeRequests: 4,
    completedRequests: 203,
    totalEarnings: 1100000,
    status: 'active',
    avatar: null,
  },
  {
    id: 4,
    firstName: 'Алексей',
    lastName: 'Кузнецов',
    phone: '+7 (999) 444-55-66',
    email: 'alexey.kuznetsov@carlab.com',
    specialization: 'Подвеска и тормозная система',
    experience: 5,
    rating: 4.6,
    activeRequests: 0,
    completedRequests: 45,
    totalEarnings: 280000,
    status: 'inactive',
    avatar: null,
  },
];

export const MastersList: React.FC = () => {
  const [masters, setMasters] = useState(mockMasters);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMasters = masters.filter((master) => {
    const matchesSearch =
      search === '' ||
      master.firstName.toLowerCase().includes(search.toLowerCase()) ||
      master.lastName.toLowerCase().includes(search.toLowerCase()) ||
      master.phone.includes(search) ||
      master.specialization.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || master.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusButtons = [
    { value: 'all', label: 'Все' },
    { value: 'active', label: 'Активные' },
    { value: 'inactive', label: 'Неактивные' },
  ];

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              <ShinyText text="Мастера" speed={4} />
            </h1>
            <p className="text-[#8B95A5] mt-1">Управление мастерами и техниками автосервиса</p>
          </div>
          <Link
            to="/masters/new"
            className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-6 py-3 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all shadow-[0px_4px_12px_rgba(168,178,193,0.3)]"
          >
            + Добавить мастера
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Всего мастеров</p>
            <p className="text-2xl font-bold text-[#E5E9ED] mt-1">{masters.length}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Активных</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {masters.filter((m) => m.status === 'active').length}
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">В работе сейчас</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">
              {masters.filter((m) => m.activeRequests > 0).length}
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Средний рейтинг</p>
            <p className="text-2xl font-bold text-[#A8B2C1] mt-1">
              {(masters.reduce((sum, m) => sum + m.rating, 0) / masters.length).toFixed(1)} ⭐
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-4">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <Input
                type="text"
                placeholder="Поиск по имени, телефону или специализации..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div>
              <p className="text-sm text-[#8B95A5] mb-2">Статус:</p>
              <div className="flex gap-2 flex-wrap">
                {statusButtons.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setStatusFilter(btn.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      statusFilter === btn.value
                        ? 'bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] shadow-[0px_4px_12px_rgba(168,178,193,0.3)]'
                        : 'bg-[#0A0A0A] text-[#E5E9ED] hover:bg-[#2A2A2A] hover:text-[#A8B2C1] border border-[#2A2A2A]'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Masters grid */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)]">
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : filteredMasters.length === 0 ? (
            <div className="text-center py-20 text-[#8B95A5]">
              <p>Мастера не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-6">
              {filteredMasters.map((master) => (
                <div
                  key={master.id}
                  className="block border border-[#2A2A2A] rounded-lg p-6 hover:border-[#A8B2C1] hover:shadow-[0px_4px_16px_rgba(168,178,193,0.2)] transition-all bg-[#0A0A0A]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] rounded-full flex items-center justify-center text-[#0A0A0A] font-bold text-xl flex-shrink-0">
                        {master.firstName.charAt(0)}
                        {master.lastName.charAt(0)}
                      </div>

                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#E5E9ED]">
                            {master.firstName} {master.lastName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-yellow-400">⭐ {master.rating}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                master.status === 'active'
                                  ? 'bg-green-900/20 text-green-400'
                                  : 'bg-gray-900/20 text-gray-400'
                              }`}
                            >
                              {master.status === 'active' ? 'Активен' : 'Неактивен'}
                            </span>
                          </div>
                        </div>

                        {/* Specialization */}
                        <p className="text-[#A8B2C1] font-medium mb-3">🔧 {master.specialization}</p>

                        {/* Contact info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 text-sm text-[#8B95A5]">
                          <div>📞 {master.phone}</div>
                          <div>📧 {master.email}</div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-[#8B95A5]">Опыт: </span>
                            <span className="text-[#E5E9ED] font-medium">{master.experience} лет</span>
                          </div>
                          <div>
                            <span className="text-[#8B95A5]">В работе: </span>
                            <span className="text-yellow-400 font-medium">{master.activeRequests}</span>
                          </div>
                          <div>
                            <span className="text-[#8B95A5]">Выполнено: </span>
                            <span className="text-green-400 font-medium">{master.completedRequests}</span>
                          </div>
                          <div>
                            <span className="text-[#8B95A5]">Заработано: </span>
                            <span className="text-[#A8B2C1] font-medium">
                              {master.totalEarnings.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-4 py-2 rounded-lg text-sm font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all">
                        Профиль
                      </button>
                      <button className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#E5E9ED] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2A2A2A] hover:text-[#A8B2C1] transition-all">
                        Расписание
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CRMLayout>
  );
};
