import { useState, useEffect } from "react";
import { products } from "../../data/products.js";
import { ProductFilter } from "../organisms/ProductFilter.jsx";
import { ProductGrid } from "../organisms/ProductGrid.jsx";
import { useParams } from "react-router";

export function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const { category } = useParams();

  useEffect(() => {
    if (category) {
      // Capitaliza a primeira letra para bater com os dados (ex: 'camisetas' -> 'Camisetas')
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      setSelectedCategory(formattedCategory);
    } else {
      setSelectedCategory("Todos");
    }
  }, [category]);

  const categories = [
    "Todos",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Todos os Produtos</h1>
        <p className="text-gray-600 text-lg">
          Encontre as melhores peças de vestuário para seu estilo
        </p>
      </div>

      <ProductFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ProductGrid products={filteredProducts} columns={4} />

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
