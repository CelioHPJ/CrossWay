import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase/client";
import { Loader2, Edit, Trash, Plus } from "lucide-react";
import { Button } from "../atoms/button.jsx";
import { toast } from "sonner";

export function AdminPage() {
  // ... seus outros estados
  
  // --- ESTADOS DE CONTROLO DE VISTAS ---
  const [activeView, setActiveView] = useState("lista"); // 'lista' ou 'formulario'
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null); // Guarda o produto a editar

  // --- ESTADOS DA LISTA ---
  const [productList, setProductList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // --- ESTADOS DO FORMULÁRIO (Adiciona os teus outros campos aqui se necessário) ---
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buscaAdmin, setBuscaAdmin] = useState("");
  const produtosFiltrados = productList.filter((produto) =>
    produto.name?.toLowerCase().includes(buscaAdmin.toLowerCase())
  );
  // 1. BUSCAR PRODUTOS NA BASE DE DADOS
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoadingList(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProductList(data || []);
      } catch (err) {
        console.error("Falha ao buscar produtos:", err.message);
        toast.error("Erro ao carregar a lista de produtos.");
      } finally {
        setIsLoadingList(false);
      }
    }

    if (activeView === "lista") {
      fetchProducts();
    }
  }, [activeView]);

  // 2. PREENCHER O FORMULÁRIO QUANDO CLICA EM EDITAR
  useEffect(() => {
    if (activeView === "formulario") {
      if (produtoEmEdicao) {
        // MODO EDIÇÃO: Preenche com os dados do banco
        setNome(produtoEmEdicao.name || "");
        setPreco(produtoEmEdicao.price ? produtoEmEdicao.price.toString() : "");
      } else {
        // MODO CRIAÇÃO: Limpa tudo
        setNome("");
        setPreco("");
      }
    }
  }, [activeView, produtoEmEdicao]);

  // 3. FUNÇÃO DE GUARDAR (CRIA OU ATUALIZA)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepara o objeto com os dados (Ajusta os nomes das colunas conforme a tua tabela)
      const dadosProduto = {
        name: nome,
        price: parseFloat(preco),
        // category_id: 1, <-- Exemplo de outros campos que possas ter
      };

      if (produtoEmEdicao) {
        // ATUALIZAR PRODUTO EXISTENTE
        const { error } = await supabase
          .from("products")
          .update(dadosProduto)
          .eq("id", produtoEmEdicao.id);

        if (error) throw error;
        toast.success("Produto atualizado com sucesso!");
      } else {
        // CRIAR NOVO PRODUTO
        const { error } = await supabase
          .from("products")
          .insert([dadosProduto]);

        if (error) throw error;
        toast.success("Produto criado com sucesso!");
      }

      // Volta para a lista após salvar
      setActiveView("lista");
    } catch (err) {
      console.error("Erro ao salvar produto:", err.message);
      toast.error("Erro ao salvar o produto. Verifica os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. FUNÇÃO DE APAGAR PRODUTO
  const handleDelete = async (id) => {
    if (!window.confirm("Tens a certeza que desejas apagar este produto?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Produto apagado.");
      // Atualiza a lista removendo o item apagado
      setProductList(productList.filter(p => p.id !== id));
    } catch (err) {
      console.error("Erro ao apagar:", err.message);
      toast.error("Não foi possível apagar o produto.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* CABEÇALHO DO PAINEL ADMIN */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel de Administração</h1>
        
        {activeView === "lista" ? (
          <Button 
            onClick={() => {
              setProdutoEmEdicao(null); // Modo de criação
              setActiveView("formulario");
            }} 
            className="bg-black text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Novo Produto
          </Button>
        ) : (
          <Button onClick={() => setActiveView("lista")} variant="outline">
            Voltar para a Lista
          </Button>
        )}
      </div>

      {/* TELA 1: LISTA DE PRODUTOS */}
      {activeView === "lista" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <input
              type="text"
              placeholder="🔍 Buscar produto para editar..."
              value={buscaAdmin}
              onChange={(e) => setBuscaAdmin(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {isLoadingList ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400 h-8 w-8" /></div>
          ) : productList.length === 0 ? (
            <div className="text-center p-10 text-gray-500">Nenhum produto cadastrado ainda.</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
                <tr>
                  <th className="p-4 font-medium">Produto</th>
                  <th className="p-4 font-medium">Preço</th>
                  <th className="p-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{produto.name || "Sem nome"}</td>
                    <td className="p-4">R$ {produto.price ? produto.price.toFixed(2) : "0.00"}</td>
                    <td className="p-4 text-right">
                      {/* BOTÃO EDITAR */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          setProdutoEmEdicao(produto); // Modo de edição
                          setActiveView("formulario");
                        }}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {/* BOTÃO APAGAR */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600 hover:bg-red-50 ml-2"
                        onClick={() => handleDelete(produto.id)}
                        title="Apagar"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      ) : (

        /* TELA 2: FORMULÁRIO DE CRIAR / EDITAR */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
           <h2 className="text-xl font-semibold mb-6">
             {produtoEmEdicao ? "Editar Produto" : "Cadastrar Novo Produto"}
           </h2>
           
           <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
               <input 
                 type="text" 
                 required
                 value={nome}
                 onChange={(e) => setNome(e.target.value)}
                 className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                 placeholder="Ex: Camiseta Preta"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
               <input 
                 type="number" 
                 step="0.01"
                 required
                 value={preco}
                 onChange={(e) => setPreco(e.target.value)}
                 className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                 placeholder="Ex: 89.90"
               />
             </div>

             {/* Se tiveres mais campos (Categoria, Imagem, Descrição), adiciona-os aqui seguindo o mesmo padrão */}

             <div className="pt-4 flex justify-end">
               <Button 
                 type="button" 
                 variant="outline" 
                 className="mr-3"
                 onClick={() => setActiveView("lista")}
               >
                 Cancelar
               </Button>
               <Button 
                 type="submit" 
                 className="bg-black text-white"
                 disabled={isSubmitting}
               >
                 {isSubmitting ? (
                   <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Guardando...</>
                 ) : (
                   "Guardar Produto"
                 )}
               </Button>
             </div>
           </form>
        </div>
      )}
    </div>
  );
}