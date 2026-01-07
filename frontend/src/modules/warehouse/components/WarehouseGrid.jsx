import { useEffect, useState } from 'react'
import { supabase, subscribeToTable } from '../../../lib/supabase'
import { WarehouseCell } from './WarehouseCell'
import { WarehouseStats } from './WarehouseStats'
import { FilterBar } from './FilterBar'
import { toast } from 'react-hot-toast'

export default function WarehouseGrid({ warehouseId }) {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCell, setSelectedCell] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    floor: 'all'
  })

  useEffect(() => {
    loadUnits()
    
    // Подписка на изменения в реальном времени
    const subscription = subscribeToTable('storage_units', (payload) => {
      console.log('Изменение в складе:', payload)
      
      // Обновляем локальное состояние
      if (payload.eventType === 'INSERT') {
        setUnits(prev => [...prev, payload.new])
        toast.success('Новая ячейка добавлена')
      } else if (payload.eventType === 'UPDATE') {
        setUnits(prev => prev.map(u => 
          u.id === payload.new.id ? payload.new : u
        ))
        toast.success('Ячейка обновлена')
      } else if (payload.eventType === 'DELETE') {
        setUnits(prev => prev.filter(u => u.id !== payload.old.id))
        toast.success('Ячейка удалена')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [warehouseId])

  const loadUnits = async () => {
    try {
      let query = supabase
        .from('storage_units')
        .select('*')
        .eq('warehouse_id', warehouseId)
      
      // Применяем фильтры
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type)
      }
      if (filters.floor !== 'all') {
        query = query.eq('location->>floor', filters.floor)
      }
      
      const { data, error } = await query.order('code')
      
      if (error) throw error
      setUnits(data || [])
    } catch (error) {
      console.error('Ошибка загрузки ячеек:', error)
      toast.error('Не удалось загрузить данные склада')
    } finally {
      setLoading(false)
    }
  }

  const handleCellSelect = (cell) => {
    setSelectedCell(cell)
  }

  const handleAddPallet = async (unitData) => {
    try {
      const { error } = await supabase
        .from('storage_units')
        .insert([{
          ...unitData,
          warehouse_id: warehouseId,
          status: 'occupied'
        }])
      
      if (error) throw error
      toast.success('Поддон добавлен')
    } catch (error) {
      console.error('Ошибка добавления поддона:', error)
      toast.error('Не удалось добавить поддон')
    }
  }

  const handleMoveProduct = async (fromUnitId, toUnitId, productId, quantity) => {
    try {
      // 1. Освобождаем исходную ячейку
      await supabase
        .from('storage_units')
        .update({ status: 'free', product_id: null, current_weight: 0 })
        .eq('id', fromUnitId)
      
      // 2. Занимаем целевую ячейку
      await supabase
        .from('storage_units')
        .update({ 
          status: 'occupied', 
          product_id: productId, 
          current_weight: quantity 
        })
        .eq('id', toUnitId)
      
      // 3. Записываем перемещение
      await supabase
        .from('movements')
        .insert([{
          from_unit_id: fromUnitId,
          to_unit_id: toUnitId,
          product_id: productId,
          quantity,
          movement_type: 'internal',
          user_id: (await supabase.auth.getUser()).data.user.id
        }])
      
      toast.success('Перемещение выполнено')
    } catch (error) {
      console.error('Ошибка перемещения:', error)
      toast.error('Не удалось выполнить перемещение')
    }
  }

  const filteredUnits = units.filter(unit => {
    if (filters.status !== 'all' && unit.status !== filters.status) return false
    if (filters.type !== 'all' && unit.type !== filters.type) return false
    if (filters.floor !== 'all' && unit.location?.floor !== filters.floor) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <WarehouseStats units={units} />
      
      <FilterBar filters={filters} onFilterChange={setFilters} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Сетка ячеек */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Планировка склада</h3>
              <p className="text-sm text-gray-600">
                Всего ячеек: {units.length} | Свободно: {units.filter(u => u.status === 'free').length}
              </p>
            </div>
            
            <div className="overflow-auto">
              <div className="inline-grid grid-cols-10 gap-2 p-2">
                {filteredUnits.map(unit => (
                  <WarehouseCell
                    key={unit.id}
                    unit={unit}
                    isSelected={selectedCell?.id === unit.id}
                    onSelect={handleCellSelect}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Панель управления */}
        <div className="space-y-6">
          <div className="card p-4">
            <h3 className="font-semibold text-lg mb-4">Управление ячейкой</h3>
            {selectedCell ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Код ячейки</div>
                  <div className="font-medium text-lg">{selectedCell.code}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Тип</div>
                  <div className="font-medium">{selectedCell.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Статус</div>
                  <span className={`badge badge-${selectedCell.status === 'occupied' ? 'error' : 
                    selectedCell.status === 'reserved' ? 'warning' : 'success'}`}>
                    {selectedCell.status === 'occupied' ? 'Занята' : 
                     selectedCell.status === 'reserved' ? 'Зарезервирована' : 'Свободна'}
                  </span>
                </div>
                <button className="btn-secondary w-full">
                  Подробнее
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Выберите ячейку для управления
              </div>
            )}
          </div>
          
          <div className="card p-4">
            <h3 className="font-semibold text-lg mb-4">Быстрые действия</h3>
            <div className="space-y-2">
              <button className="btn-primary w-full">
                Добавить новый поддон
              </button>
              <button className="btn-secondary w-full">
                Резервировать ячейку
              </button>
              <button className="btn-secondary w-full">
                Отчет по занятости
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}