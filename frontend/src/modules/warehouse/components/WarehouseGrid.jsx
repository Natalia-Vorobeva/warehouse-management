// frontend/src/modules/warehouse/components/WarehouseGrid.jsx
import { useState, useEffect } from 'react'
import { useWarehouseStore } from '../store/warehouseStore'
import WarehouseStats from './WarehouseStats'
import FilterBar from './FilterBar'
import WarehouseCell from './WarehouseCell'
import UnitDetailsPanel from './UnitDetailsPanel'
import QuickActionsPanel from './QuickActionsPanel'
import { toast } from 'react-hot-toast'

export default function WarehouseGrid() {
  const {
    storageUnits,
    selectedUnit,
    selectUnit,
    updateStorageUnit,
    getWarehouseStats,
    addMovement,
    products,
  } = useWarehouseStore()
  
  const [filteredUnits, setFilteredUnits] = useState(storageUnits)
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    floor: 'all',
    section: 'all',
  })
  
  const [scale, setScale] = useState(1)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list' | '3d'
  const [isAddingPallet, setIsAddingPallet] = useState(false)
  
  // Применяем фильтры
  useEffect(() => {
    let result = storageUnits
    
    if (filters.status !== 'all') {
      result = result.filter(unit => unit.status === filters.status)
    }
    
    if (filters.type !== 'all') {
      result = result.filter(unit => unit.type === filters.type)
    }
    
    if (filters.floor !== 'all') {
      result = result.filter(unit => unit.location.floor.toString() === filters.floor)
    }
    
    if (filters.section !== 'all') {
      result = result.filter(unit => unit.location.section === filters.section)
    }
    
    setFilteredUnits(result)
  }, [storageUnits, filters])
  
  const handleCellClick = (unit) => {
    selectUnit(unit)
  }
  
  const handleAddPallet = (type = 'euro-pallet') => {
    const freeUnits = storageUnits.filter(u => u.status === 'free')
    
    if (freeUnits.length === 0) {
      toast.error('Нет свободных ячеек')
      return
    }
    
    const randomUnit = freeUnits[Math.floor(Math.random() * freeUnits.length)]
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    
    updateStorageUnit(randomUnit.id, {
      status: 'occupied',
      productId: randomProduct.id,
      currentWeight: Math.floor(Math.random() * 800) + 200,
    })
    
    // Добавляем запись о перемещении
    addMovement({
      productId: randomProduct.id,
      toUnitId: randomUnit.id,
      quantity: Math.floor(Math.random() * 100) + 1,
      movementType: 'incoming',
      notes: `Добавлен новый ${type} с продукцией "${randomProduct.name}"`,
    })
    
    toast.success(`Поддон добавлен в ячейку ${randomUnit.code}`)
  }
  
  const handleMoveProduct = (fromUnitId, toUnitId) => {
    const fromUnit = storageUnits.find(u => u.id === fromUnitId)
    const toUnit = storageUnits.find(u => u.id === toUnitId)
    
    if (!fromUnit || !toUnit) {
      toast.error('Ячейки не найдены')
      return
    }
    
    if (toUnit.status !== 'free') {
      toast.error('Целевая ячейка занята')
      return
    }
    
    // Освобождаем исходную ячейку
    updateStorageUnit(fromUnitId, {
      status: 'free',
      productId: null,
      currentWeight: 0,
    })
    
    // Занимаем целевую ячейку
    updateStorageUnit(toUnitId, {
      status: 'occupied',
      productId: fromUnit.productId,
      currentWeight: fromUnit.currentWeight,
    })
    
    // Записываем перемещение
    addMovement({
      productId: fromUnit.productId,
      fromUnitId,
      toUnitId,
      quantity: fromUnit.currentWeight,
      movementType: 'internal',
      notes: `Перемещение из ${fromUnit.code} в ${toUnit.code}`,
    })
    
    toast.success(`Продукция перемещена в ${toUnit.code}`)
  }
  
  const handleReserveUnit = (unitId) => {
    updateStorageUnit(unitId, { status: 'reserved' })
    toast.success('Ячейка зарезервирована')
  }
  
  const handleFreeUnit = (unitId) => {
    updateStorageUnit(unitId, {
      status: 'free',
      productId: null,
      currentWeight: 0,
    })
    toast.success('Ячейка освобождена')
  }
  
  const stats = getWarehouseStats()
  
  return (
    <div className="space-y-6">
      {/* Заголовок и управление */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Складская система</h1>
          <p className="text-gray-600">Управление ячейками хранения и перемещениями</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAddPallet('euro-pallet')}
            className="btn-primary flex items-center gap-2"
          >
            <span>+</span>
            Добавить евро-поддон
          </button>
          
          <button
            onClick={() => setIsAddingPallet(!isAddingPallet)}
            className="btn-secondary"
          >
            {isAddingPallet ? 'Отмена' : 'Добавить поддон'}
          </button>
        </div>
      </div>
      
      {/* Статистика */}
      <WarehouseStats stats={stats} />
      
      {/* Панель фильтров */}
      <FilterBar 
        filters={filters} 
        onFilterChange={setFilters}
        units={storageUnits}
      />
      
      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Сетка ячеек */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Планировка склада</h3>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScale(Math.max(0.5, scale - 0.2))}
                    className="p-1 rounded hover:bg-gray-100"
                    disabled={scale <= 0.5}
                  >
                    <span className="text-lg">−</span>
                  </button>
                  <span className="w-12 text-center text-sm">{scale.toFixed(1)}x</span>
                  <button
                    onClick={() => setScale(Math.min(2, scale + 0.2))}
                    className="p-1 rounded hover:bg-gray-100"
                    disabled={scale >= 2}
                  >
                    <span className="text-lg">+</span>
                  </button>
                </div>
                
                <div className="flex border rounded-lg overflow-hidden">
                  {['grid', 'list', '3d'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1 text-sm ${
                        viewMode === mode 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {mode === 'grid' ? 'Сетка' : 
                       mode === 'list' ? 'Список' : '3D'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Сетка ячеек */}
            {viewMode === 'grid' ? (
              <div className="overflow-auto max-h-[500px] p-2">
                <div className="grid grid-cols-8 md:grid-cols-10 gap-2">
                  {filteredUnits.map(unit => (
                    <WarehouseCell
                      key={unit.id}
                      unit={unit}
                      scale={scale}
                      isSelected={selectedUnit?.id === unit.id}
                      onClick={() => handleCellClick(unit)}
                    />
                  ))}
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <div className="overflow-auto max-h-[500px]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Код
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Тип
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Расположение
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Вес
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUnits.map(unit => (
                      <tr 
                        key={unit.id}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedUnit?.id === unit.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleCellClick(unit)}
                      >
                        <td className="px-3 py-2 whitespace-nowrap font-medium">
                          {unit.code}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            unit.type === 'euro-pallet' ? 'bg-green-100 text-green-800' :
                            unit.type === 'us-pallet' ? 'bg-yellow-100 text-yellow-800' :
                            unit.type === 'grid' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {unit.type === 'euro-pallet' ? 'Евро' :
                             unit.type === 'us-pallet' ? 'Американский' :
                             unit.type === 'grid' ? 'Сетка' : 'Стеллаж'}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            unit.status === 'free' ? 'bg-green-100 text-green-800' :
                            unit.status === 'occupied' ? 'bg-red-100 text-red-800' :
                            unit.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {unit.status === 'free' ? 'Свободна' :
                             unit.status === 'occupied' ? 'Занята' :
                             unit.status === 'reserved' ? 'Резерв' : 'Ремонт'}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          Секция {unit.location.section}, этаж {unit.location.floor}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {unit.currentWeight} / {unit.maxWeight} кг
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <p className="text-gray-600 mb-2">3D вид в разработке</p>
                  <p className="text-sm text-gray-500">Будет доступен после подключения Three.js</p>
                </div>
              </div>
            )}
            
            {/* Легенда */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Легенда</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
                  <span className="text-sm">Свободно</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-500 rounded"></div>
                  <span className="text-sm">Занято</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-500 rounded"></div>
                  <span className="text-sm">Зарезервировано</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-500 rounded"></div>
                  <span className="text-sm">На обслуживании</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Боковая панель */}
        <div className="space-y-6">
          <UnitDetailsPanel 
            unit={selectedUnit}
            onReserve={handleReserveUnit}
            onFree={handleFreeUnit}
            onMove={handleMoveProduct}
          />
          
          <QuickActionsPanel 
            onAddPallet={() => handleAddPallet('euro-pallet')}
            onAddUSPallet={() => handleAddPallet('us-pallet')}
            onGenerateReport={() => toast.success('Отчёт сгенерирован')}
          />
          
          {/* Статистика по типам */}
          <div className="card p-4">
            <h3 className="font-semibold text-lg mb-3">Распределение по типам</h3>
            <div className="space-y-2">
              {['euro-pallet', 'us-pallet', 'grid', 'rack'].map(type => {
                const count = storageUnits.filter(u => u.type === type).length
                const percent = (count / storageUnits.length * 100).toFixed(1)
                
                return (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {type === 'euro-pallet' ? 'Европоддоны' :
                       type === 'us-pallet' ? 'Американские' :
                       type === 'grid' ? 'Сетки' : 'Стеллажи'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-600"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}