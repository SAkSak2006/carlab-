import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CRMLayout } from '../components/crm/CRMLayout';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { StatusBadge } from '../components/shared/StatusBadge';
import ShinyText from '../components/ShinyText';
import { format } from 'date-fns';

// Mock vehicle data
const mockVehicle = {
  id: 1,
  brand: 'Toyota',
  model: 'Camry',
  year: 2020,
  licensePlate: 'А123БВ777',
  vin: 'JT2BF18K9X0123456',
  color: 'Белый',
  mileage: 45000,
  engineType: 'Бензин 2.5L',
  transmission: 'Автомат',
  bodyType: 'Седан',
  enginePower: '181 л.с.',
  fuelConsumption: '7.5 л/100км',
  owner: {
    id: 1,
    name: 'Алексей Иванов',
    phone: '+7 (999) 123-45-67',
  },
  status: 'active',
  registrationDate: '2024-01-15T10:00:00',
  lastService: '2025-11-05T14:30:00',
  nextService: '2025-12-05',
  notes: 'Регулярное обслуживание, использует оригинальные запчасти',
  serviceHistory: [
    {
      id: 1,
      requestNumber: 'R-2025-001',
      date: '2025-11-05T14:30:00',
      services: 'Замена масла, Замена фильтров, Диагностика',
      mileage: 45000,
      amount: 5000,
      status: 'completed',
      master: 'Иван Петров',
    },
    {
      id: 2,
      requestNumber: 'R-2025-002',
      date: '2025-09-15T16:00:00',
      services: 'ТО-2, Проверка тормозной системы',
      mileage: 40000,
      amount: 15000,
      status: 'completed',
      master: 'Сергей Смирнов',
    },
    {
      id: 3,
      requestNumber: 'R-2024-045',
      date: '2024-06-10T11:00:00',
      services: 'Замена тормозных колодок',
      mileage: 35000,
      amount: 8000,
      status: 'completed',
      master: 'Иван Петров',
    },
  ],
  documents: [
    {
      id: 1,
      name: 'ПТС (копия)',
      type: 'image/jpeg',
      size: '3.2 MB',
      uploadedAt: '2024-01-15T10:00:00',
    },
    {
      id: 2,
      name: 'СТС (копия)',
      type: 'image/jpeg',
      size: '2.8 MB',
      uploadedAt: '2024-01-15T10:30:00',
    },
  ],
  comments: [
    {
      id: 1,
      text: 'Владелец попросил использовать только оригинальные запчасти',
      author: 'Менеджер',
      createdAt: '2024-01-15T10:00:00',
    },
    {
      id: 2,
      text: 'При последнем ТО обнаружен небольшой износ тормозных дисков, рекомендовано наблюдение',
      author: 'Мастер Иван Петров',
      createdAt: '2025-11-05T15:00:00',
    },
  ],
};

type TabType = 'info' | 'history' | 'documents' | 'comments';

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle] = useState(mockVehicle);

  const tabs = [
    { id: 'info' as TabType, label: 'Основная информация', icon: '🚗' },
    { id: 'history' as TabType, label: 'История обслуживания', icon: '📋', count: vehicle.serviceHistory.length },
    { id: 'documents' as TabType, label: 'Документы', icon: '📄', count: vehicle.documents.length },
    { id: 'comments' as TabType, label: 'Комментарии', icon: '💬', count: vehicle.comments.length },
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
            <Link to="/crm/vehicles" className="text-[#A8B2C1] hover:text-[#E5E9ED] mb-2 inline-block">
              ← Назад к списку
            </Link>
            <h1 className="text-3xl font-bold">
              <ShinyText text={`${vehicle.brand} ${vehicle.model}`} speed={4} />
            </h1>
            <p className="text-[#8B95A5] mt-1">
              {vehicle.licensePlate} • {vehicle.year} г. • {vehicle.color}
            </p>
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
            <p className="text-sm text-[#8B95A5]">Пробег</p>
            <p className="text-2xl font-bold text-[#E5E9ED] mt-1">
              {vehicle.mileage.toLocaleString('ru-RU')} км
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Обслуживаний</p>
            <p className="text-2xl font-bold text-[#E5E9ED] mt-1">{vehicle.serviceHistory.length}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Последнее ТО</p>
            <p className="text-lg font-bold text-[#E5E9ED] mt-1">
              {format(new Date(vehicle.lastService), 'dd.MM.yyyy')}
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Следующее ТО</p>
            <p className="text-lg font-bold text-[#A8B2C1] mt-1">
              {format(new Date(vehicle.nextService), 'dd.MM.yyyy')}
            </p>
          </div>
        </div>

        {/* Owner card */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#E5E9ED] mb-4">Владелец</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] rounded-full flex items-center justify-center text-[#0A0A0A] font-bold text-lg">
                {vehicle.owner.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-bold text-[#E5E9ED]">{vehicle.owner.name}</p>
                <p className="text-sm text-[#8B95A5]">{vehicle.owner.phone}</p>
              </div>
            </div>
            <Link
              to={`/clients/${vehicle.owner.id}`}
              className="text-[#A8B2C1] hover:text-[#E5E9ED] font-medium"
            >
              Профиль клиента →
            </Link>
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
                    <p className="text-sm text-[#8B95A5] mb-1">Марка</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Модель</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Год выпуска</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Цвет</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Гос. номер</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">VIN</p>
                    <p className="text-lg font-medium text-[#E5E9ED] font-mono">{vehicle.vin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Тип кузова</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.bodyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Двигатель</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.engineType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Мощность</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.enginePower}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Трансмиссия</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.transmission}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Расход топлива</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.fuelConsumption}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Статус</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">
                      {vehicle.status === 'active' ? '✅ Активен' : '⏸️ Неактивен'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Дата регистрации</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">
                      {format(new Date(vehicle.registrationDate), 'dd.MM.yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B95A5] mb-1">Текущий пробег</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">
                      {vehicle.mileage.toLocaleString('ru-RU')} км
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-[#8B95A5] mb-1">Примечания</p>
                    <p className="text-lg font-medium text-[#E5E9ED]">{vehicle.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {vehicle.serviceHistory.map((record) => (
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
                          {format(new Date(record.date), 'dd.MM.yyyy HH:mm')} • Пробег:{' '}
                          {record.mileage.toLocaleString('ru-RU')} км
                        </p>
                        <p className="text-sm text-[#E5E9ED] mb-2">{record.services}</p>
                        <p className="text-sm text-[#A8B2C1]">👨‍🔧 {record.master}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#A8B2C1]">
                          {record.amount.toLocaleString('ru-RU')} ₽
                        </p>
                        <Link
                          to={`/requests/${record.id}`}
                          className="text-sm text-[#A8B2C1] hover:text-[#E5E9ED] mt-2 inline-block"
                        >
                          Подробнее →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                {vehicle.documents.map((doc) => (
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
                {vehicle.comments.map((comment) => (
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
