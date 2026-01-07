import {
  HomeIcon,
  BuildingStorefrontIcon,
  BuildingOffice2Icon,
  CubeIcon,
  ArrowsRightLeftIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

export const navigation = [
  { name: 'Дашборд', path: '/', icon: HomeIcon, exact: true },
  { name: 'Склад', path: '/warehouse', icon: BuildingStorefrontIcon },
  { name: 'Завод', path: '/factory', icon: BuildingOffice2Icon },
  { name: 'Инвентарь', path: '/inventory', icon: CubeIcon },
  { name: 'Движения', path: '/movements', icon: ArrowsRightLeftIcon },
  { name: 'Сотрудники', path: '/employees', icon: UsersIcon },
  { name: 'Отчеты', path: '/reports', icon: ChartBarIcon },
  { name: 'Настройки', path: '/settings', icon: Cog6ToothIcon },
]