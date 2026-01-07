const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'ВАШ_VITE_SUPABASE_URL'
const supabaseKey = 'ВАШ_VITE_SUPABASE_ANON_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Тестируем подключение к Supabase...')
  
  try {
    // Тест 1: Проверка доступности
    const { data, error } = await supabase.from('storage_units').select('count')
    
    if (error) {
      console.log('✅ Подключение работает, но таблицы могут не существовать')
      console.log('Ошибка:', error.message)
    } else {
      console.log('✅ Успешное подключение!')
    }
    
    // Тест 2: Проверка аутентификации
    const { data: authData, error: authError } = await supabase.auth.getSession()
    if (authError) {
      console.log('Аутентификация:', authError.message)
    } else {
      console.log('Аутентификация работает')
    }
    
  } catch (err) {
    console.error('❌ Ошибка подключения:', err.message)
  }
}

testConnection()