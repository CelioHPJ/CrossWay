import { useState, useRef  } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router"; // Adicionado para a busca funcionar
import { Menu, X, Trash2, Minus, Plus, Search, ShoppingCart } from "lucide-react";
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
        {!user && (
              <Link to="/login">
                  <Button
                      variant="outline"
                      size="sm"
                      className="hidden md:flex h-10 md:h-12 px-6 rounded-full font-medium"
                  >
                      <span>Entrar</span>
                  </Button>
              </Link>
          )}

          {/* CASO 2: LOGADO (user) -> Mostra a bolinha com o ícone e o Menu */}
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

                  {/* Componente que deve ter os botões "Meu Perfil" e "Sair" */}
                  <UserMenu isOpen={isMenuOpen} ref={menuRef} />
              </div>
          )}
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
                            <Link to="/login">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hidden md:flex h-10 md:h-12 px-6 rounded-full font-medium"
                                >
                                    <span>Entrar</span>
                                </Button>
                            </Link>
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

                                <UserMenu isOpen={isMenuOpen} ref={menuRef} />
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