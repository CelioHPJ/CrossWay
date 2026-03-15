import { Link } from "react-router";
import { products } from "../data/products.js";
import { ArrowRight } from "lucide-react";

export function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gray-900 flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('${products[1].image}')`,
          }}
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
          <Link
            to="/produtos"
            className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Ver Coleção
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Produtos em Destaque</h2>
          <p className="text-gray-600 text-lg">
            Confira nossa seleção especial de produtos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/produto/${product.id}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-gray-600 transition">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <p className="font-bold text-xl">
                R$ {product.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/produtos"
            className="inline-flex items-center border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition"
          >
            Ver Todos os Produtos
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Categorias</h2>
            <p className="text-gray-600 text-lg">
              Explore nossas categorias de produtos
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Camisetas", "Vestidos", "Calças", "Jaquetas", "Calçados", "Moletons", "Bermudas", "Suéteres"].map(
              (category) => (
                <Link
                  key={category}
                  to="/produtos"
                  className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition"
                >
                  <p className="font-semibold text-lg">{category}</p>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🚚</span>
            </div>
            <h3 className="font-semibold text-xl mb-2">Frete Grátis</h3>
            <p className="text-gray-600">
              Para compras acima de R$ 200
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🔄</span>
            </div>
            <h3 className="font-semibold text-xl mb-2">Troca Facilitada</h3>
            <p className="text-gray-600">
              30 dias para trocar ou devolver
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💳</span>
            </div>
            <h3 className="font-semibold text-xl mb-2">Pagamento Seguro</h3>
            <p className="text-gray-600">
              Várias formas de pagamento
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}