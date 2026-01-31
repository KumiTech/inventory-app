import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type InventoryItem = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  sku: string;
  created_at: string;
  updated_at: string;
};
