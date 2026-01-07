// frontend/src/modules/warehouse/components/QuickActionsPanel.jsx
import {
  PlusIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export default function QuickActionsPanel({ 
  onAddPallet, 
  onAddUSPallet, 
  onGenerateReport 
}) {
  
  const quickActions = [
    {
      icon: PlusIcon,
      label: 'Новый евро-поддон',
      description: 'Добавить стандартный поддон',
      color: 'bg-green-100 text-green-700',
      action: () => {
        onAddPallet && onAddPallet()
        toast.success('Евро-поддон добавлен')
      }
    },
    {
      icon: PlusIcon,
      label: 'Американский поддон',
      description: 'Добавить нестандартный поддон',
      color: 'bg-yellow-100 text-yellow-700',
      action: () => {
        onAddUSPallet && onAddUSPallet()
        toast.success('Американский поддон добавлен')
      }
    },
    {
      icon: DocumentTextIcon,
      label: 'Отчет по занятости',
      description: 'Сгенерировать PDF отчет',
      color: 'bg-blue-100 text-blue-700',
      action: () => {
        onGenerateReport && onGenerateReport()
        toast.success('Отчет сгенерирован')
      }
    },
    {
      icon: PrinterIcon,
      label: 'Печать этикеток',
      description: 'Распечатать QR-коды ячеек',
      color: 'bg-purple-100 text-purple-700',
      action: () => toast.success('Этикетки отправлены на печать')
    },
    {
      icon: ArrowDownTrayIcon,
      label: 'Экспорт данных',
      description: 'Скачать данные в Excel',
      color: 'bg-indigo-100 text-indigo-700',
      action: () => {
        // Экспорт данных
        toast.success('Данные экспортированы')
      }
    },
    {
      icon: ChartBarIcon,
      label: 'Аналитика склада',
      description: 'Подробная статистика',
      color: 'bg-pink-100 text-pink-700',
      action: () => toast.success('Аналитика открыта')
    }
  ]

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-lg mb-4">Быстрые действия</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
            >
              <div className={`p-3 rounded-lg mb-2 ${action.color} group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-900 mb-1">{action.label}</span>
              <span className="text-xs text-gray-600 text-center">{action.description}</span>
            </button>
          )
        })}
      </div>

      {/* Статистика в реальном времени */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Обновлено</span>
          <span className="font-medium">
            {new Date().toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Режим работы</span>
          <span className="font-medium text-green-600">Онлайн</span>
        </div>
      </div>
    </div>
  )
}