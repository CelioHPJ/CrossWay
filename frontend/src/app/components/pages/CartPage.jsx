import { Link } from "react-router";
import { useCart } from "../../context/CartContext.jsx";
import { ShoppingBag } from "lucide-react";
import { CartList } from "../organisms/CartList.jsx";
import { OrderSummary } from "../organisms/OrderSummary.jsx";
import { Button } from "../atoms/Button.jsx";

export function CartPage() {
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
          <Link to="/produtos">
            <Button variant="primary" size="large">
              Ver Produtos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartList
            items={items}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
          />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
}
