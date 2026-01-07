import { NavLink } from 'react-router-dom'
import { useWarehouseStore } from '../../modules/warehouse/store/warehouseStore'
import { navigation } from '../config/navigation'

export default function Sidebar({ isSidebarOpen, onClose }) {
  const { getWarehouseStats } = useWarehouseStore()
  const stats = getWarehouseStats()

  // Функция для обработки клика по ссылке
  const handleLinkClick = () => {
    // Закрываем сайдбар только на мобильных
    if (window.innerWidth < 768 && onClose) {
      onClose()
    }
  }

  return (
    <aside className={`
      w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] 
      fixed md:relative left-0 top-16 overflow-y-auto z-40
      transition-all duration-300 ease-in-out
      ${isSidebarOpen 
        ? 'translate-x-0' 
        : '-translate-x-full md:translate-x-0'
      }
      ${!isSidebarOpen ? 'md:w-0 md:overflow-hidden' : 'md:w-64'}
    `}>
      <div className="p-4 space-y-6">
        {/* Навигация */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5 text-gray-400" />
                {item.name}
              </NavLink>
            )
          })}
        </nav>

        {/* Статистика склада */}
        {isSidebarOpen && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Статистика склада
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Всего ячеек</span>
                <span className="text-sm font-semibold">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Свободно</span>
                <span className="text-sm font-semibold text-green-600">{stats.free}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Занято</span>
                <span className="text-sm font-semibold text-red-600">{stats.occupied}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}