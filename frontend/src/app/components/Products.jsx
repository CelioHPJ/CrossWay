import { useState } from "react";
import { Link } from "react-router";
import { products } from "../data/products.js";
import { Filter } from "lucide-react";

export function Products() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Todos os Produtos</h1>
        <p className="text-gray-600 text-lg">
          Encontre as melhores peças de vestuário para seu estilo
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          <span className="font-semibold">Filtrar por categoria:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === category
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">
            Nenhum produto encontrado nesta categoria.
          </p>
        </div>
      )}
    </div>
  );
}