import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CRMLayout } from '../components/crm/CRMLayout';
import { Input } from '../components/shared/Input';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import ShinyText from '../components/ShinyText';
import { format } from 'date-fns';

// Mock data for demonstration
const mockClients = [
  {
    id: 1,
    firstName: 'Алексей',
    lastName: 'Иванов',
    phone: '+7 (999) 123-45-67',
    email: 'ivanov@mail.ru',
    type: 'individual',
    vehiclesCount: 2,
    requestsCount: 5,
    totalSpent: 125000,
    lastVisit: '2025-11-05T14:30:00',
    status: 'active',
  },
  {
    id: 2,
    firstName: 'Мария',
    lastName: 'Петрова',
    phone: '+7 (999) 234-56-78',
    email: 'petrova@gmail.com',
    type: 'individual',
    vehiclesCount: 1,
    requestsCount: 3,
    totalSpent: 78000,
    lastVisit: '2025-11-03T10:15:00',
    status: 'active',
  },
  {
    id: 3,
    firstName: 'ООО "Автопарк"',
    lastName: '',
    phone: '+7 (999) 345-67-89',
    email: 'autopark@company.ru',
    type: 'corporate',
    vehiclesCount: 8,
    requestsCount: 15,
    totalSpent: 450000,
    lastVisit: '2025-11-07T16:45:00',
    status: 'active',
  },
  {
    id: 4,
    firstName: 'Дмитрий',
    lastName: 'Сидоров',
    phone: '+7 (999) 456-78-90',
    email: 'sidorov@mail.ru',
    type: 'individual',
    vehiclesCount: 1,
    requestsCount: 1,
    totalSpent: 15000,
    lastVisit: '2025-10-20T12:00:00',
    status: 'inactive',
  },
];

export const ClientsList: React.FC = () => {
  const [clients, setClients] = useState(mockClients);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      search === '' ||
      client.firstName.toLowerCase().includes(search.toLowerCase()) ||
      client.lastName.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search) ||
      client.email.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'all' || client.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const typeButtons = [
    { value: 'all', label: 'Все' },
    { value: 'individual', label: 'Физ. лица' },
    { value: 'corporate', label: 'Юр. лица' },
  ];

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
              <ShinyText text="Клиенты" speed={4} />
            </h1>
            <p className="text-[#8B95A5] mt-1">База данных клиентов автосервиса</p>
          </div>
          <Link
            to="/clients/new"
            className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-6 py-3 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all shadow-[0px_4px_12px_rgba(168,178,193,0.3)]"
          >
            + Добавить клиента
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-4">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <Input
                type="text"
                placeholder="Поиск по имени, телефону или email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Type filter */}
            <div>
              <p className="text-sm text-[#8B95A5] mb-2">Тип клиента:</p>
              <div className="flex gap-2 flex-wrap">
                {typeButtons.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setTypeFilter(btn.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      typeFilter === btn.value
                        ? 'bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] shadow-[0px_4px_12px_rgba(168,178,193,0.3)]'
                        : 'bg-[#0A0A0A] text-[#E5E9ED] hover:bg-[#2A2A2A] hover:text-[#A8B2C1] border border-[#2A2A2A]'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
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

        {/* Clients grid */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)]">
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-20 text-[#8B95A5]">
              <p>Клиенты не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-6">
              {filteredClients.map((client) => (
                <Link
                  key={client.id}
                  to={`clients/${client.id}`}
                  className="block border border-[#2A2A2A] rounded-lg p-6 hover:border-[#A8B2C1] hover:shadow-[0px_4px_16px_rgba(168,178,193,0.2)] transition-all bg-[#0A0A0A]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] rounded-full flex items-center justify-center text-[#0A0A0A] font-bold text-lg">
                          {client.firstName.charAt(0)}
                          {client.lastName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#E5E9ED]">
                            {client.firstName} {client.lastName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                client.type === 'corporate'
                                  ? 'bg-blue-900/20 text-blue-400'
                                  : 'bg-green-900/20 text-green-400'
                              }`}
                            >
                              {client.type === 'corporate' ? 'Юридическое лицо' : 'Физическое лицо'}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                client.status === 'active'
                                  ? 'bg-green-900/20 text-green-400'
                                  : 'bg-gray-900/20 text-gray-400'
                              }`}
                            >
                              {client.status === 'active' ? 'Активен' : 'Неактивен'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-[#8B95A5]">Телефон</p>
                          <p className="font-medium text-[#E5E9ED]">{client.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8B95A5]">Email</p>
                          <p className="font-medium text-[#E5E9ED]">{client.email}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-[#8B95A5]">
                        <span>🚗 {client.vehiclesCount} авто</span>
                        <span>📊 {client.requestsCount} заявок</span>
                        <span>💰 {client.totalSpent.toLocaleString('ru-RU')} ₽</span>
                        <span>
                          Последний визит: {format(new Date(client.lastVisit), 'dd.MM.yyyy')}
                        </span>
                      </div>
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
