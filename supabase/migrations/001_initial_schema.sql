-- supabase/migrations/001_initial_schema.sql
-- Таблица предприятий (для мультитенантности)
CREATE TABLE tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Таблица пользователей (расширяет auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  role TEXT CHECK (role IN ('super_admin', 'tenant_admin', 'warehouse_manager', 'factory_worker', 'viewer')) DEFAULT 'viewer',
  full_name TEXT,
  department TEXT,
  phone TEXT,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Таблица складов
CREATE TABLE warehouses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  location TEXT,
  dimensions JSONB DEFAULT '{"width": 100, "height": 10, "depth": 50}',
  sections JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  capacity INTEGER,
  occupancy_rate DECIMAL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(tenant_id, code)
);

-- Таблица ячеек хранения
CREATE TABLE storage_units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  type TEXT CHECK (type IN ('euro-pallet', 'us-pallet', 'grid', 'rack', 'custom', 'floor')) NOT NULL,
  status TEXT CHECK (status IN ('free', 'occupied', 'reserved', 'maintenance')) DEFAULT 'free',
  dimensions JSONB NOT NULL,
  location JSONB NOT NULL,
  max_weight DECIMAL,
  current_weight DECIMAL DEFAULT 0,
  product_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(warehouse_id, code)
);

-- Таблица продукции
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('raw', 'finished', 'waste')) NOT NULL,
  category TEXT,
  dimensions JSONB,
  weight DECIMAL(10,2),
  unit TEXT DEFAULT 'kg',
  barcode TEXT,
  min_stock INTEGER DEFAULT 0,
  current_stock INTEGER DEFAULT 0,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Таблица перемещений
CREATE TABLE movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  product_id UUID REFERENCES products(id),
  from_unit_id UUID REFERENCES storage_units(id),
  to_unit_id UUID REFERENCES storage_units(id),
  quantity DECIMAL NOT NULL,
  movement_type TEXT CHECK (movement_type IN ('incoming', 'outgoing', 'internal', 'production', 'waste')) NOT NULL,
  user_id UUID REFERENCES auth.users,
  status TEXT DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Таблица смен
CREATE TABLE shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  shift_number INTEGER NOT NULL,
  shift_date DATE NOT NULL,
  team_leader_id UUID REFERENCES auth.users,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  production_data JSONB DEFAULT '{}',
  waste_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(tenant_id, shift_date, shift_number)
);

-- Таблица сотрудников на смене
CREATE TABLE shift_employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES auth.users,
  position TEXT,
  hours_worked DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- RLS (Row Level Security) политики
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_employees ENABLE ROW LEVEL SECURITY;

-- Политики для user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'super_admin'
  ));

-- Политики для warehouses
CREATE POLICY "Users can view warehouses of their tenant"
  ON warehouses FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM user_profiles WHERE id = auth.uid()
  ));

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_storage_units_updated_at BEFORE UPDATE ON storage_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Вставка тестовых данных
INSERT INTO tenants (name, slug, settings) VALUES
  ('ООО "Завод МеталлПрофиль"', 'metalprofil', '{"timezone": "Europe/Moscow", "currency": "RUB", "pallet_type": "euro"}'),
  ('ООО "СтройКомплект"', 'stroikomplekt', '{"timezone": "Europe/Moscow", "currency": "RUB", "pallet_type": "both"}');

-- Создайте пользователей в Supabase UI, затем обновите их профили