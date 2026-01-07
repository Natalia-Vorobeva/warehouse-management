// frontend/src/modules/inventory/pages/InventoryModule.jsx
import { useState } from 'react'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  CubeIcon,
  TagIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

const mockProducts = [
  { id: 1, sku: 'PR-001', name: 'Алюминиевый профиль 40мм', type: 'finished', category: 'профиль', weight: 25, unit: 'кг', currentStock: 150, minStock: 50 },
  { id: 2, sku: 'PR-002', name: 'Европоддон 1200x800', type: 'raw', category: 'тара', weight: 25, unit: 'шт', currentStock: 200, minStock: 100 },
  { id: 3, sku: 'PR-003', name: 'Сетка металлическая', type: 'raw', category: 'тара', weight: 15, unit: 'шт', currentStock: 80, minStock: 40 },
  { id: 4, sku: 'PR-004', name: 'Профиль 60мм', type: 'finished', category: 'профиль', weight: 35, unit: 'кг', currentStock: 90, minStock: 30 },
  { id: 5, sku: 'PR-005', name: 'Американский поддон', type: 'raw', category: 'тара', weight: 30, unit: 'шт', currentStock: 120, minStock: 60 },
]

export default function InventoryModule() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = mockProducts.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false
    if (search && !product.name.toLowerCase().includes(search.toLowerCase()) && 
        !product.sku.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const categories = [...new Set(mockProducts.map(p => p.category))]

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление инвентарем</h1>
          <p className="text-gray-600">Учет продукции, материалов и сырья</p>
        </div>
        
        <button
          onClick={() => toast.success('Новый продукт добавлен')}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Добавить продукт
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по названию или SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field"
        >
          <option value="all">Все категории</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <button
          onClick={() => {
            setSearch('')
            setSelectedCategory('all')
          }}
          className="btn-secondary"
        >
          Сбросить фильтры
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CubeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Всего продуктов</p>
              <p className="text-xl font-bold">{mockProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TagIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Категорий</p>
              <p className="text-xl font-bold">{categories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <ScaleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Общий вес</p>
              <p className="text-xl font-bold">
                {mockProducts.reduce((sum, p) => sum + p.weight * p.currentStock, 0)} кг
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <span className="text-purple-600 text-xl">📦</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Низкий запас</p>
              <p className="text-xl font-bold text-red-600">
                {mockProducts.filter(p => p.currentStock < p.minStock).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица продуктов */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Вес (ед.)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Запас
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-medium">{product.sku}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      product.type === 'finished' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {product.type === 'finished' ? 'Готовая' : 'Сырье'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.weight} {product.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${
                            product.currentStock < product.minStock ? 'bg-red-500' :
                            product.currentStock < product.minStock * 2 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (product.currentStock / (product.minStock * 3)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className={`font-medium ${
                        product.currentStock < product.minStock ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {product.currentStock} ед.
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.currentStock < product.minStock ? (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        Низкий запас
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        В норме
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}