import { Link } from "react-router";
import { Button } from "../atoms/Button.jsx";

export function OrderSummary({ totalPrice }) {
  const shippingCost = totalPrice >= 200 ? 0 : 15;
  const total = totalPrice + shippingCost;

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">R$ {totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Frete</span>
          <span className="font-semibold">
            {shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-2xl">R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button variant="primary" size="large" className="w-full mb-4">
        Finalizar Compra
      </Button>

      <Link
        to="/produtos"
        className="block text-center text-gray-600 hover:text-gray-900 transition"
      >
        Continuar Comprando
      </Link>

      {totalPrice < 200 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Faltam R$ {(200 - totalPrice).toFixed(2)} para ganhar frete grátis!
          </p>
        </div>
      )}
    </div>
  );
}
