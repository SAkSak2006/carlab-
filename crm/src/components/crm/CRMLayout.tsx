import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ShinyText from '../ShinyText';
import { PrimaryButton } from '../PrimaryButton';

interface CRMLayoutProps {
  children: ReactNode;
}

export const CRMLayout: React.FC<CRMLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: 'dashboard', label: 'Панель управления' },
    { path: 'clients', label: 'Клиенты' },
    { path: 'vehicles', label: 'Автомобили' },
    { path: 'requests', label: 'Заявки' },
    { path: 'masters', label: 'Мастера' },
    { path: 'parts', label: 'Склад запчастей' },
    { path: 'settings', label: 'Настройки' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] shadow-[0px_4px_20px_rgba(139,149,165,0.1)]">
        <div className="p-6 border-b border-[#2A2A2A]">
          <h1 className="text-2xl font-bold">
            <ShinyText text="CAR LAB" speed={3} />
          </h1>
          <p className="text-xs text-[#8B95A5] mt-1">CRM СИСТЕМА</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const fullPath = `/crm/${item.path}`;
              const isActive = location.pathname === fullPath || location.pathname.startsWith(fullPath + '/');
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] font-semibold shadow-[0px_4px_12px_rgba(168,178,193,0.3)]'
                        : 'text-[#E5E9ED] hover:bg-[#2A2A2A] hover:text-[#A8B2C1]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-[#2A2A2A] bg-[#1A1A1A]">
          <div className="mb-4">
            <p className="text-sm font-medium text-[#E5E9ED]">{user?.fullName}</p>
            <p className="text-xs text-[#8B95A5]">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 border border-red-500/30 rounded-lg transition-all hover:border-red-400"
          >
            Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
