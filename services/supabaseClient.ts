import { createClient } from '@supabase/supabase-js';

// Use Vite's import.meta.env for environment variables
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Supabase credentials not configured!');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase Client initialized');
console.log('   URL:', supabaseUrl ? '✓ configured' : '✗ MISSING');
console.log('   Key:', supabaseAnonKey ? '✓ configured' : '✗ MISSING');
