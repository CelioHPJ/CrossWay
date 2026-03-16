import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { products } from "../../data/products.js";
import { HeroSection } from "../organisms/HeroSection.jsx";
import { ProductGrid } from "../organisms/ProductGrid.jsx";
import { CategoryGrid } from "../organisms/CategoryGrid.jsx";
import { BenefitsSection } from "../organisms/BenefitsSection.jsx";
import { Button } from "../atoms/button.jsx";

export function HomePage() {
  const featuredProducts = products.slice(0, 4);
  const categories = [
    "Camisetas",
    "Vestidos",
    "Calças",
    "Jaquetas",
    "Calçados",
    "Moletons",
    "Bermudas",
    "Suéteres",
  ];

  return (
    <div>
      <HeroSection backgroundImage={products[1].image} />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Produtos em Destaque</h2>
          <p className="text-gray-600 text-lg">
            Confira nossa seleção especial de produtos
          </p>
        </div>

        <ProductGrid products={featuredProducts} columns={4} />

        <div className="text-center mt-12">
          <Link to="/produtos">
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
