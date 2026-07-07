import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if placeholder credentials are being used
const isPlaceholder = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('your-supabase-url') || 
  supabaseAnonKey.includes('your-supabase-anon-key');

export const supabase = createClient(
  isPlaceholder ? 'https://placeholder-url.supabase.co' : supabaseUrl,
  isPlaceholder ? 'placeholder-key' : supabaseAnonKey
);

export const isSupabaseConfigured = () => {
  return !isPlaceholder;
};
