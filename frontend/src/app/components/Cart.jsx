import { Link } from "react-router";
import { useCart } from "../context/CartContext.jsx";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Adicione produtos ao carrinho para continuar comprando
          </p>
          <Link
            to="/produtos"
            className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Ver Produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
              className="bg-white border border-gray-200 rounded-lg p-6 flex gap-6"
            >
              <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">{item.category}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p>Tamanho: {item.selectedSize}</p>
                  <p>Cor: {item.selectedColor}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-bold text-xl">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-medium transition"
          >
            Limpar Carrinho
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  R$ {totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frete</span>
                <span className="font-semibold">
                  {totalPrice >= 200 ? "Grátis" : "R$ 15,00"}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl">
                    R${" "}
                    {(totalPrice + (totalPrice >= 200 ? 0 : 15)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition mb-4">
              Finalizar Compra
            </button>

            <Link
              to="/produtos"
              className="block text-center text-gray-600 hover:text-gray-900 transition"
            >
              Continuar Comprando
            </Link>

            {totalPrice < 200 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Faltam R$ {(200 - totalPrice).toFixed(2)} para ganhar frete
                  grátis!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}