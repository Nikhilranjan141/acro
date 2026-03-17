import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey && /^https?:\/\//i.test(supabaseUrl));

export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseKey) : null;
export { hasSupabaseConfig };
