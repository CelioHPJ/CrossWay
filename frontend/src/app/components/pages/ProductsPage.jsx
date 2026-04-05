import { useState, useEffect } from "react";
import { useParams } from "react-router";
// IMPORTAÇÃO NOVA: O nosso serviço que fala com o Supabase
import { productsService } from "../../services/productsService"; 
import { ProductFilter } from "../organisms/ProductFilter.jsx";
import { ProductGrid } from "../organisms/ProductGrid.jsx";

export function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  const { category } = useParams();

  // 1. Busca os produtos no banco de dados ao abrir a página
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getAllProducts();
        setAllProducts(data);
      } catch (error) {
        console.error("Erro ao carregar catálogo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Controla a categoria selecionada pela URL
  useEffect(() => {
    if (category) {
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      setSelectedCategory(formattedCategory);
    } else {
      setSelectedCategory("Todos");
    }
  }, [category]);

  // 3. Monta a lista de categorias dinamicamente (ignorando produtos sem categoria)
  const categories = [
    "Todos",
    ...Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean))),
  ];

  // 4. Filtra os produtos
  const filteredProducts =
    selectedCategory === "Todos"
      ? allProducts
      : allProducts.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-medium mb-4">Todos os Produtos</h1>
        <p className="text-gray-600 text-lg">
          Encontre as melhores peças de vestuário para seu estilo
        </p>
      </div>

      <ProductFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Mostra um aviso de carregando enquanto os dados não chegam */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Carregando produtos...</div>
      ) : (
        <>
          <ProductGrid products={filteredProducts} columns={4} />

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">
                Nenhum produto encontrado nesta categoria.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}