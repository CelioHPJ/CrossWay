import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { Logo } from "../atoms/Logo.jsx";
import { NavLink } from "../molecules/NavLInk.jsx";
import { CartIcon } from "../molecules/CartIcon.jsx";

export function Header() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Início</NavLink>
            <NavLink to="/produtos">Produtos</NavLink>
            <CartIcon itemCount={totalItems} />
          </nav>

          {/* Mobile Menu Button */}
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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex flex-col space-y-4 p-4">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
              Início
            </NavLink>
            <NavLink to="/produtos" onClick={() => setMobileMenuOpen(false)}>
              Produtos
            </NavLink>
            <NavLink to="/carrinho" onClick={() => setMobileMenuOpen(false)}>
              Carrinho {totalItems > 0 && `(${totalItems})`}
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
