import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iqchqwidjwtdknodhhxy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxY2hxd2lkand0ZGtub2RoaHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODQ2NTksImV4cCI6MjA3MDU2MDY1OX0.M9p8ACvwr_p17UHA9HWnbr5n6pnwTkJuCyVbwBJJB8U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);