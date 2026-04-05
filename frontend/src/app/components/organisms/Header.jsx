import { useState, useRef , useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router"; // Adicionado para a busca funcionar
import { Menu, X, Trash2, Minus, Plus, Search, ShoppingCart } from "lucide-react";
import UserMenu from "../molecules/UserMenu.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { Logo } from "../atoms/Logo.jsx";
import { Input } from "../atoms/Input.jsx";
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
import { useAuth } from  "../../context/AuthContext.jsx";
import { CartItemCard } from "../molecules/CartItemCard.jsx";

import{ CartDrawer } from "../organisms/CartDrawer.jsx";

export function Header() {
  const { totalItems, items, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate(); // Hook necessário para o redirecionamento
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const iconRef = useRef(null);
  const menuRef = useRef(null);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      // Ajustei para /products, já que é a rota que você está usando no menu
      navigate("/products", { state: { search: searchValue } });
      setMobileMenuOpen(false); // Corrigido o nome da função de estado
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================
            1º ANDAR: Logo, Busca e Carrinho 
            ========================================= */}
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* LADO ESQUERDO: Logotipo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>
          
          {/* CENTRO: Barra de Busca (Ocupa o espaço livre e não sobrepõe os botões) */}
          <div className="hidden md:flex flex-1 max-w-2xl px-8 justify-center">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                placeholder="O que você procura?"
                className="pl-12 h-12 bg-gray-100 border-0 rounded-full w-full focus-visible:ring-gray-300"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* LADO DIREITO: Carrinho e Menu Mobile */}
          <div className="flex-shrink-0 flex items-center justify-end gap-4">
            {!user && (
                            <NavLink to="/login">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hidden md:flex h-10 md:h-12 px-6 rounded-full font-medium"
                                >
                                    <span>Entrar</span>
                                </Button>
                            </NavLink>
                        )}

                        {user && (
                            <div className="relative hidden md:flex">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-10 md:h-12 w-10 md:w-12 p-0 rounded-full hover:bg-gray-100"
                                    onClick={toggleMenu}
                                    ref={iconRef}
                                >
                                    <FaUser className="h-5 w-5 text-gray-700" />
                                </Button>

                                <UserMenu isOpen={isMenuOpen} ref={menuRef} onClose={() => setIsMenuOpen(false)}/>
                            </div>
                        )}
            {/* INÍCIO DO CARRINHO (SHEET) */}
            <Sheet>
  <SheetTrigger asChild>
    <button className="relative flex items-center transition outline-none text-gray-800 hover:text-black">
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  </SheetTrigger>
 <CartDrawer/>
</Sheet>
            {/* FIM DO CARRINHO */}

            {/* Botão do Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-800"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>

        {/* =========================================
            2º ANDAR: Navegação Desktop (Abaixo da Busca)
            ========================================= */}
        <nav className="hidden md:flex font-bold justify-center items-center h-12 space-x-8 border-t border-gray-100">
          <NavLink to="/" className="text-gray-900 hover:text-gray-600">Início</NavLink>
          <NavLink to="/products" className="text-gray-900 hover:text-gray-600">Produtos</NavLink>
          <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}>Ofertas</NavLink>
        </nav>
      </div>

      {/* Navegação Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
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