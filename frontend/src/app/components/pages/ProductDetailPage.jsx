import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
// IMPORTAÇÃO NOVA: O serviço do Supabase
import { productsService } from "../../services/productsService"; 
import { useCart } from "../../context/CartContext.jsx";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Image } from "../atoms/Image.jsx";
import { Button } from "../atoms/button.jsx";
import { ProductGrid } from "../organisms/ProductGrid.jsx";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Estados para gerenciar o produto vindo do banco
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // 1. Busca o produto exato pelo ID
        const data = await productsService.getProductById(id);
        setProduct(data);

        // 2. Busca produtos relacionados (mesma categoria)
        const allProducts = await productsService.getAllProducts();
        const related = allProducts
          .filter((p) => p.category === data.category && p.id !== data.id)
          .slice(0, 4);
        setRelatedProducts(related);
        
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]); 

  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-lg">Carregando detalhes do produto...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
        <Link to="/produtos" className="text-blue-600 hover:underline">
          Voltar para produtos
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Só validamos se existirem tamanhos ou cores para escolher
    if ((size.length > 0 && !selectedSize) || (color.length > 0 && !selectedColor)) {
      alert("Por favor, selecione um tamanho e uma cor");
      return;
    }
    
    addToCart(product, selectedSize, selectedColor);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Garante que arrays existam mesmo se o banco não devolver nada
  const size = product?.size || [];
  const color = product?.color || [];

  // 🌟 CORREÇÃO AQUI: Lemos 'image_url' e colocamos a foto de segurança se estiver vazio
  const imagemSegura = product.image_url || "https://placehold.co/600x600/eeeeee/999999?text=Sem+Foto";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* 🌟 CORREÇÃO AQUI: Passamos a imagemSegura para o componente */}
        <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-100">
          <Image src={imagemSegura} alt={product.name} />
        </div>

        <div>
          <p className="text-gray-600 mb-2">{product.category}</p>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <p className="text-3xl font-bold mb-6">
            R$ {Number(product.price || 0).toFixed(2)}
          </p>

          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            {product.description || "Nenhuma descrição disponível para este produto."}
          </p>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">Tamanho:</label>
            <div className="flex flex-wrap gap-3">
              {size.length > 0 ? size.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-16 h-12 border-2 rounded-lg font-medium transition ${
                    selectedSize === size
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 hover:border-gray-900"
                  }`}
                >
                  {size}
                </button>
              )) : <span className="text-gray-500 text-sm">Tamanho único</span>}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <label className="block font-semibold mb-3">Cor:</label>
            <div className="flex flex-wrap gap-3">
              {color.length > 0 ? color.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-3 border-2 rounded-lg font-medium transition ${
                    selectedColor === color
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 hover:border-gray-900"
                  }`}
                >
                  {color}
                </button>
              )) : <span className="text-gray-500 text-sm">Cor padrão</span>}
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="large"
            className="w-full mb-4"
          >
            <ShoppingCart className="w-5 h-5" />
            Adicionar ao Carrinho
          </Button>

          {showSuccess && (
            <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5" />
              Produto adicionado ao carrinho com sucesso!
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8">Produtos Relacionados</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </div>
  );
}