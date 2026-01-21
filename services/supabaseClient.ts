import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vxsjiwlvradiyluppage.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing! Check your Vercel environment variables.');
  // Still create client with empty key to prevent app crash, but it won't work
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder-key');
