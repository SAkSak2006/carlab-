import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CRMLayout } from '../components/crm/CRMLayout';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { StatusBadge } from '../components/shared/StatusBadge';
import ShinyText from '../components/ShinyText';
import { format } from 'date-fns';

// Mock client data
const mockClient = {
  id: 1,
  firstName: 'Алексей',
  lastName: 'Иванов',
  phone: '+7 (999) 123-45-67',
  email: 'ivanov@mail.ru',
  type: 'individual',
  status: 'active',
  createdAt: '2024-01-15T10:00:00',
  lastVisit: '2025-11-05T14:30:00',
  address: 'г. Москва, ул. Пушкина, д. 10, кв. 5',
  birthDate: '1985-05-20',
  passport: '4510 123456',
  notes: 'Постоянный клиент, предпочитает оригинальные запчасти',
  discount: 10,
  vehicles: [
    {
      id: 1,
      brand: 'Toyota',
      model: 'Camry',
      year: 2020,
      licensePlate: 'А123БВ777',
      vin: 'JT2BF18K9X0123456',
    },
    {
      id: 2,
      brand: 'BMW',
      model: 'X5',
      year: 2018,
      licensePlate: 'В456ГД777',
      vin: 'WBAKB6C50BE123456',
    },
  ],
  serviceHistory: [
    {
      id: 1,
      requestNumber: 'R-2025-001',
      date: '2025-11-05T14:30:00',
      vehicle: 'Toyota Camry',
      services: 'Замена масла, Диагностика',
      amount: 5000,
      status: 'completed',
    },
    {
      id: 2,
      requestNumber: 'R-2025-002',
      date: '2025-10-20T10:00:00',
      vehicle: 'BMW X5',
      services: 'Ремонт подвески',
      amount: 45000,
      status: 'completed',
    },
    {
      id: 3,
      requestNumber: 'R-2025-003',
      date: '2025-09-15T16:00:00',
      vehicle: 'Toyota Camry',
      services: 'ТО-2',
      amount: 15000,
      status: 'completed',
    },
  ],
  documents: [
    {
      id: 1,
      name: 'Паспорт (копия)',
      type: 'image/jpeg',
      size: '2.3 MB',
      uploadedAt: '2024-01-15T10:00:00',
    },
    {
      id: 2,
      name: 'Договор на обслуживание',
      type: 'application/pdf',
      size: '1.1 MB',
      uploadedAt: '2024-01-15T10:30:00',
    },
  ],
  comments: [
    {
      id: 1,
      text: 'Клиент попросил уведомлять его заранее о необходимости ТО',
      author: 'Администратор',
      createdAt: '2024-01-15T10:00:00',
    },
    {
      id: 2,
      text: 'Предпочитает записываться на утренние часы',
      author: 'Менеджер',
      createdAt: '2024-03-20T14:00:00',
    },
  ],
};

type TabType = 'info' | 'vehicles' | 'history' | 'documents' | 'comments';

