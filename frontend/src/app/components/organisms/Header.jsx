import { useState } from "react";
import { Menu, X, Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { Logo } from "../atoms/Logo.jsx";
import { NavLink } from "../molecules/NavLInk.jsx";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "../atoms/sheet.jsx";
import { Button } from "../atoms/button.jsx";

export function Header() {
  const { totalItems, items, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 w-full">
          
          {/* 1. LADO ESQUERDO: Logotipo */}
          <div className="flex-1 flex justify-start items-center">
            <Logo />
          </div>

          {/* 2. CENTRO: Navegação (Fica absolutamente no centro) */}
          <nav className="hidden md:flex font-bold absolute left-1/2 transform -translate-x-1/2 items-center space-x-8 ">
            <NavLink to="/">Início</NavLink>
            <NavLink to="/products">Produtos</NavLink>
          </nav>

          {/* 3. LADO DIREITO: Carrinho e Menu Mobile */}
          <div className="flex-1 flex justify-end items-center gap-4">
            
            {/* INÍCIO DO CARRINHO (SHEET) */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative flex items-center transition outline-none">
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col bg-white">
                <SheetHeader>
                  <SheetTitle>Seu Carrinho</SheetTitle>
                  <SheetDescription>
                    Você tem {totalItems} item(ns) no carrinho.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4 pr-2">
                  {items.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10">Seu carrinho está vazio.</p>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-4">
                          {/* Info do Produto */}
                          <div className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                              <p className="text-gray-500 text-xs mt-0.5">
                                Tam: {item.selectedSize} | Cor: {item.selectedColor}
                              </p>
                              <p className="font-medium text-sm mt-1">R$ {item.price.toFixed(2)}</p>
                            </div>
                          </div>

                          {/* Controles de Quantidade e Remoção */}
                          <div className="flex flex-col items-end gap-3">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Remover item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-gray-100 transition rounded-l-md text-gray-600"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-gray-100 transition rounded-r-md text-gray-600"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <SheetFooter className="mt-auto border-t pt-6 flex-col gap-4">
                  <div className="flex justify-between font-bold text-xl w-full">
                    <span>Total:</span>
                    <span>R$ {totalPrice?.toFixed(2) || "0.00"}</span>
                  </div>
                  
                  <SheetClose asChild>
                    <NavLink to="/cart" className="w-full">
                      <Button className="w-full bg-black text-white py-6 text-lg hover:bg-gray-800 transition-colors">
                        Finalizar Compra
                      </Button>
                    </NavLink>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            {/* FIM DO CARRINHO */}

            {/* Botão do Menu Mobile (Escondido no Desktop) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Navegação Mobile (Quando clica no botão hambúrguer no celular) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex flex-col space-y-4 p-4">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
              Início
            </NavLink>
            <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}>
              Produtos
            </NavLink>
            <NavLink to="/cart" onClick={() => setMobileMenuOpen(false)}>
              Carrinho {totalItems > 0 && `(${totalItems})`}
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}