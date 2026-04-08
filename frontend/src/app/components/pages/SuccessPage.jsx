import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "../atoms/button.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { ordersApi } from "../../services/api.js";
import { productsService } from "../../services/productsService.js";

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const { items, clearCart } = useCart();
  const [status, setStatus] = useState("Atualizando pedido...");
  
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const finalizeOrder = async () => {
      // 1. Deduz estoque REAL no Supabase antes que o carrinho de compras seja limpo localmente
      if (items && items.length > 0) {
        await productsService.decreaseStock(items);
      }

      // 2. Limpa o carrinho de compras do cliente obrigatoriamente
      clearCart();

      // Atualiza o pedido como pago via API se tivermos um Order ID do Supabase
      if (orderId) {
        try {
          await ordersApi.updateStatus(orderId, "PAID");
          setStatus("Pedido confirmado e pagamento aprovado!");
          console.log("Pedido " + orderId + " atualizado para PAID");
        } catch (error) {
          console.error("Erro ao atualizar o status para PAID:", error);
          setStatus("Recebemos seu pedido! O pagamento está sendo processado.");
        }
      } else {
        setStatus("Pedido confirmado com sucesso!");
      }
    };

    finalizeOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Compra Finalizada!</h1>
        <p className="text-gray-500 mb-6">
          {status}
        </p>

        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Número do Pedido
            </p>
            <p className="font-mono text-sm font-medium text-gray-900">
              #{orderId.split("-")[0].toUpperCase()}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/profile?section=orders">
            <Button className="w-full bg-black text-white hover:bg-gray-800 h-12">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Acompanhar Pedido
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" className="w-full h-12 border-gray-200">
              Continuar Comprando
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
