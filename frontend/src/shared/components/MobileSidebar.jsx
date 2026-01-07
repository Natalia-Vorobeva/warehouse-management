// frontend/src/shared/components/layout/MobileSidebar.jsx
import { NavLink } from 'react-router-dom'
import {
	HomeIcon,
	BuildingStorefrontIcon,
	BuildingOffice2Icon,
	CubeIcon,
	TruckIcon,
	UsersIcon,
	ChartBarIcon,
	Cog6ToothIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'

const navigation = [
	{ name: 'Дашборд', href: '/', icon: HomeIcon },
	{ name: 'Склад', href: '/warehouse', icon: BuildingStorefrontIcon },
	{ name: 'Завод', href: '/factory', icon: BuildingOffice2Icon },
	{ name: 'Инвентарь', href: '/inventory', icon: CubeIcon },
	{ name: 'Перемещения', href: '/movements', icon: TruckIcon },
	{ name: 'Сотрудники', href: '/employees', icon: UsersIcon },
	{ name: 'Отчеты', href: '/reports', icon: ChartBarIcon },
	{ name: 'Настройки', href: '/settings', icon: Cog6ToothIcon },
]

export default function MobileSidebar({ onClose }) {
	return (
		<div className="relative z-40 md:hidden">
			<div className="fixed inset-0 flex z-40">
				{/* Панель */}
				<div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
					<div className="absolute top-0 right-0 -mr-12 pt-2">
						<button
							onClick={onClose}
							className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						>
							<XMarkIcon className="h-6 w-6 text-white" />
						</button>
					</div>

					<div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
						<div className="flex-shrink-0 flex items-center px-4">
							<div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
								<span className="text-white font-bold text-lg">W</span>
							</div>
							<h1 className="text-lg font-bold text-gray-900">Warehouse</h1>
						</div>

						<nav className="mt-5 px-2 space-y-1">
							{navigation.map((item) => {
								const Icon = item.icon
								return (
									<NavLink
										key={item.name}
										to={item.href}
										onClick={onClose}
										className={({ isActive }) =>
											`group flex items-center px-3 py-2 text-base font-medium rounded-lg ${isActive
												? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
												: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
											}`
										}
									>
										<Icon
											className={`mr-3 h-5 w-5 ${window.location.pathname === item.href
													? 'text-primary-600'
													: 'text-gray-400 group-hover:text-gray-500'
												}`}
										/>
										{item.name}
									</NavLink>
								)
							})}
						</nav>
					</div>

					<div className="flex-shrink-0 flex border-t border-gray-200 p-4">
						<div className="flex items-center">
							<div>
								<p className="text-sm font-medium text-gray-700">Локальный режим</p>
								<p className="text-xs text-gray-500">Данные в браузере</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}