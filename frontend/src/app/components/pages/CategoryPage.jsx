import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { supabase } from "../../../utils/supabase/client"; // Ajuste o caminho
import { Loader2 } from "lucide-react";

export function CategoryPage() {
  // O useParams é a ferramenta que lê a URL. 
  // Se o link for /categorias/camisetas, o "slug" vai valer "camisetas"
  const { slug } = useParams(); 
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryProducts() {
      setLoading(true);
      
      // Transformamos "camisetas-pretas" de volta para "camisetas pretas" para procurar no banco
      const searchTerm = slug.replace(/-/g, ' ');

      // Vamos ao Supabase buscar apenas produtos onde a coluna 'category' bata com o nome
      try {
        // PASSO 1: Descobrir o ID da categoria
        // IMPORTANTE: Troque 'categories' pelo nome exato da sua tabela de categorias
        // e 'name' pelo nome da coluna que guarda o texto da categoria lá dentro.
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories') 
          .select('id')
          .ilike('name', `%${searchTerm}%`)
          .maybeSingle(); // Pega apenas um resultado

        // Se a categoria não existir ou der erro, paramos por aqui e deixamos a lista vazia
        if (categoryError || !categoryData) {
          console.warn("Categoria não encontrada:", categoryError?.message);
          setProducts([]);
          setLoading(false);
          return;
        }

        const categoryId = categoryData.id;

        // PASSO 2: Buscar os produtos usando o ID que descobrimos
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId); 

        if (productsError) {
          console.error("Erro ao buscar os produtos:", productsError);
          setProducts([]);
        } else {
          setProducts(productsData || []);
        }

      } catch (err) {
        console.error("Erro inesperado:", err);
      } finally {
        setLoading(false);
      }
    
      setLoading(false);
    }

    fetchCategoryProducts();
  }, [slug]); // O useEffect roda de novo sempre que o "slug" na URL mudar

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="mb-10 text-center">
        {/* Título dinâmico que fica com a primeira letra maiúscula */}
        <h1 className="text-4xl font-bold text-gray-900 capitalize">
          {slug.replace(/-/g, ' ')}
        </h1>
        <p className="mt-4 text-gray-600">Confira os produtos desta categoria</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">Poxa, ainda não temos produtos nesta categoria.</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Voltar para o início
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Aqui nós desenhamos os produtos que vieram do banco */}
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all p-4 bg-white">
              {/* Se você tiver imagem, colocaria a tag <img src={product.image_url} /> aqui */}
              <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                Sem Imagem
              </div>
              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
              <p className="text-gray-600 mt-1">R$ {product.price.toFixed(2)}</p>
              
              <Link 
                to={`/product/${product.id}`}
                className="mt-4 block w-full text-center bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}