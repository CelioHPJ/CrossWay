import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "../atoms/button.jsx"; // 🌟 Importação corrigida (do seu átomo)

export function CategoryGrid({ categories }) {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título da Seção */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-medium mb-4">Categorias</h2>
          <p className="text-gray-600 text-lg">
            Explore nossas coleções
          </p>
        </div>

        {/* 🌟 O GRID: Agora ele gera botões estilizados para cada item! */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category} to={`/products?category=${category}`} className="block group">
              <Button 
                variant="ghost" 
                className="w-full relative px-10 py-8 border border-black rounded-none overflow-hidden transition-all duration-500 hover:text-white"
              >
                {/* 🌟 Animação Dior: Camada de fundo que sobe no hover */}
                <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                
                {/* 🌟 Conteúdo do Botão: Nome da Categoria e Seta */}
                <span className="relative z-10 flex items-center justify-center w-full text-base font-medium tracking-[0.2em] uppercase">
                  {category}
                </span>
              </Button>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}