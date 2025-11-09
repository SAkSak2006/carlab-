import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CRMLayout } from '../components/crm/CRMLayout';
import { StatusBadge } from '../components/shared/StatusBadge';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { Select } from '../components/shared/Select';
import { Input } from '../components/shared/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import { requestsApi } from '../services/api';
import { MASTERS, COMMON_SERVICES, STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../utils/constants';
import type { ServiceRequest, RequestWork } from '../types';
import { format } from 'date-fns';
import ShinyText from '../components/ShinyText';

export const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [newStatus, setNewStatus] = useState('');
  const [selectedMaster, setSelectedMaster] = useState('');
  const [progress, setProgress] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('');

  // Add work form
  const [workName, setWorkName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('');
  const [isAddingWork, setIsAddingWork] = useState(false);

  useEffect(() => {
    if (id) loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      setIsLoading(true);
      const data = await requestsApi.getRequest(id!);
      setRequest(data.request);
      setNewStatus(data.request.status);
      setSelectedMaster(data.request.assignedMaster || '');
      setProgress(data.request.progressPercentage);
      setPaymentStatus(data.request.paymentStatus);
    } catch (err: any) {
      setError('Ошибка загрузки заявки');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await requestsApi.updateStatus(id!, newStatus);
      await loadRequest();
      alert('Статус обновлен');
    } catch (err) {
      alert('Ошибка обновления статуса');
    }
  };

  const handleAssignMaster = async () => {
    try {
      await requestsApi.assignMaster(id!, selectedMaster);
      await loadRequest();
      alert('Мастер назначен');
    } catch (err) {
      alert('Ошибка назначения мастера');
    }
  };

  const handleUpdateProgress = async () => {
    try {
      await requestsApi.updateProgress(id!, progress);
      await loadRequest();
      alert('Прогресс обновлен');
    } catch (err) {
      alert('Ошибка обновления прогресса');
    }
  };

  const handleUpdatePayment = async () => {
    try {
      await requestsApi.updatePayment(id!, paymentStatus);
      await loadRequest();
      alert('Статус оплаты обновлен');
    } catch (err) {
      alert('Ошибка обновления статуса оплаты');
    }
  };

  const handleAddWork = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsAddingWork(true);
      await requestsApi.addWork(id!, {
        workName,
        quantity: parseFloat(quantity),
        unitPrice: parseFloat(unitPrice),
      });
      setWorkName('');
      setQuantity('1');
      setUnitPrice('');
      await loadRequest();
      alert('Работа добавлена');
    } catch (err) {
      alert('Ошибка добавления работы');
    } finally {
      setIsAddingWork(false);
    }
  };

  const handleDeleteWork = async (workId: string) => {
    if (!confirm('Удалить работу?')) return;
    try {
      await requestsApi.deleteWork(id!, workId);
      await loadRequest();
      alert('Работа удалена');
    } catch (err) {
      alert('Ошибка удаления работы');
    }
  };

  const handleQuickAddService = (serviceName: string, price: number) => {
    setWorkName(serviceName);
    setUnitPrice(price.toString());
  };

  if (isLoading) {
    return (
      <CRMLayout>
        <LoadingSpinner size="lg" className="mt-20" />
      </CRMLayout>
    );
  }

  if (error || !request) {
    return (
      <CRMLayout>
        <div className="text-center mt-20 text-red-400">{error || 'Заявка не найдена'}</div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link to="/requests" className="text-[#A8B2C1] hover:underline text-sm mb-2 inline-block">
              ← Назад к списку
            </Link>
            <h1 className="text-3xl font-bold">
              <ShinyText text={`Заявка #${request.requestNumber}`} speed={4} />
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge status={request.status} />
              <span className="text-sm text-[#8B95A5]">
                Создана: {format(new Date(request.createdAt), 'dd.MM.yyyy HH:mm')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#8B95A5]">Общая сумма</p>
            <p className="text-3xl font-bold text-[#E5E9ED]">
              {request.totalAmount.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Client & Vehicle info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client info */}
            <div className="bg-[#1A1A1A] rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#E5E9ED] mb-4">Информация о клиенте</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#8B95A5]">Имя</p>
                  <p className="font-medium">{request.client.firstName} {request.client.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8B95A5]">Телефон</p>
                  <p className="font-medium">{request.client.phone}</p>
                </div>
                {request.client.email && (
                  <div>
                    <p className="text-sm text-[#8B95A5]">Email</p>
                    <p className="font-medium">{request.client.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle info */}
            <div className="bg-[#1A1A1A] rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#E5E9ED] mb-4">Автомобиль</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#8B95A5]">Марка и модель</p>
                  <p className="font-medium">{request.vehicle.brand} {request.vehicle.model}</p>
                </div>
                {request.vehicle.year && (
                  <div>
                    <p className="text-sm text-[#8B95A5]">Год выпуска</p>
                    <p className="font-medium">{request.vehicle.year}</p>
                  </div>
                )}
                {request.vehicle.licensePlate && (
                  <div>
                    <p className="text-sm text-[#8B95A5]">Гос. номер</p>
                    <p className="font-medium">{request.vehicle.licensePlate}</p>
                  </div>
                )}
                {request.vehicle.vin && (
                  <div>
                    <p className="text-sm text-[#8B95A5]">VIN</p>
                    <p className="font-medium">{request.vehicle.vin}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#1A1A1A] rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#E5E9ED] mb-4">Описание проблемы</h2>
              <p className="text-[#A8B2C1]">{request.description}</p>
            </div>

            {/* Works/Services */}
            <div className="bg-[#1A1A1A] rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#E5E9ED] mb-4">Работы и услуги</h2>

              {/* Works table */}
              {request.works && request.works.length > 0 ? (
                <div className="overflow-x-auto mb-6">
                  <table className="w-full">
                    <thead className="bg-[#0A0A0A]">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#8B95A5]">Наименование</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#8B95A5]">Кол-во</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#8B95A5]">Цена</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-[#8B95A5]">Сумма</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {request.works.map((work) => (
                        <tr key={work.id}>
                          <td className="px-4 py-3 text-sm">{work.workName}</td>
                          <td className="px-4 py-3 text-sm">{work.quantity}</td>
                          <td className="px-4 py-3 text-sm">{work.unitPrice.toLocaleString('ru-RU')} ₽</td>
                          <td className="px-4 py-3 text-sm font-medium">{work.totalPrice.toLocaleString('ru-RU')} ₽</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleDeleteWork(work.id)}
                              className="text-red-400 hover:underline"
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[#8B95A5] mb-6">Работы еще не добавлены</p>
              )}

              {/* Add work form */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-[#E5E9ED] mb-3">Добавить работу</h3>

                {/* Quick services */}
                <div className="mb-4">
                  <p className="text-sm text-[#8B95A5] mb-2">Частые услуги:</p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_SERVICES.slice(0, 6).map((service) => (
                      <button
                        key={service.name}
                        onClick={() => handleQuickAddService(service.name, service.defaultPrice)}
                        className="px-3 py-1 text-sm bg-[#2A2A2A] hover:bg-gray-200 rounded transition"
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddWork} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Название работы"
                    value={workName}
                    onChange={(e) => setWorkName(e.target.value)}
                    required
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Количество"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Цена"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    required
                  />
                  <PrimaryButton type="submit" disabled={isAddingWork}>
                    {isAddingWork ? 'Добавление...' : 'Добавить'}
                  </PrimaryButton>
                </form>
              </div>
            </div>

            {/* Status history */}
            {request.statusHistory && request.statusHistory.length > 0 && (
              <div className="bg-[#1A1A1A] rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-[#E5E9ED] mb-4">История статусов</h2>
                <div className="space-y-3">
                  {request.statusHistory.map((history, index) => (
                    <div key={history.id || index} className="flex items-center gap-3 text-sm">
                      <span className="text-[#8B95A5]">
                        {format(new Date(history.createdAt), 'dd.MM.yyyy HH:mm')}
                      </span>
                      <span>→</span>
                      <span className="font-medium">{STATUS_LABELS[history.newStatus]}</span>
                      {history.changedBy && <span className="text-[#8B95A5]">({history.changedBy})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Actions */}
          <div className="space-y-6">
            {/* Update status */}
            <div className="bg-[#1A1A1A] rounded-lg shadow p-6">
              <h3 className="font-bold text-[#E5E9ED] mb-3">Изменить статус</h3>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { value: 'new', label: 'Новый' },
                  { value: 'in_progress', label: 'В работе' },
                  { value: 'completed', label: 'Завершен' },
                  { value: 'cancelled', label: 'Отменен' },
                ]}
                className="mb-3"
              />
              <PrimaryButton onClick={handleUpdateStatus} className="w-full">
                Сохранить статус
              </PrimaryButton>
            </div>

            {/* Assign master */}
            <div className="bg-[#1A1A1A] rounded-lg shadow p-6">
              <h3 className="font-bold text-[#E5E9ED] mb-3">Назначить мастера</h3>
              <Select
                value={selectedMaster}
                onChange={(e) => setSelectedMaster(e.target.value)}
                options={[
                  { value: '', label: 'Не назначен' },
                  ...MASTERS.map((m) => ({ value: m.name, label: `${m.name} (${m.specialization})` })),
                ]}
                className="mb-3"
              />
              <PrimaryButton onClick={handleAssignMaster} className="w-full">
                Назначить
              </PrimaryButton>
            </div>

            {/* Update progress */}
            <div className="bg-[#1A1A1A] rounded-lg shadow p-6">
              <h3 className="font-bold text-[#E5E9ED] mb-3">Прогресс выполнения</h3>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Прогресс</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <PrimaryButton onClick={handleUpdateProgress} className="w-full">
                Обновить прогресс
              </PrimaryButton>
            </div>

            {/* Payment status */}
            <div className="bg-[#1A1A1A] rounded-lg shadow p-6">
              <h3 className="font-bold text-[#E5E9ED] mb-3">Статус оплаты</h3>
              <Select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                options={[
                  { value: 'unpaid', label: 'Не оплачен' },
                  { value: 'partially_paid', label: 'Частично оплачен' },
                  { value: 'paid', label: 'Оплачен' },
                ]}
                className="mb-3"
              />
              <PrimaryButton onClick={handleUpdatePayment} className="w-full">
                Сохранить
              </PrimaryButton>
            </div>

            {/* Tracking link */}
            {request.trackingToken && (
              <div className="bg-[#1A1A1A] rounded-lg p-4">
                <h3 className="font-bold text-[#E5E9ED] mb-2 text-sm">Ссылка для отслеживания</h3>
                <a
                  href={`/track/${request.trackingToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A8B2C1] hover:underline text-sm break-all"
                >
                  {window.location.origin}/track/{request.trackingToken}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </CRMLayout>
  );
};
