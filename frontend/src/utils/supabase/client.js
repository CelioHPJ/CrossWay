// src/utils/supabase/client.js
import { createClient } from '@supabase/supabase-js';

// Puxa as chaves de segurança do seu arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cria e exporta a conexão para o resto do site usar
export const supabase = createClient(supabaseUrl, supabaseAnonKey);