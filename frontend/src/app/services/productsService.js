// src/services/productsService.js
import { supabase } from "../../utils/supabase/client";

export const productsService = {
  // 1. Busca todos os produtos para a vitrine
  getAllProducts: async () => {
    const { data, error } = await supabase.from('products').select('*');
    
    if (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error; 
    }
    
    return data;
  },

  // 2. Busca apenas um produto (quando o cliente clica para ver os detalhes)
  getProductById: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single(); 
      
    if (error) {
      console.error("Erro ao buscar o produto:", error);
      throw error;
    }
    
    return data;
  }
};