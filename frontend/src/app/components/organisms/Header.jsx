import { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router"; 
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import UserMenu from "../molecules/UserMenu.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { Logo } from "../atoms/Logo.jsx";
import { Input } from "../atoms/Input.jsx";
import { NavLink } from "../molecules/NavLink.jsx"; 
import {
  Sheet,
  SheetTrigger,
} from "../atoms/sheet.jsx";
import { Button } from "../atoms/button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { CartDrawer } from "../organisms/CartDrawer.jsx";

export function Header() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const iconRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate("/products", { state: { search: searchValue } });
      setMobileMenuOpen(false); 
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        
        {/* =========================================
            1º ANDAR: Logo, Busca e Carrinho 
            (Usando FLEX: Permite que a busca cresça o quanto quiser)
            ========================================= */}
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* LADO ESQUERDO: Pega 1 parte do espaço */}
          <div className="flex-[1] flex justify-start min-w-max">
            <Logo />
          </div>
          
          {/* CENTRO: Pega 2 partes do espaço (o dobro), dando área livre para a barra crescer */}
          <div className="hidden md:flex flex-[2] justify-center w-full">
            {/* 🌟 AQUI FICA O CONTROLE DE LARGURA: 
                Troque max-w-2xl por max-w-3xl, max-w-4xl ou até w-full para deixar gigante! */}
            <div className="relative w-full max-w-3xl">
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

          {/* LADO DIREITO: Pega 1 parte do espaço */}
          <div className="flex-[1] flex justify-end items-center gap-4 min-w-max">
            
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
              <CartDrawer />
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
        <nav className="hidden md:flex font-medium justify-center text-lg items-center h-15 space-x-10 border-t border-gray-100">
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