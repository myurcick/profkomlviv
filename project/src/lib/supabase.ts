import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dkvqoduuntuksvnpkruu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdnFvZHV1bnR1a3N2bnBrcnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODU2NDEsImV4cCI6MjA2NzA2MTY0MX0.S7nxiwbMEE0ISwmtTFbS-1cuD3odPsDveRrZSrIfaoI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);