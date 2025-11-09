import React, { useState } from 'react';
import { CRMLayout } from '../components/crm/CRMLayout';
import { Input } from '../components/shared/Input';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import ShinyText from '../components/ShinyText';

// Mock data for demonstration
const mockParts = [
  {
    id: 1,
    article: 'OE-12345',
    name: 'Масляный фильтр',
    brand: 'Mann Filter',
    category: 'Фильтры',
    price: 450,
    quantity: 25,
    minQuantity: 10,
    location: 'Склад А, Полка 3',
    supplier: 'ООО "АвтоЗапчасти"',
    lastRestocked: '2025-11-01',
  },
  {
    id: 2,
    article: 'BR-45678',
    name: 'Тормозные колодки передние',
    brand: 'Brembo',
    category: 'Тормозная система',
    price: 3500,
    quantity: 8,
    minQuantity: 5,
    location: 'Склад Б, Полка 12',
    supplier: 'ООО "Бремо Партс"',
    lastRestocked: '2025-10-28',
  },
  {
    id: 3,
    article: 'SP-78901',
    name: 'Свеча зажигания',
    brand: 'NGK',
    category: 'Система зажигания',
    price: 280,
    quantity: 3,
    minQuantity: 12,
    location: 'Склад А, Полка 5',
    supplier: 'ООО "Мото Дилер"',
    lastRestocked: '2025-09-15',
  },
  {
    id: 4,
    article: 'OIL-23456',
    name: 'Моторное масло 5W-30 (4л)',
    brand: 'Castrol',
    category: 'Масла и жидкости',
    price: 2400,
    quantity: 45,
    minQuantity: 15,
    location: 'Склад А, Полка 1',
    supplier: 'ООО "Ойл Трейд"',
    lastRestocked: '2025-11-05',
  },
  {
    id: 5,
    article: 'AF-34567',
    name: 'Воздушный фильтр',
    brand: 'Bosch',
    category: 'Фильтры',
    price: 650,
    quantity: 18,
    minQuantity: 8,
    location: 'Склад А, Полка 3',
    supplier: 'ООО "АвтоЗапчасти"',
    lastRestocked: '2025-10-30',
  },
];

const categories = ['Все', 'Фильтры', 'Тормозная система', 'Система зажигания', 'Масла и жидкости'];

export const SpareParts: React.FC = () => {
  const [parts, setParts] = useState(mockParts);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Все');

  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      search === '' ||
      part.article.toLowerCase().includes(search.toLowerCase()) ||
      part.name.toLowerCase().includes(search.toLowerCase()) ||
      part.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'Все' || part.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const lowStockParts = parts.filter((part) => part.quantity < part.minQuantity);
  const totalValue = parts.reduce((sum, part) => sum + part.price * part.quantity, 0);

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              <ShinyText text="Склад запчастей" speed={4} />
            </h1>
            <p className="text-[#8B95A5] mt-1">Управление запасами автозапчастей</p>
          </div>
          <button className="bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] px-6 py-3 rounded-lg font-semibold hover:from-[#A8B2C1] hover:to-[#E5E9ED] transition-all shadow-[0px_4px_12px_rgba(168,178,193,0.3)]">
            + Добавить запчасть
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Всего позиций</p>
            <p className="text-2xl font-bold text-[#E5E9ED] mt-1">{parts.length}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Общая стоимость</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {totalValue.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Заканчивается</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{lowStockParts.length}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-[#8B95A5]">Категорий</p>
            <p className="text-2xl font-bold text-[#A8B2C1] mt-1">{categories.length - 1}</p>
          </div>
        </div>

        {/* Low stock alert */}
        {lowStockParts.length > 0 && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-red-400 font-bold mb-2">
                  Внимание! {lowStockParts.length} позиций заканчивается на складе
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lowStockParts.map((part) => (
                    <span
                      key={part.id}
                      className="text-sm px-3 py-1 bg-red-900/30 text-red-300 rounded"
                    >
                      {part.name} ({part.quantity} шт.)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)] p-4">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <Input
                type="text"
                placeholder="Поиск по артикулу, названию или бренду..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category filter */}
            <div>
              <p className="text-sm text-[#8B95A5] mb-2">Категория:</p>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      categoryFilter === category
                        ? 'bg-gradient-to-r from-[#8B95A5] to-[#A8B2C1] text-[#0A0A0A] shadow-[0px_4px_12px_rgba(168,178,193,0.3)]'
                        : 'bg-[#0A0A0A] text-[#E5E9ED] hover:bg-[#2A2A2A] hover:text-[#A8B2C1] border border-[#2A2A2A]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Parts table */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-[0px_4px_20px_rgba(139,149,165,0.1)]">
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : filteredParts.length === 0 ? (
            <div className="text-center py-20 text-[#8B95A5]">
              <p>Запчасти не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0A0A0A]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">
                      Артикул
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">
                      Название
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">
                      Бренд
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">
                      Категория
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">
                      Цена
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">
                      Остаток
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">
                      Расположение
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredParts.map((part) => {
                    const isLowStock = part.quantity < part.minQuantity;
                    return (
                      <tr key={part.id} className="hover:bg-[#0A0A0A] transition-colors">
                        <td className="px-4 py-4 text-sm font-mono text-[#A8B2C1]">
                          {part.article}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-[#E5E9ED]">
                          {part.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#E5E9ED]">{part.brand}</td>
                        <td className="px-4 py-4 text-sm text-[#8B95A5]">{part.category}</td>
                        <td className="px-4 py-4 text-sm font-medium text-[#E5E9ED]">
                          {part.price.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium ${
                                isLowStock ? 'text-red-400' : 'text-green-400'
                              }`}
                            >
                              {part.quantity} шт.
                            </span>
                            {isLowStock && (
                              <span className="text-xs px-2 py-1 rounded bg-red-900/20 text-red-400">
                                ⚠️ Мало
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#8B95A5]">{part.location}</td>
                        <td className="px-4 py-4 text-sm">
                          <button className="text-[#A8B2C1] hover:text-[#E5E9ED] mr-3">
                            Изменить
                          </button>
                          <button className="text-green-400 hover:text-green-300">
                            Заказать
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </CRMLayout>
  );
};
