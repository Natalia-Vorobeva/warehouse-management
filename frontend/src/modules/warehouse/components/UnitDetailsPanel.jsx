// frontend/src/modules/warehouse/components/UnitDetailsPanel.jsx
import { useState } from 'react'
import { 
  ClipboardIcon, 
  ArrowRightIcon, 
  CalendarIcon,
  CubeIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export default function UnitDetailsPanel({ unit, onReserve, onFree, onMove }) {
  const [showMoveForm, setShowMoveForm] = useState(false)
  const [targetUnitCode, setTargetUnitCode] = useState('')

  if (!unit) {
    return (
      <div className="card p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👈</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Выберите ячейку</h3>
          <p className="text-sm text-gray-600">
            Нажмите на любую ячейку слева, чтобы увидеть детали и управлять ей
          </p>
        </div>
      </div>
    )
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(unit.code)
    toast.success(`Код ${unit.code} скопирован`)
  }

  const handleMove = () => {
    if (!targetUnitCode.trim()) {
      toast.error('Введите код целевой ячейки')
      return
    }

    // Здесь нужно найти ячейку по коду
    toast.success(`Запрос на перемещение в ${targetUnitCode} отправлен`)
    setShowMoveForm(false)
    setTargetUnitCode('')
  }

  const getTypeLabel = (type) => {
    switch(type) {
      case 'euro-pallet': return 'Европоддон'
      case 'us-pallet': return 'Американский поддон'
      case 'grid': return 'Сетка'
      case 'rack': return 'Стеллаж'
      default: return type
    }
  }

  const getStatusLabel = (status) => {
    switch(status) {
      case 'free': return 'Свободна'
      case 'occupied': return 'Занята'
      case 'reserved': return 'Зарезервирована'
      case 'maintenance': return 'На обслуживании'
      default: return status
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'free': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-red-100 text-red-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Ячейка {unit.code}</h3>
            <button
              onClick={handleCopyCode}
              className="p-1 hover:bg-gray-100 rounded"
              title="Скопировать код"
            >
              <ClipboardIcon className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <span className={`badge ${getStatusColor(unit.status)}`}>
            {getStatusLabel(unit.status)}
          </span>
        </div>
        <span className="text-2xl">
          {unit.type === 'euro-pallet' ? '🇪🇺' :
           unit.type === 'us-pallet' ? '🇺🇸' :
           unit.type === 'grid' ? '⬜' : '🗄️'}
        </span>
      </div>

      {/* Детали ячейки */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Тип</p>
            <p className="font-medium">{getTypeLabel(unit.type)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Расположение</p>
            <p className="font-medium">
              Секция {unit.location.section}, этаж {unit.location.floor}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Размеры</p>
            <p className="font-medium">
              {unit.dimensions.width}×{unit.dimensions.depth}×{unit.dimensions.height} мм
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Грузоподъемность</p>
            <p className="font-medium">{unit.maxWeight} кг</p>
          </div>
        </div>

        {/* Индикатор загрузки */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Загрузка</span>
            <span className="font-medium">
              {unit.currentWeight} / {unit.maxWeight} кг
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full"
              style={{ width: `${(unit.currentWeight / unit.maxWeight) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Продукция в ячейке */}
        {unit.productId && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CubeIcon className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Продукция</span>
            </div>
            <p className="text-sm text-blue-700">ID продукта: {unit.productId}</p>
          </div>
        )}
      </div>

      {/* Действия */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {unit.status === 'free' ? (
            <button
              onClick={() => onReserve && onReserve(unit.id)}
              className="btn-secondary w-full"
            >
              Зарезервировать
            </button>
          ) : (
            <button
              onClick={() => onFree && onFree(unit.id)}
              className="btn-primary w-full"
            >
              Освободить
            </button>
          )}

          <button
            onClick={() => setShowMoveForm(!showMoveForm)}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <ArrowRightIcon className="h-4 w-4" />
            Переместить
          </button>
        </div>

        {/* Форма перемещения */}
        {showMoveForm && (
          <div className="border border-gray-200 rounded-lg p-4 mt-3">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightIcon className="h-5 w-5 text-gray-500" />
              <h4 className="font-medium">Перемещение продукции</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="label">Код целевой ячейки</label>
                <input
                  type="text"
                  value={targetUnitCode}
                  onChange={(e) => setTargetUnitCode(e.target.value.toUpperCase())}
                  className="input-field"
                  placeholder="Например: A05"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleMove}
                  className="btn-primary flex-1"
                >
                  Подтвердить перемещение
                </button>
                <button
                  onClick={() => setShowMoveForm(false)}
                  className="btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* История */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <span>Создана: {new Date(unit.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}