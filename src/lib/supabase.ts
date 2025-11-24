import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PageTemplate {
  id: string;
  page_type: 'home' | 'about' | 'services' | 'contact';
  template_name: string;
  html_snippet: string;
  css_snippet: string;
  js_snippet: string;
  description: string;
  created_at: string;
}

export interface UserSelection {
  id: string;
  user_id: string;
  page_type: string;
  template_id: string;
  created_at: string;
  updated_at: string;
}
