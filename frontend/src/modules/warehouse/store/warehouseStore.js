import { create } from 'zustand'
import { persist } from 'zustand/middleware'


const generateMockData = (count = 50) => {
	const units = []
	const types = ['euro-pallet', 'us-pallet', 'grid', 'rack']
	const statuses = ['free', 'occupied', 'reserved']
	const rows = ['A', 'B', 'C', 'D']

	for (let i = 1; i <= count; i++) {
		const row = rows[Math.floor(Math.random() * rows.length)]
		const type = types[Math.floor(Math.random() * types.length)]
		const status = statuses[Math.floor(Math.random() * statuses.length)]

		units.push({
			id: `unit-${i}`,
			code: `${row}${String(i).padStart(2, '0')}`,
			type,
			status,
			dimensions: { width: 1200, height: 144, depth: 800 },
			location: {
				row,
				column: (i % 10) + 1,
				floor: Math.floor(i / 10) + 1,
				section: row < 'C' ? 'A' : 'B',
			},
			maxWeight: 1000,
			currentWeight: status === 'occupied' ? Math.floor(Math.random() * 800) + 200 : 0,
			productId: status === 'occupied' ? `prod-${Math.floor(Math.random() * 3) + 1}` : null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})
	}

	return units
}

export const useWarehouseStore = create(
	persist(
		(set, get) => ({
			storageUnits: generateMockData(50),
			selectedUnit: null,
			products: [
				{ id: 'prod-1', sku: 'PR-001', name: 'Алюминиевый профиль 40мм', type: 'finished', category: 'профиль', weight: 25, unit: 'кг', currentStock: 150 },
				{ id: 'prod-2', sku: 'PR-002', name: 'Европоддон 1200x800', type: 'raw', category: 'тара', weight: 25, unit: 'шт', currentStock: 200 },
				{ id: 'prod-3', sku: 'PR-003', name: 'Сетка металлическая', type: 'raw', category: 'тара', weight: 15, unit: 'шт', currentStock: 80 },
			],


			selectUnit: (unit) => set({ selectedUnit: unit }),

			addMovement: (movement) => set((state) => ({
				movements: [...state.movements, {
					...movement,
					id: `move-${Date.now()}`,
					createdAt: new Date().toISOString(),
				}]
			})),
			updateStorageUnit: (id, updates) => set((state) => ({
				storageUnits: state.storageUnits.map(unit =>
					unit.id === id ? { ...unit, ...updates, updatedAt: new Date().toISOString() } : unit
				)
			})),

			getWarehouseStats: () => {
				const units = get().storageUnits
				return {
					total: units.length,
					free: units.filter(u => u.status === 'free').length,
					occupied: units.filter(u => u.status === 'occupied').length,
					reserved: units.filter(u => u.status === 'reserved').length,
					maintenance: units.filter(u => u.status === 'maintenance').length,
				}
			},
		}),
		{
			name: 'warehouse-storage',
		}
	)
)