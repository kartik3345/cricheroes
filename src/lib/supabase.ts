import { createClient } from '@supabase/supabase-js';

// Default project configuration fallback so builds without .env (e.g. Vercel, Netlify, Preview) don't crash
const DEFAULT_SUPABASE_URL = 'https://eszakycbujwrfgyawpce.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzemFreWNidWp3cmZneWF3cGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MjIxNTYsImV4cCI6MjA5ODE5ODE1Nn0.NwQoPP0I_s9-JgYxATwhztIBjAcWPLBK54raLiiZRwU';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn('[Supabase] Warning: Missing Supabase environment variables. Cloud sync features will be disabled.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

