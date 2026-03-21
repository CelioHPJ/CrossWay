// AuthProvider.jsx
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

// IMPORTANTE: Você precisa importar o seu cliente do Supabase aqui!
// Ajuste este caminho para onde está o seu arquivo de configuração do Supabase
import { supabase } from "../utils/supabase/client"; 

export function AuthProvider({ children }) {
    // Agora só precisamos de um estado para o usuário
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Pega o usuário logado no momento em que a página carrega
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            // Se tiver sessão, salva o usuário. Se não, fica nulo.
            setUser(session?.user || null);
            setLoading(false);
        };

        getInitialSession();

        // 2. Fica "escutando" em tempo real (se o cara logar ou deslogar noutra aba)
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
                setLoading(false);
            }
        );

        // Limpeza de segurança quando o componente desmontar
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // O valor que será distribuído para o site inteiro (como o seu Header!)
    const value = { user, loading };

    return (
        <AuthContext.Provider value={value}>
            {/* Só mostra o site depois de descobrir se o usuário está logado ou não */}
            {!loading && children}
        </AuthContext.Provider>
    );
}