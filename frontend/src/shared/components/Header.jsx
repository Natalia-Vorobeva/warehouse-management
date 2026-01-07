import { useState, useEffect } from 'react'
import { 
  BellIcon, 
  UserCircleIcon, 
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { navigation } from '../config/navigation'

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const [notifications, setNotifications] = useState(3)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    toast.success('Выход выполнен успешно')
    setUserMenuOpen(false)
    navigate('/login')
  }

  const handleClearNotifications = () => {
    setNotifications(0)
    toast.success('Уведомления очищены')
  }

  const handleQuickAction = (action) => {
    switch(action) {
      case 'new-movement':
        toast.success('Создано новое перемещение')
        navigate('/movements')
        break
      case 'add-product':
        toast.success('Добавлен новый товар')
        navigate('/inventory')
        break
      default:
        break
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Левая часть */}
          <div className="flex items-center">
            {/* Бургер для мобильного меню */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 mr-2"
              aria-label="Открыть меню"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
            
            {/* Бургер для сайдбара (десктоп) */}
            <button
              onClick={onToggleSidebar}
              className="hidden md:block p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 mr-2"
              aria-label="Переключить сайдбар"
            >
              {isSidebarOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden md:block">
                Warehouse Management
              </h1>
              <h1 className="text-xl font-bold text-gray-900 md:hidden">
                WMS
              </h1>
              <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded hidden md:block">
                v1.0.0
              </span>
            </div>
          </div>

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={handleClearNotifications}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
                aria-label="Уведомления"
              >
                <BellIcon className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                aria-label="Меню пользователя"
              >
                <div className="flex items-center">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <div className="hidden md:block ml-3 text-left">
                    <p className="text-sm font-medium text-gray-900">Наталья Воробьёва</p>
                    <p className="text-xs text-gray-500">Администратор</p>
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400 ml-2" />
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Наталья Воробьёва</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/employees?tab=profile')
                      setUserMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    📊 Мой профиль
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings')
                      setUserMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ⚙️ Настройки
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    🚪 Выйти из системы
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg animate-slideDown">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = item.exact 
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path)
                
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path)
                      setMobileMenuOpen(false)
                    }}
                    className={`
                      w-full flex items-center px-3 py-3 rounded-lg text-base font-medium
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-500' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                    {item.name}
                    {isActive && (
                      <span className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></span>
                    )}
                  </button>
                )
              })}
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Быстрые действия
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleQuickAction('new-movement')}
                    className="flex items-center justify-center p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Новое перемещение</span>
                  </button>
                  <button 
                    onClick={() => handleQuickAction('add-product')}
                    className="flex items-center justify-center p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Новый товар</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}