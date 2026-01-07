export const generateMockData = (count = 50) => {
  const units = []
  const types = ['euro-pallet', 'us-pallet', 'grid', 'rack', 'custom']
  const statuses = ['free', 'occupied', 'reserved', 'maintenance']
  const rows = ['A', 'B', 'C', 'D', 'E']
  
  for (let i = 1; i <= count; i++) {
    const row = rows[Math.floor(Math.random() * rows.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    units.push({
      id: `unit-${i}`,
      code: `${row}${String(i).padStart(2, '0')}`,
      type,
      status,
      dimensions: {
        width: type === 'euro-pallet' ? 1200 : type === 'us-pallet' ? 1219 : 800,
        height: type === 'euro-pallet' ? 144 : type === 'us-pallet' ? 144 : 2000,
        depth: type === 'euro-pallet' ? 800 : type === 'us-pallet' ? 1016 : 600,
      },
      location: {
        row,
        column: (i % 10) + 1,
        floor: Math.floor(i / 10) + 1,
        section: row < 'C' ? 'A' : 'B',
      },
      maxWeight: 1000,
      currentWeight: status === 'occupied' ? Math.floor(Math.random() * 800) + 200 : 0,
      productId: status === 'occupied' ? `prod-${Math.floor(Math.random() * 3) + 1}` : null,
      metadata: {},
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
  
  return units
}

export const generateMovements = (count = 20) => {
  const movements = []
  const movementTypes = ['incoming', 'outgoing', 'internal', 'production', 'waste']
  
  for (let i = 1; i <= count; i++) {
    movements.push({
      id: `move-${i}`,
      productId: `prod-${Math.floor(Math.random() * 3) + 1}`,
      fromUnitId: `unit-${Math.floor(Math.random() * 50) + 1}`,
      toUnitId: `unit-${Math.floor(Math.random() * 50) + 1}`,
      quantity: Math.floor(Math.random() * 100) + 1,
      movementType: movementTypes[Math.floor(Math.random() * movementTypes.length)],
      userId: 'user-1',
      status: 'completed',
      notes: `Перемещение #${i}`,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  
  return movements
}