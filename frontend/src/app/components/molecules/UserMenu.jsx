import React from "react";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { supabase } from "../../../utils/supabase/client";

import { toast } from "sonner";

const UserMenu = React.forwardRef((props, ref) => {
    const { user } = useAuth();

    const navigate = useNavigate();

    if (!props.isOpen) {
        return null;
    }

    const handleSignOut = async () => {
        try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
            toast.success("Você saiu com sucesso!");
            navigate("/");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            toast.error("Erro ao tentar sair.");
        }
    };

    // Se 'isOpen' for true, renderiza o menu com classes do Tailwind
    return (
        <div
            className="user-dropdown absolute top-full right-0 mt-2 
                       bg-white border border-gray-200 rounded-xl shadow-lg z-50"
            style={{ width: "320px" }} // Usa a largura personalizada definida no tailwind.config.js
            ref={ref} // Conecta o 'ref' do Header a este 'div'
        >
            {/* Seção 1: Cabeçalho do menu */}
            <div className="menu-header flex items-center p-5 border-b border-gray-100">
                <div
                    className="user-avatar w-12 h-12 bg-vermelho-botao rounded-full 
                                flex items-center justify-center text-vermelho-botao text-xl mr-4"
                >
                    <FaUser color="#ba2025" />
                </div>
          <div className="user-info flex flex-col">
            <span className="user-name font-bold text-lg text-gray-900">
              {user?.user_metadata?.full_name || "Usuário"}
            </span>
                </div>
            </div>

            {/* Seção 3: Links de navegação */}
        <nav className="menu-links pb-2">
                <ul>
            <li>
              <Link
                        className="block py-2 px-6 text-base text-gray-800 
                                              transition-colors duration-200 hover:bg-gray-100"
                to="/profile"
                        >
                Meu Perfil
                        </Link>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="block py-2 px-6 text-base text-gray-800 
                                              transition-colors duration-200 hover:bg-gray-100"
                        >
                            Sair
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
});

export default UserMenu;
