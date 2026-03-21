import { createContext, useContext } from "react";

// 1. Crie e exporte o Contexto
export const AuthContext = createContext(undefined);

// 2. Crie e exporte o Hook
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }

    return context;
};
