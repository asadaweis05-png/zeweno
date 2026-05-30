import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://weyaltdpfkfhugnoxzto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleWFsdGRwZmtmaHVnbm94enRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MjQ2OTcsImV4cCI6MjA5MjMwMDY5N30.hYBeZdTGlu3KQ2QvtV6X3NllZ3uJgD8i0bArZe0W8O4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
