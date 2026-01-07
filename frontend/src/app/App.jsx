import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from '../shared/components/Layout'
import Login from '../pages/Login'
import Dashboard from '../modules/dashboard/components/Dashboard'
import WarehouseModule from '../modules/warehouse/pages/WarehouseModule'
import FactoryModule from '../modules/factory/pages/FactoryModule'
import InventoryModule from '../modules/inventory/pages/InventoryModule'
import MovementsModule from '../modules/movements/pages/MovementsModule'
import EmployeesModule from '../modules/employees/pages/EmployeesModule'
import ReportsModule from '../modules/reports/pages/ReportsModule'
import SettingsModule from '../modules/settings/pages/SettingsModule'

function App() {
	return (
		<>
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 4000,
					style: {
						background: '#363636',
						color: '#fff',
					},
					success: {
						duration: 3000,
						iconTheme: {
							primary: '#10b981',
							secondary: '#fff',
						},
					},
					error: {
						duration: 4000,
						iconTheme: {
							primary: '#ef4444',
							secondary: '#fff',
						},
					},
				}}
			/>

			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
					
					<Route path="/" element={<Layout />}>
						<Route index element={<Dashboard />} />
						<Route path="warehouse" element={<WarehouseModule />} />
						<Route path="factory" element={<FactoryModule />} />
						<Route path="inventory" element={<InventoryModule />} />
						<Route path="movements" element={<MovementsModule />} />
						<Route path="employees" element={<EmployeesModule />} />
						<Route path="reports" element={<ReportsModule />} />
						<Route path="settings" element={<SettingsModule />} />
					</Route>
				</Routes>
			</Router>
		</>
	)
}

export default App