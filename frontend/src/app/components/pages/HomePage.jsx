// 1. Adicionamos o useEffect e useState do React
import { useEffect, useState } from "react"; 
import { Link } from "react-router"; // (Normalmente usamos react-router-dom no web)
import { ArrowRight } from "lucide-react";

// 2. APAGAMOS a importação dos produtos falsos:

// 3. IMPORTAMOS o nosso novo serviço do Supabase:
import { productsService } from "../../services/productsService.js"; 

import { HeroSection } from "../organisms/HeroSection.jsx";
import { ProductGrid } from "../organisms/ProductGrid.jsx";
import { CategoryGrid } from "../organisms/CategoryGrid.jsx";
import { BenefitsSection } from "../organisms/BenefitsSection.jsx";
import { Button } from "../atoms/button.jsx";

export function HomePage() {
  // 4. Criamos os "Estados" para guardar os produtos reais e o status de carregamento
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 5. O useEffect busca os dados no exato momento que a página abre
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Pede os produtos pro Supabase
        const data = await productsService.getAllProducts();
        
        // Pega apenas os 4 primeiros para colocar nos destaques
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
      } finally {
        // Avisa que terminou de carregar (dando certo ou errado)
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // A array vazia [] garante que isso só rode UMA vez.

  // Categorias (ainda estáticas, podemos automatizar depois se quiser)
  const categories = [
    "Camisetas",
    "Calças",
    "Moletons",
    "Suéteres",
  ];

  return (
    <div>
      <HeroSection backgroundImage="/ultima-ceia.jpg" />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Produtos em Destaque</h2>
          <p className="text-gray-600 text-lg">
            Confira nossa seleção especial de produtos
          </p>
        </div>

        {/* 6. Só mostramos o Grid se já tiver terminado de carregar */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500 font-medium">Carregando catálogo...</p>
          </div>
        ) : (
          <ProductGrid products={featuredProducts} columns={4} />
        )}

        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="secondary" size="large">
              Ver Todos os Produtos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <CategoryGrid categories={categories} />

      <BenefitsSection />
    </div>
  );
}