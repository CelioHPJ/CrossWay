import React from "react";
import { X, Gift, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext"; // Ajuste o caminho se necessário
import { SheetContent, SheetHeader, SheetTitle, SheetClose } from "../atoms/sheet"; // Seus componentes de UI
import { NavLink } from "../molecules/NavLink";

export function CartDrawer() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <SheetContent side="right" className="w-full sm:max-w-[550px] p-0 flex flex-col bg-white border-l-0">

      {/* Cabeçalho de Abas */}
      <div className="px-8 pt-12">
        <div className="flex border-b border-gray-100">
          <button className="flex-1 text-center py-4 font-light text-xl text-gray-950 border-b-2 border-gray-950 relative">
            Carrinho <span className="text-sm ml-1">({items.length})</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Rolável */}
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {/* Lista de Itens */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <ShoppingBag className="w-12 h-12 mb-4 stroke-[1]" />
            <p className="font-light text-lg">Sua sacola está vazia.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="py-8 flex gap-6">
                
                {/* Imagem do Produto */}
                <div className="w-28 h-28 bg-[#F6F6F6] rounded-sm flex items-center justify-center p-2">
                  <img
                    src={item.image_url || item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Detalhes */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-light text-xl text-gray-900 pr-4">{item.name}</h3>
                    <p className="font-medium text-lg text-gray-950">
                      R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  
                  <p className="text-sm font-light text-gray-500 mb-4">
                    {item.selectedSize ? `Tamanho: ${item.selectedSize}` : "Tamanho Único"} 
                    {item.selectedColor && ` | Cor: ${item.selectedColor}`}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    {/* Botão Remover estilo Link */}
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                      className="text-gray-950 text-sm font-light underline underline-offset-4 hover:text-gray-600 transition"
                    >
                      Remover
                    </button>

                    {/* Seletor de Quantidade Estilo Select */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-light text-gray-500">Quantidade</span>
                      <div className="relative">
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, item.selectedSize, item.selectedColor, Number(e.target.value))}
                          className="appearance-none bg-white border border-gray-200 rounded-none pl-3 pr-8 py-1.5 text-sm font-medium focus:ring-0 focus:border-gray-400 cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-950">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé Fixo */}
      <div className="p-8 border-t border-gray-100 bg-white">
        <div className="flex justify-between items-center mb-8">
          <p className="font-light text-2xl text-gray-950">Subtotal</p>
          <p className="font-medium text-2xl text-gray-950">
            R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>  
        </div>
        <NavLink to="/cart">
<button className="w-full bg-gray-950 text-white font-medium text-base py-5 tracking-widest hover:bg-gray-800 transition-colors uppercase">
          Finalizar Compra
        </button>
        </NavLink>
        
        
        <SheetClose asChild>
          <button className="w-full text-center mt-6 text-gray-950 font-light text-sm underline underline-offset-4 hover:text-gray-600 transition">
            Continuar Compras
          </button>
        </SheetClose>
      </div>
    </SheetContent>
  );
}