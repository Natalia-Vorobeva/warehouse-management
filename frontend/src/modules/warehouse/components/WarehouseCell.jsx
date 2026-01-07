export default function WarehouseCell({ unit, scale = 1, isSelected, onClick }) {
  const getCellStyles = () => {
    const baseSize = 60 * scale
    const styles = {
      width: `${baseSize}px`,
      height: `${baseSize}px`,
    }
    
    // Цвет в зависимости от статуса
    if (unit.status === 'occupied') {
      styles.backgroundColor = '#fee2e2'
      styles.borderColor = '#ef4444'
    } else if (unit.status === 'reserved') {
      styles.backgroundColor = '#fef3c7'
      styles.borderColor = '#f59e0b'
    } else if (unit.status === 'maintenance') {
      styles.backgroundColor = '#e5e7eb'
      styles.borderColor = '#6b7280'
    } else {
      styles.backgroundColor = '#d1fae5'
      styles.borderColor = '#10b981'
    }
    
    if (isSelected) {
      styles.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)'
      styles.transform = 'scale(1.05)'
      styles.zIndex = '10'
    }
    
    return styles
  }
  
  const getTypeIcon = () => {
    switch(unit.type) {
      case 'euro-pallet': return '🇪🇺'
      case 'us-pallet': return '🇺🇸'
      case 'grid': return '⬜'
      case 'rack': return '🗄️'
      default: return '📦'
    }
  }
  
  const getStatusLabel = () => {
    switch(unit.status) {
      case 'free': return 'Св.'
      case 'occupied': return 'Зан.'
      case 'reserved': return 'Рез.'
      case 'maintenance': return 'Рем.'
      default: return unit.status
    }
  }
  
  const getStatusColor = () => {
    switch(unit.status) {
      case 'free': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-red-100 text-red-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div
      className="relative border-2 rounded-md cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-1"
      style={getCellStyles()}
      onClick={onClick}
      title={`${unit.code} - ${unit.type} - ${unit.status}`}
    >
      {/* Код ячейки */}
      <div className="text-xs font-semibold text-gray-700 absolute top-1 left-1">
        {unit.code}
      </div>
      
      {/* Иконка типа */}
      <div className="text-lg mb-1">
        {getTypeIcon()}
      </div>
      
      {/* Индикатор загрузки */}
      {unit.currentWeight > 0 && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      )}
      
      {/* Вес */}
      <div className="text-[10px] text-gray-600">
        {unit.currentWeight}/{unit.maxWeight}кг
      </div>
      
      {/* Статус */}
      <div className={`text-[10px] font-medium absolute bottom-1 right-1 px-1 rounded ${getStatusColor()}`}>
        {getStatusLabel()}
      </div>
      
      {/* Этаж */}
      <div className="absolute bottom-1 left-1 text-[8px] text-gray-500">
        {unit.location.floor} эт.
      </div>
      
      {/* Выделение */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 rounded-md pointer-events-none"></div>
      )}
    </div>
  )
}