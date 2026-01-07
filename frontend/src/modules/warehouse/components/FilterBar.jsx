// frontend/src/modules/warehouse/components/FilterBar.jsx
import { FunnelIcon } from '@heroicons/react/24/outline'

export default function FilterBar({ filters, onFilterChange, units = [] }) {
  // Получаем уникальные значения для фильтров
  const floors = [...new Set(units.map(u => u.location.floor))].sort()
  const sections = [...new Set(units.map(u => u.location.section))].sort()
  const types = [...new Set(units.map(u => u.type))].sort()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">Фильтры</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Фильтр по статусу */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Статус</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="input-field text-sm py-1.5"
            >
              <option value="all">Все статусы</option>
              <option value="free">Свободно</option>
              <option value="occupied">Занято</option>
              <option value="reserved">Зарезервировано</option>
              <option value="maintenance">На обслуживании</option>
            </select>
          </div>

          {/* Фильтр по типу */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Тип</label>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
              className="input-field text-sm py-1.5"
            >
              <option value="all">Все типы</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'euro-pallet' ? 'Европоддон' :
                   type === 'us-pallet' ? 'Американский поддон' :
                   type === 'grid' ? 'Сетка' :
                   type === 'rack' ? 'Стеллаж' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Фильтр по этажу */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Этаж</label>
            <select
              value={filters.floor}
              onChange={(e) => onFilterChange({ ...filters, floor: e.target.value })}
              className="input-field text-sm py-1.5"
            >
              <option value="all">Все этажи</option>
              {floors.map(floor => (
                <option key={floor} value={floor}>{floor} этаж</option>
              ))}
            </select>
          </div>

          {/* Фильтр по секции */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Секция</label>
            <select
              value={filters.section}
              onChange={(e) => onFilterChange({ ...filters, section: e.target.value })}
              className="input-field text-sm py-1.5"
            >
              <option value="all">Все секции</option>
              {sections.map(section => (
                <option key={section} value={section}>Секция {section}</option>
              ))}
            </select>
          </div>

          {/* Кнопка сброса */}
          <div className="self-end">
            <button
              onClick={() => onFilterChange({
                status: 'all',
                type: 'all',
                floor: 'all',
                section: 'all'
              })}
              className="btn-secondary text-sm py-1.5 px-3"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}