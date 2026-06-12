import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kssemmyylumbirsysldb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzc2VtbXl5bHVtYmlyc3lzbGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODY4NDQsImV4cCI6MjA5MjU2Mjg0NH0.l8Gk8-9s6z5b2bxQIHkWC6RX5S_Y5c05WgBYtz0rOs0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
