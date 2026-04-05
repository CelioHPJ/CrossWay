// src/services/productsService.js
import { supabase } from "../../utils/supabase/client";

export const productsService = {
  // 1. Busca todos os produtos para a vitrine
  getAllProducts: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)');
    
    if (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error; 
    }
    
    return data.map((produto) => ({
      ...produto,
      category: produto.categories?.name || "Sem categoria"
    }));
  },

  // 2. Busca apenas um produto com TODAS as variações (Tamanho/Cor/Stock)
  getProductById: async (id) => {
    // 🌟 AQUI ESTÁ O SEGREDO: Juntamos tudo numa consulta só
    const { data, error } = await supabase
      .from('products')
      .select(`
        *, 
        categories(name), 
        product_variants(size, color, stock)
      `)
      .eq('id', id) // Se o seu ID for UUID, não use Number(id). Se for numérico, use Number(id).
      .single();

    if (error) {
      console.error("Erro ao buscar o produto:", error);
      throw error;
    }

    let tamanhos = [];
    let cores = [];

    // Verificamos se 'data.product_variants' existe antes de ler o .length
    if (data?.product_variants && data.product_variants.length > 0) {
      
      // Criamos os botões apenas com valores que não sejam nulos
      const sizeSet = new Set(
        data.product_variants
          .map(v => v.size)
          .filter(s => s !== null)
      );
      
      const colorSet = new Set(
        data.product_variants
          .map(v => v.color)
          .filter(c => c !== null)
      );

      tamanhos = Array.from(sizeSet);
      cores = Array.from(colorSet);
    }

    // Retornamos um objeto único que o React entende perfeitamente
    return {
      ...data,
      category: data.categories?.name || "Sem categoria",
      size: tamanhos, // Nomeado como 'sizes' para bater com o seu Componente
      color: cores,   // Nomeado como 'colors' para bater com o seu Componente
      variants: data.product_variants
    };
  }
};