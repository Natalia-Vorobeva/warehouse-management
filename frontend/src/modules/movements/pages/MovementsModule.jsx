// frontend/src/modules/movements/pages/MovementsModule.jsx
import { useState } from 'react'
import {
	TruckIcon,
	CalendarIcon,
	FunnelIcon,
	ArrowUpTrayIcon,
	ArrowDownTrayIcon,
	ArrowPathIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const mockMovements = [
	{ id: 1, type: 'incoming', product: 'Алюминиевый профиль 40мм', from: 'Поставщик', to: 'Склад А', quantity: 50, date: new Date(2024, 0, 15), status: 'completed' },
	{ id: 2, type: 'outgoing', product: 'Европоддон', from: 'Склад B', to: 'Клиент', quantity: 20, date: new Date(2024, 0, 16), status: 'completed' },
	{ id: 3, type: 'internal', product: 'Сетка металлическая', from: 'Склад A', to: 'Склад C', quantity: 15, date: new Date(2024, 0, 17), status: 'in-progress' },
	{ id: 4, type: 'production', product: 'Профиль 60мм', from: 'Цех 1', to: 'Склад B', quantity: 30, date: new Date(2024, 0, 18), status: 'completed' },
	{ id: 5, type: 'waste', product: 'Бракованный профиль', from: 'Контроль качества', to: 'Утилизация', quantity: 5, date: new Date(2024, 0, 19), status: 'pending' },
	{ id: 6, type: 'incoming', product: 'Американский поддон', from: 'Поставщик 2', to: 'Склад C', quantity: 40, date: new Date(2024, 0, 20), status: 'completed' },
]

export default function MovementsModule() {
	const [filterType, setFilterType] = useState('all')
	const [filterStatus, setFilterStatus] = useState('all')
	const [dateRange, setDateRange] = useState('week')

	const filteredMovements = mockMovements.filter(movement => {
		if (filterType !== 'all' && movement.type !== filterType) return false
		if (filterStatus !== 'all' && movement.status !== filterStatus) return false
		return true
	})

	const getTypeIcon = (type) => {
		switch (type) {
			case 'incoming': return <ArrowDownTrayIcon className="h-5 w-5 text-green-600" />
			case 'outgoing': return <ArrowUpTrayIcon className="h-5 w-5 text-red-600" />
			case 'internal': return <ArrowPathIcon className="h-5 w-5 text-blue-600" />
			case 'production': return '🏭'
			case 'waste': return '🗑️'
			default: return <TruckIcon className="h-5 w-5 text-gray-600" />
		}
	}

	const getTypeLabel = (type) => {
		switch (type) {
			case 'incoming': return 'Поступление'
			case 'outgoing': return 'Отгрузка'
			case 'internal': return 'Внутреннее'
			case 'production': return 'Производство'
			case 'waste': return 'Утилизация'
			default: return type
		}
	}

	const getStatusBadge = (status) => {
		switch (status) {
			case 'completed': return 'bg-green-100 text-green-800'
			case 'in-progress': return 'bg-yellow-100 text-yellow-800'
			case 'pending': return 'bg-blue-100 text-blue-800'
			default: return 'bg-gray-100 text-gray-800'
		}
	}

	const getStatusLabel = (status) => {
		switch (status) {
			case 'completed': return 'Завершено'
			case 'in-progress': return 'В процессе'
			case 'pending': return 'Ожидание'
			default: return status
		}
	}

	return (
		<div className="space-y-6">
			{/* Заголовок */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Управление перемещениями</h1>
					<p className="text-gray-600">Отслеживание движения продукции по складу и между участками</p>
				</div>

				<button className="btn-primary flex items-center gap-2">
					<TruckIcon className="h-5 w-5" />
					Новое перемещение
				</button>
			</div>

			{/* Фильтры */}
			<div className="bg-white rounded-xl p-4 border border-gray-200">
				<div className="flex items-center gap-2 mb-4">
					<FunnelIcon className="h-5 w-5 text-gray-500" />
					<span className="font-medium text-gray-700">Фильтры</span>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="label">Тип перемещения</label>
						<select
							value={filterType}
							onChange={(e) => setFilterType(e.target.value)}
							className="input-field"
						>
							<option value="all">Все типы</option>
							<option value="incoming">Поступления</option>
							<option value="outgoing">Отгрузки</option>
							<option value="internal">Внутренние</option>
							<option value="production">Производство</option>
							<option value="waste">Утилизация</option>
						</select>
					</div>

					<div>
						<label className="label">Статус</label>
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="input-field"
						>
							<option value="all">Все статусы</option>
							<option value="completed">Завершено</option>
							<option value="in-progress">В процессе</option>
							<option value="pending">Ожидание</option>
						</select>
					</div>

					<div>
						<label className="label">Период</label>
						<select
							value={dateRange}
							onChange={(e) => setDateRange(e.target.value)}
							className="input-field"
						>
							<option value="today">Сегодня</option>
							<option value="week">Неделя</option>
							<option value="month">Месяц</option>
							<option value="year">Год</option>
						</select>
					</div>

					<div className="self-end">
						<button
							onClick={() => {
								setFilterType('all')
								setFilterStatus('all')
								setDateRange('week')
							}}
							className="btn-secondary w-full"
						>
							Сбросить фильтры
						</button>
					</div>
				</div>
			</div>

			{/* Статистика */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white rounded-xl p-4 border border-gray-200">
					<div className="flex items-center gap-3">
						<div className="bg-green-100 p-2 rounded-lg">
							<ArrowDownTrayIcon className="h-6 w-6 text-green-600" />
						</div>
						<div>
							<p className="text-sm text-gray-600">Поступления</p>
							<p className="text-xl font-bold">
								{mockMovements.filter(m => m.type === 'incoming').length}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl p-4 border border-gray-200">
					<div className="flex items-center gap-3">
						<div className="bg-red-100 p-2 rounded-lg">
							<ArrowUpTrayIcon className="h-6 w-6 text-red-600" />
						</div>
						<div>
							<p className="text-sm text-gray-600">Отгрузки</p>
							<p className="text-xl font-bold">
								{mockMovements.filter(m => m.type === 'outgoing').length}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl p-4 border border-gray-200">
					<div className="flex items-center gap-3">
						<div className="bg-blue-100 p-2 rounded-lg">
							<ArrowPathIcon className="h-6 w-6 text-blue-600" />
						</div>
						<div>
							<p className="text-sm text-gray-600">Внутренние</p>
							<p className="text-xl font-bold">
								{mockMovements.filter(m => m.type === 'internal').length}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl p-4 border border-gray-200">
					<div className="flex items-center gap-3">
						<div className="bg-purple-100 p-2 rounded-lg">
							<TruckIcon className="h-6 w-6 text-purple-600" />
						</div>
						<div>
							<p className="text-sm text-gray-600">Всего за неделю</p>
							<p className="text-xl font-bold">{mockMovements.length}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Таблица перемещений */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Тип
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Продукция
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Откуда
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Куда
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Количество
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Дата
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Статус
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredMovements.map(movement => (
								<tr key={movement.id} className="hover:bg-gray-50">
									<td className="px-4 py-3 whitespace-nowrap min-w-[120px]">
										<div className="flex items-center gap-2">
											{getTypeIcon(movement.type)}
											<span className="font-medium text-sm">{getTypeLabel(movement.type)}</span>
										</div>
									</td>
									<td className="px-4 py-3 min-w-[180px]">
										<div className="font-medium text-gray-900 text-sm">{movement.product}</div>
									</td>
									<td className="px-4 py-3 whitespace-nowrap min-w-[100px]">
										<span className="text-gray-700 text-sm">{movement.from}</span>
									</td>
									<td className="px-4 py-3 whitespace-nowrap min-w-[100px]">
										<span className="text-gray-700 text-sm">{movement.to}</span>
									</td>
									<td className="px-4 py-3 whitespace-nowrap min-w-[90px]">
										<span className="font-medium text-sm">{movement.quantity} ед.</span>
									</td>
									<td className="px-4 py-3 whitespace-nowrap min-w-[110px]">
										<div className="flex items-center gap-2 text-gray-600 text-sm">
											<CalendarIcon className="h-4 w-4" />
											{format(movement.date, 'dd.MM.yy', { locale: ru })}
										</div>
									</td>
									<td className="px-4 py-3 whitespace-nowrap min-w-[100px]">
										<span className={`px-2 py-1 text-xs rounded ${getStatusBadge(movement.status)}`}>
											{getStatusLabel(movement.status)}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Если нет данных */}
				{filteredMovements.length === 0 && (
					<div className="text-center py-12">
						<TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">Нет перемещений</h3>
						<p className="text-gray-600">Настройте фильтры или создайте новое перемещение</p>
					</div>
				)}
			</div>
		</div>
	)
}