import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "../../utils/supabase/client"; 

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Função limpa para buscar a sessão e o cargo de uma vez só
        const fetchSessionAndRole = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                // 🔍 O RAIO-X DEFINITIVO: Veja o que aparece no console!
                console.log("📦 DADOS QUE VIERAM DO BANCO:", data);

                if (data) {
                    // Adiciona o cargo ao usuário. Usamos o trim() e toUpperCase() para forçar 
                    // a palavra a ficar limpa, removendo espaços acidentais e minúsculas!
                    const cargoLimpo = data.role ? String(data.role).trim().toUpperCase() : "CUSTOMER";
                    setUser({ ...session.user, role: cargoLimpo });
                } else {
                    setUser(session.user);
                }
            } else {
                setUser(null);
            }
            
            setLoading(false);
        };

        // Chama a função assim que o site abre
        fetchSessionAndRole();

        // Fica de olho se o utilizador fizer login/logout noutra aba
        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                fetchSessionAndRole();
            }
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {loading ? (
                <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Carregando a loja...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}