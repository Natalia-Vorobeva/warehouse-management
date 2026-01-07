import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline'

export default function WarehouseStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Карточка: Всего ячеек */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Всего ячеек</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <span className="text-blue-600 text-xl">📊</span>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-xs text-green-600">+5.2% за месяц</span>
        </div>
      </div>

      {/* Карточка: Свободно */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Свободно</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.free}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <span className="text-green-600 text-xl">✅</span>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-xs text-green-600">Доступно для размещения</span>
        </div>
      </div>

      {/* Карточка: Занято */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Занято</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.occupied}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <span className="text-red-600 text-xl">📦</span>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-xs text-red-600">Загрузка {stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0}%</span>
        </div>
      </div>

      {/* Карточка: В резерве/ремонте */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Резерв/Ремонт</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.reserved + stats.maintenance}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <span className="text-yellow-600 text-xl">⚠️</span>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-xs text-gray-500">
            {stats.reserved} резерв • {stats.maintenance} ремонт
          </span>
        </div>
      </div>
    </div>
  )
}