import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "../atoms/button.jsx";

export function HeroSection({ backgroundImage }) {
  return (
    <section className="relative h-[600px] bg-gray-900 flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Nova Coleção
          <br />
          Primavera/Verão
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Descubra as últimas tendências em moda e renove seu guarda-roupa com estilo.
        </p>
        <Link to="/produtos">
          <Button variant="primary" size="large" className="bg-white text-gray-900 hover:bg-gray-100">
            Ver Coleção
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}