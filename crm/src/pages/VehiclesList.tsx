import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CRMLayout } from '../components/crm/CRMLayout';
import { Input } from '../components/shared/Input';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import ShinyText from '../components/ShinyText';
import { format } from 'date-fns';

// Mock data for demonstration
const mockVehicles = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    licensePlate: 'А123БВ777',
    vin: 'JT2BF18K9X0123456',
    color: 'Белый',
    mileage: 45000,
    engineType: 'Бензин',
    transmission: 'Автомат',
    owner: 'Алексей Иванов',
    ownerId: 1,
    lastService: '2025-11-05T14:30:00',
    nextService: '2025-12-05',
    servicesCount: 5,
    status: 'active',
  },
  {
    id: 2,
    brand: 'BMW',
    model: 'X5',
    year: 2018,
    licensePlate: 'В456ГД777',
    vin: 'WBAKB6C50BE123456',
    color: 'Черный',
    mileage: 78000,
    engineType: 'Дизель',
    transmission: 'Автомат',
    owner: 'Алексей Иванов',
    ownerId: 1,
    lastService: '2025-10-20T10:00:00',
    nextService: '2025-11-20',
    servicesCount: 8,
    status: 'active',
  },
  {
    id: 3,
    brand: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2021,
    licensePlate: 'С789ЕЖ777',
    vin: 'WDDZF4JB1LA123456',
    color: 'Серебристый',
    mileage: 32000,
    engineType: 'Бензин',
    transmission: 'Автомат',
    owner: 'Мария Петрова',
    ownerId: 2,
    lastService: '2025-11-03T10:15:00',
    nextService: '2026-01-03',
    servicesCount: 3,
    status: 'active',
  },
  {
    id: 4,
    brand: 'Volkswagen',
    model: 'Polo',
    year: 2017,
    licensePlate: 'Г012ЗИ777',
    vin: 'WVWZZZ6RZHY123456',
    color: 'Красный',
    mileage: 95000,
    engineType: 'Бензин',
    transmission: 'Механика',
    owner: 'Дмитрий Сидоров',
    ownerId: 4,
    lastService: '2025-10-20T12:00:00',
    nextService: '2025-11-20',
    servicesCount: 1,
    status: 'inactive',
  },
];

export const VehiclesList: React.FC = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      search === '' ||
      vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;

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
              <ShinyText text="Автомобили" speed={4} />
            </h1>
            <p className="text-[#8B95A5] mt-1">База данных автомобилей клиентов</p>
          </div>
          <Link
            to="/vehicles/new"
            className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-6 py-3 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all shadow-[0px_4px_12px_rgba(168,178,193,0.3)]"
          >
            + Добавить автомобиль
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-4">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <Input
                type="text"
                placeholder="Поиск по марке, модели, гос. номеру, VIN или владельцу..."
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

        {/* Vehicles grid */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)]">
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-20 text-[#8B95A5]">
              <p>Автомобили не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-6">
              {filteredVehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  to={`/vehicles/${vehicle.id}`}
                  className="block border border-[#2A2A2A] rounded-lg p-6 hover:border-[#A8B2C1] hover:shadow-[0px_4px_16px_rgba(168,178,193,0.2)] transition-all bg-[#0A0A0A]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] rounded-lg flex items-center justify-center">
                          <span className="text-3xl">🚗</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#E5E9ED]">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-[#A8B2C1] font-medium">
                              {vehicle.licensePlate}
                            </span>
                            <span className="text-sm text-[#8B95A5]">•</span>
                            <span className="text-sm text-[#8B95A5]">{vehicle.year} г.</span>
                            <span className="text-sm text-[#8B95A5]">•</span>
                            <span className="text-sm text-[#8B95A5]">{vehicle.color}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded ml-2 ${
                                vehicle.status === 'active'
                                  ? 'bg-green-900/20 text-green-400'
                                  : 'bg-gray-900/20 text-gray-400'
                              }`}
                            >
                              {vehicle.status === 'active' ? 'Активен' : 'Неактивен'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-[#8B95A5]">VIN</p>
                          <p className="font-medium text-[#E5E9ED] font-mono text-xs">
                            {vehicle.vin}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#8B95A5]">Владелец</p>
                          <Link
                            to={`/clients/${vehicle.ownerId}`}
                            className="font-medium text-[#A8B2C1] hover:text-[#E5E9ED] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {vehicle.owner}
                          </Link>
                        </div>
                        <div>
                          <p className="text-sm text-[#8B95A5]">Пробег</p>
                          <p className="font-medium text-[#E5E9ED]">
                            {vehicle.mileage.toLocaleString('ru-RU')} км
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-[#8B95A5]">
                        <span>⚙️ {vehicle.engineType}</span>
                        <span>🔧 {vehicle.transmission}</span>
                        <span>📊 {vehicle.servicesCount} обслуживаний</span>
                        <span>
                          Последний визит:{' '}
                          {format(new Date(vehicle.lastService), 'dd.MM.yyyy')}
                        </span>
                        <span>
                          Следующее ТО:{' '}
                          {format(new Date(vehicle.nextService), 'dd.MM.yyyy')}
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
