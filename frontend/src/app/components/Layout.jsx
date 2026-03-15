import { Outlet, Link } from "react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useState } from "react";

export function Layout() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">VESTUÁRIO</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 transition">
                Início
              </Link>
              <Link to="/produtos" className="text-gray-700 hover:text-gray-900 transition">
                Produtos
              </Link>
              <Link to="/carrinho" className="relative flex items-center text-gray-700 hover:text-gray-900 transition">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
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
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Início
              </Link>
              <Link
                to="/produtos"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Produtos
              </Link>
              <Link
                to="/carrinho"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-gray-700 hover:text-gray-900 transition"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrinho {totalItems > 0 && `(${totalItems})`}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">VESTUÁRIO</h3>
              <p className="text-gray-400">
                Moda de qualidade para você expressar seu estilo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition">
                    Início
                  </Link>
                </li>
                <li>
                  <Link to="/produtos" className="hover:text-white transition">
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link to="/carrinho" className="hover:text-white transition">
                    Carrinho
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contato@vestuario.com</li>
                <li>(11) 9999-9999</li>
                <li>São Paulo, Brasil</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 VESTUÁRIO. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}