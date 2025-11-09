import React, { useState } from 'react';
import { CRMLayout } from '../components/crm/CRMLayout';
import { Input } from '../components/shared/Input';
import ShinyText from '../components/ShinyText';

type TabType = 'company' | 'users' | 'roles' | 'templates';

// Mock data
const mockCompanySettings = {
  name: 'CAR LAB',
  legalName: 'ООО "Автосервис Кар Лаб"',
  inn: '7701234567',
  kpp: '770101001',
  address: 'г. Москва, ул. Примерная, д. 1',
  phone: '+7 (495) 123-45-67',
  email: 'info@carlab.com',
  website: 'https://carlab.com',
  workingHours: 'Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00',
};

const mockUsers = [
  { id: 1, name: 'Администратор', email: 'admin@carlab.com', role: 'Администратор', status: 'active' },
  { id: 2, name: 'Иван Петров', email: 'ivan@carlab.com', role: 'Мастер', status: 'active' },
  { id: 3, name: 'Мария Сидорова', email: 'maria@carlab.com', role: 'Менеджер', status: 'active' },
];

const mockRoles = [
  { id: 1, name: 'Администратор', usersCount: 1, permissions: ['Полный доступ'] },
  { id: 2, name: 'Менеджер', usersCount: 5, permissions: ['Просмотр заявок', 'Создание заявок', 'Работа с клиентами'] },
  { id: 3, name: 'Мастер', usersCount: 10, permissions: ['Просмотр заявок', 'Обновление статуса работ'] },
  { id: 4, name: 'Наблюдатель', usersCount: 2, permissions: ['Только просмотр'] },
];

const mockTemplates = [
  { id: 1, name: 'Шаблон акта выполненных работ', type: 'Документ', lastModified: '2025-11-01' },
  { id: 2, name: 'Шаблон чека оплаты', type: 'Документ', lastModified: '2025-10-15' },
  { id: 3, name: 'Уведомление о готовности автомобиля', type: 'Email', lastModified: '2025-10-10' },
  { id: 4, name: 'SMS напоминание о записи', type: 'SMS', lastModified: '2025-09-20' },
];

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('company');
  const [companySettings, setCompanySettings] = useState(mockCompanySettings);

  const tabs = [
    { id: 'company' as TabType, label: 'Компания', icon: '🏢' },
    { id: 'users' as TabType, label: 'Пользователи', icon: '👥', count: mockUsers.length },
    { id: 'roles' as TabType, label: 'Роли', icon: '🔐', count: mockRoles.length },
    { id: 'templates' as TabType, label: 'Шаблоны', icon: '📝', count: mockTemplates.length },
  ];

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            <ShinyText text="Настройки" speed={4} />
          </h1>
          <p className="text-[#8B95A5] mt-1">Управление системой и настройками</p>
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
            {/* Company Tab */}
            {activeTab === 'company' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#E5E9ED] mb-4">Информация о компании</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Название компании"
                      value={companySettings.name}
                      onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                    />
                    <Input
                      label="Юридическое название"
                      value={companySettings.legalName}
                      onChange={(e) => setCompanySettings({ ...companySettings, legalName: e.target.value })}
                    />
                    <Input
                      label="ИНН"
                      value={companySettings.inn}
                      onChange={(e) => setCompanySettings({ ...companySettings, inn: e.target.value })}
                    />
                    <Input
                      label="КПП"
                      value={companySettings.kpp}
                      onChange={(e) => setCompanySettings({ ...companySettings, kpp: e.target.value })}
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Адрес"
                        value={companySettings.address}
                        onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Телефон"
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                    />
                    <Input
                      label="Веб-сайт"
                      value={companySettings.website}
                      onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                    />
                    <Input
                      label="Часы работы"
                      value={companySettings.workingHours}
                      onChange={(e) => setCompanySettings({ ...companySettings, workingHours: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-6 py-3 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all shadow-[0px_4px_12px_rgba(168,178,193,0.3)]">
                      Сохранить изменения
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#E5E9ED]">Пользователи системы</h3>
                  <button className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-4 py-2 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all">
                    + Добавить пользователя
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0A0A0A]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Имя</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Роль</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Статус</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#0A0A0A] transition-colors">
                          <td className="px-4 py-4 text-sm font-medium text-[#E5E9ED]">{user.name}</td>
                          <td className="px-4 py-4 text-sm text-[#A8B2C1]">{user.email}</td>
                          <td className="px-4 py-4 text-sm text-[#E5E9ED]">{user.role}</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 text-xs rounded bg-green-900/20 text-green-400">
                              Активен
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <button className="text-[#A8B2C1] hover:text-[#E5E9ED] mr-3">Редактировать</button>
                            <button className="text-red-400 hover:text-red-300">Удалить</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Roles Tab */}
            {activeTab === 'roles' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#E5E9ED]">Роли и права доступа</h3>
                  <button className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-4 py-2 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all">
                    + Создать роль
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {mockRoles.map((role) => (
                    <div
                      key={role.id}
                      className="border border-[#2A2A2A] rounded-lg p-6 bg-[#0A0A0A] hover:border-[#A8B2C1] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-[#E5E9ED]">{role.name}</h4>
                            <span className="text-sm text-[#8B95A5]">
                              {role.usersCount} {role.usersCount === 1 ? 'пользователь' : 'пользователей'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {role.permissions.map((permission, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 text-xs rounded bg-[#1A1A1A] text-[#A8B2C1] border border-[#2A2A2A]"
                              >
                                ✓ {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-[#A8B2C1] hover:text-[#E5E9ED] px-3 py-1">
                            Редактировать
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#E5E9ED]">Шаблоны документов и уведомлений</h3>
                  <button className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-4 py-2 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all">
                    + Создать шаблон
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {mockTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-[#2A2A2A] rounded-lg p-4 bg-[#0A0A0A] hover:border-[#A8B2C1] transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📝</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#E5E9ED]">{template.name}</h4>
                          <p className="text-sm text-[#8B95A5]">
                            {template.type} • Изменен: {template.lastModified}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-[#A8B2C1] hover:text-[#E5E9ED] px-3 py-1">
                          Редактировать
                        </button>
                        <button className="text-[#8B95A5] hover:text-[#E5E9ED] px-3 py-1">
                          Просмотр
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CRMLayout>
  );
};
