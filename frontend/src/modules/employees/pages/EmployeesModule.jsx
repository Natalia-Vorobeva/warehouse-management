// frontend/src/modules/employees/pages/EmployeesModule.jsx
import { useState } from 'react'
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const mockEmployees = [
  { id: 1, name: 'Иванов Иван Иванович', position: 'Начальник склада', department: 'Склад', email: 'ivanov@example.com', phone: '+7 (999) 123-45-67', status: 'active', shift: 'Дневная' },
  { id: 2, name: 'Петрова Анна Сергеевна', position: 'Кладовщик', department: 'Склад', email: 'petrova@example.com', phone: '+7 (999) 234-56-78', status: 'active', shift: 'Вечерняя' },
  { id: 3, name: 'Сидоров Алексей Петрович', position: 'Оператор ПК', department: 'Администрация', email: 'sidorov@example.com', phone: '+7 (999) 345-67-89', status: 'active', shift: 'Дневная' },
  { id: 4, name: 'Кузнецова Мария Владимировна', position: 'Бухгалтер', department: 'Бухгалтерия', email: 'kuznetsova@example.com', phone: '+7 (999) 456-78-90', status: 'active', shift: 'Дневная' },
  { id: 5, name: 'Васильев Дмитрий Николаевич', position: 'Грузчик', department: 'Склад', email: 'vasiliev@example.com', phone: '+7 (999) 567-89-01', status: 'inactive', shift: 'Ночная' },
  { id: 6, name: 'Николаева Елена Александровна', position: 'Менеджер по закупкам', department: 'Снабжение', email: 'nikolaeva@example.com', phone: '+7 (999) 678-90-12', status: 'active', shift: 'Дневная' },
]

export default function EmployeesModule() {
  const [search, setSearch] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const departments = [...new Set(mockEmployees.map(e => e.department))]
  
  const filteredEmployees = mockEmployees.filter(employee => {
    if (selectedDepartment !== 'all' && employee.department !== selectedDepartment) return false
    if (selectedStatus !== 'all' && employee.status !== selectedStatus) return false
    if (search && !employee.name.toLowerCase().includes(search.toLowerCase()) && 
        !employee.position.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление сотрудниками</h1>
          <p className="text-gray-600">Учет персонала, графики работы, доступ к системе</p>
        </div>
        
        <button className="btn-primary flex items-center gap-2">
          <UserPlusIcon className="h-5 w-5" />
          Добавить сотрудника
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по имени или должности..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="input-field"
        >
          <option value="all">Все отделы</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input-field"
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </select>
        
        <button
          onClick={() => {
            setSearch('')
            setSelectedDepartment('all')
            setSelectedStatus('all')
          }}
          className="btn-secondary"
        >
          Сбросить фильтры
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <IdentificationIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Всего сотрудников</p>
              <p className="text-xl font-bold">{mockEmployees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Активных</p>
              <p className="text-xl font-bold">
                {mockEmployees.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Смены</p>
              <p className="text-xl font-bold">
                {[...new Set(mockEmployees.map(e => e.shift))].length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <span className="text-purple-600 text-xl">🏢</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Отделов</p>
              <p className="text-xl font-bold">{departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Карточки сотрудников */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Заголовок карточки */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  employee.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {employee.status === 'active' ? 'Активен' : 'Неактивен'}
                </span>
              </div>
              
              {/* Информация о сотруднике */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {employee.department}
                  </span>
                  <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                    {employee.shift} смена
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{employee.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{employee.phone}</span>
                </div>
              </div>
              
              {/* Действия */}
              <div className="flex gap-2">
                <button className="btn-secondary flex-1 text-sm py-2">
                  Профиль
                </button>
                <button className="btn-primary flex-1 text-sm py-2">
                  Редактировать
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Если нет данных */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <UserPlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Сотрудники не найдены</h3>
          <p className="text-gray-600">Настройте фильтры или добавьте нового сотрудника</p>
        </div>
      )}
    </div>
  )
}