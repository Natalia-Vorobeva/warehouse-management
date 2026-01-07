import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'warehouse-management'
    }
  }
})

// Helper функции
export const auth = supabase.auth
export const storage = supabase.storage
export const from = supabase.from

// Подписка на изменения в реальном времени
export const subscribeToTable = (table, callback) => {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table }, 
      (payload) => callback(payload)
    )
    .subscribe()
}