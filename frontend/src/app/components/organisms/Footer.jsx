import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">CROSSWAY</h3>
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
                <Link to="/products" className="hover:text-white transition">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">
                  Carrinho
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li>contato@vestuario.com</li>
              <li>(37) 99828-5821</li>
              <li>Minas Gerais, Brasil</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 CROSSWAY. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
