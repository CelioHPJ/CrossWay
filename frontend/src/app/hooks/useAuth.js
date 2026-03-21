import { useContext } from "react";
// 1. Importe o contexto do outro arquivo
import { AuthContext } from "../context/AuthContext";

// 2. Exporte o hook daqui
export const useAuth = () => {
    const context = useContext(AuthContext);

    // Opcional: Adicionar uma verificação de erro
    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }

    return context;
};
