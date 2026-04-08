import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useCart } from "../../context/CartContext.jsx";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
// 🌟 IMPORTAÇÃO NOVA: O nosso serviço para falar com o Supabase
import { productsService } from "../../services/productsService.js";
import { toast } from "sonner";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // 🌟 NOVOS ESTADOS PARA A BASE DE DADOS
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // 🌟 BUSCAR O PRODUTO NO SUPABASE
  useEffect(() => {
    async function carregarProduto() {
      try {
        setLoading(true);
        // 1. Busca os detalhes do produto atual
        const dadosProduto = await productsService.getProductById(id);
        setProduct(dadosProduto);

        // 2. Busca todos os produtos para mostrar os "Relacionados"
        const todosProdutos = await productsService.getAllProducts();
        
        // Filtra para pegar apenas produtos da mesma categoria (ignorando o atual)
        const relacionados = todosProdutos
          .filter((p) => p.category === dadosProduto.category && p.id !== dadosProduto.id)
          .slice(0, 4);
          
        setRelatedProducts(relacionados);
      } catch (error) {
        console.error("Erro ao carregar os detalhes do produto:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarProduto();
  }, [id]);

  // Ecrã de carregamento
  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-xl font-medium">A carregar detalhes do produto...</div>;
  }

  // Se o ID não existir na base de dados
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
 console.log("O link da imagem que chegou ao Detalhe é:", product.image_url);
  const handleAddToCart = () => {
    // NOTA: Se os teus produtos no Supabase não tiverem as colunas 'sizes' e 'colors', 
    // podes ter de remover esta validação no futuro, mas por enquanto vamos manter.
    if (!selectedSize || !selectedColor) {
      toast.warning("Por favor, selecione um tamanho e uma cor");
      return;
    }

    addToCart(product, selectedSize, selectedColor);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // 🌟 FALLBACK: Imagem de segurança caso o produto não tenha foto
  const imagemPrincipalSegura = product.image_url || "https://placehold.co/400x400/eeeeee/999999?text=Sem+Foto";
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-100">
          <img
            src={imagemPrincipalSegura}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-red-100 p-4 border-2 border-red-500 my-4 rounded-md overflow-auto">
            <p className="font-bold text-red-700 mb-2">DADOS DO SUPABASE:</p>
            <pre className="text-xs text-red-800">
              {JSON.stringify(product, null, 2)}
            </pre>
          </div>

        {/* Product Info */}
        <div>
          <p className="text-gray-600 mb-2">{product.category}</p>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold mb-6">
            R$ {product.price?.toFixed(2) || "0.00"}
          </p>

          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            {product.description || "Descrição não disponível para este produto."}
          </p>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">Tamanho:</label>
            <div className="flex flex-wrap gap-3">
              {/* Usando dados estáticos por segurança se a DB não tiver tamanhos */}
              {(product.sizes || ["P", "M", "G", "GG"]).map((size) => (
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
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <label className="block font-semibold mb-3">Cor:</label>
            <div className="flex flex-wrap gap-3">
              {/* Usando dados estáticos por segurança se a DB não tiver cores */}
              {(product.colors || ["Preto", "Branco", "Cinza"]).map((color) => (
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
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2 mb-4"
          >
            <ShoppingCart className="w-5 h-5" />
            Adicionar ao Carrinho
          </button>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5" />
              Produto adicionado ao carrinho com sucesso!
            </div>
          )}

          {/* Product Features */}
          <div className="mt-8 border-t pt-8">
            <h3 className="font-semibold text-lg mb-4">Informações do Produto</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Material de alta qualidade</li>
              <li>• Entrega rápida em todo Brasil</li>
              <li>• Troca grátis em até 30 dias</li>
              <li>• Garantia de satisfação</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => {
              // Proteção de imagem para os produtos relacionados também
              const imagemRelacionadaSegura = relatedProduct.image_url || "https://placehold.co/400x400/eeeeee/999999?text=Sem+Foto";
              
              return (
                <Link
                  key={relatedProduct.id}
                  to={`/produto/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
                    <img
                      src={imagemRelacionadaSegura}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-gray-600 transition">
                    {relatedProduct.name}
                  </h3>
                  <p className="font-bold text-xl">
                    R$ {relatedProduct.price?.toFixed(2) || "0.00"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}