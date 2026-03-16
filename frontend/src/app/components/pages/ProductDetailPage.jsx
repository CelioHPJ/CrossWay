import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { products } from "../../data/products.js";
import { useCart } from "../../context/CartContext.jsx";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Image } from "../atoms/Image.jsx";
import { Button } from "../atoms/Button.jsx";
import { ProductGrid } from "../organisms/ProductGrid.jsx";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const product = products.find((p) => p.id === Number(id));

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
    if (!selectedSize || !selectedColor) {
      alert("Por favor, selecione um tamanho e uma cor");
      return;
    }

    addToCart(product, selectedSize, selectedColor);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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
        <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-100">
          <Image src={product.image} alt={product.name} />
        </div>

        <div>
          <p className="text-gray-600 mb-2">{product.category}</p>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold mb-6">
            R$ {product.price.toFixed(2)}
          </p>

          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">Tamanho:</label>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
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
              {product.colors.map((color) => (
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

          <div className="mt-8 border-t pt-8">
            <h3 className="font-semibold text-lg mb-4">
              Informações do Produto
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Material de alta qualidade</li>
              <li>• Entrega rápida em todo Brasil</li>
              <li>• Troca grátis em até 30 dias</li>
              <li>• Garantia de satisfação</li>
            </ul>
          </div>
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