export const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [client] = useState(mockClient);

  const tabs = [
    { id: 'info' as TabType, label: 'Основная информация', icon: '👤' },
    { id: 'vehicles' as TabType, label: 'Автомобили', icon: '🚗', count: client.vehicles.length },
    { id: 'history' as TabType, label: 'История обслуживания', icon: '📋', count: client.serviceHistory.length },
    { id: 'documents' as TabType, label: 'Документы', icon: '📄', count: client.documents.length },
    { id: 'comments' as TabType, label: 'Комментарии', icon: '💬', count: client.comments.length },
  ];

  if (isLoading) {
    return (
      <CRMLayout>
        <LoadingSpinner size="lg" className="mt-20" />
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link to="/clients" className="text-[#A8B2C1] hover:text-[#E5E9ED] mb-2 inline-block">
              ← Назад к списку
            </Link>
            <h1 className="text-3xl font-bold">
              <ShinyText text={`${client.firstName} ${client.lastName}`} speed={4} />
            </h1>
            <p className="text-[#8B95A5] mt-1">ID клиента: {client.id}</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-6 py-3 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all shadow-[0px_4px_12px_rgba(168,178,193,0.3)]">
              Редактировать
            </button>
            <button className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#E5E9ED] px-6 py-3 rounded-lg font-semibold hover:bg-[#2A2A2A] hover:text-[#A8B2C1] transition-all">
              Создать заявку
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Автомобилей</p>
            <p className="text-2xl font-bold text-[#E5E9ED] mt-1">{client.vehicles.length}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Всего заявок</p>
            <p className="text-2xl font-bold text-[#E5E9ED] mt-1">{client.serviceHistory.length}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Потрачено</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {client.serviceHistory.reduce((sum, h) => sum + h.amount, 0).toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Скидка</p>
            <p className="text-2xl font-bold text-[#A8B2C1] mt-1">{client.discount}%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)]">
          <div className="border-b border-[#2A2A2A] p-4">
            <div className="flex gap-2 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] shadow-[0px_4px_12px_rgba(168,178,193,0.3)]'
                      : 'bg-[#0A0A0A] text-[#E5E9ED] hover:bg-[#2A2A2A] hover:text-[#A8B2C1] border border-[#2A2A2A]'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-xs opacity-70">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Имя</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{client.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Фамилия</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{client.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Телефон</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{client.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Email</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Тип клиента</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">
                      {client.type === 'corporate' ? 'Юридическое лицо' : 'Физическое лицо'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Статус</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">
                      {client.status === 'active' ? '✅ Активен' : '⏸️ Неактивен'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Дата рождения</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">
                      {format(new Date(client.birthDate), 'dd.MM.yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Паспорт</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{client.passport}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-[#8B95A5] mb-1">Адрес</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{client.address}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-[#8B95A5] mb-1">Примечания</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{client.notes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Дата регистрации</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">
                      {format(new Date(client.createdAt), 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Последний визит</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">
                      {format(new Date(client.lastVisit), 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <div className="space-y-4">
                {client.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="border border-[#2A2A2A] rounded-lg p-4 bg-[#0A0A0A] hover:border-[#A8B2C1] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#E5E9ED]">
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </h3>
                        <p className="text-sm text-[#8B95A5] mt-1">
                          Гос. номер: {vehicle.licensePlate}
                        </p>
                        <p className="text-sm text-[#8B95A5]">VIN: {vehicle.vin}</p>
                      </div>
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="text-[#A8B2C1] hover:text-[#E5E9ED] font-medium"
                      >
                        Подробнее →
                      </Link>
                    </div>
                  </div>
                ))}
                <button className="w-full border-2 border-dashed border-[#2A2A2A] rounded-lg p-4 text-[#8B95A5] hover:border-[#A8B2C1] hover:text-[#A8B2C1] transition-all">
                  + Добавить автомобиль
                </button>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {client.serviceHistory.map((record) => (
                  <div
                    key={record.id}
                    className="border border-[#2A2A2A] rounded-lg p-4 bg-[#0A0A0A] hover:border-[#A8B2C1] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-[#E5E9ED]">
                            Заявка #{record.requestNumber}
                          </h3>
                          <StatusBadge status={record.status} />
                        </div>
                        <p className="text-sm text-[#8B95A5] mb-2">
                          {format(new Date(record.date), 'dd.MM.yyyy HH:mm')}
                        </p>
                        <p className="text-sm text-[#A8B2C1] mb-1">🚗 {record.vehicle}</p>
                        <p className="text-sm text-[#E5E9ED]">{record.services}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#A8B2C1]">
                          {record.amount.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                {client.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-[#2A2A2A] rounded-lg p-4 bg-[#0A0A0A] hover:border-[#A8B2C1] transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#E5E9ED]">{doc.name}</h3>
                        <p className="text-sm text-[#8B95A5]">
                          {doc.size} • {format(new Date(doc.uploadedAt), 'dd.MM.yyyy')}
                        </p>
                      </div>
                    </div>
                    <button className="text-[#A8B2C1] hover:text-[#E5E9ED] font-medium">
                      Скачать
                    </button>
                  </div>
                ))}
                <button className="w-full border-2 border-dashed border-[#2A2A2A] rounded-lg p-4 text-[#8B95A5] hover:border-[#A8B2C1] hover:text-[#A8B2C1] transition-all">
                  + Загрузить документ
                </button>
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                {client.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-[#2A2A2A] rounded-lg p-4 bg-[#0A0A0A]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-[#E5E9ED]">{comment.author}</p>
                      <p className="text-sm text-[#8B95A5]">
                        {format(new Date(comment.createdAt), 'dd.MM.yyyy HH:mm')}
                      </p>
                    </div>
                    <p className="text-[#A8B2C1]">{comment.text}</p>
                  </div>
                ))}
                <div className="border border-[#2A2A2A] rounded-lg p-4 bg-[#0A0A0A]">
                  <textarea
                    className="w-full bg-transparent text-[#E5E9ED] border-none outline-none resize-none"
                    rows={3}
                    placeholder="Добавить комментарий..."
                  />
                  <div className="flex justify-end mt-2">
                    <button className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-4 py-2 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all">
                      Добавить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CRMLayout>
  );
};
