import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/shared/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import ShinyText from '../components/ShinyText';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка входа. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1A1A1A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.2)] border border-[#2A2A2A] p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <ShinyText text="CAR LAB" speed={3} className="text-5xl" />
            </h1>
            <p className="text-[#8B95A5] text-lg">Система управления</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="admin@carlab.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              label="Пароль"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <PrimaryButton type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </PrimaryButton>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
            <p className="text-sm text-[#A8B2C1] font-medium mb-1">Демо доступ:</p>
            <p className="text-xs text-[#8B95A5]">Email: admin@carlab.com</p>
            <p className="text-xs text-[#8B95A5]">Пароль: admin123</p>
          </div>

          {/* Link to public site */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[#A8B2C1] hover:text-[#E5E9ED] transition-colors">
              ← Вернуться на главную
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
