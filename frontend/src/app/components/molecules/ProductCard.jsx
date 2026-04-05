import { Link } from "react-router";

export function ProductCard({ product }) {
  // 🌟 A MÁGICA ESTÁ AQUI: Se product.image existir, usa-o. Se for null/vazio, usa o link do placeholder.
  const imagemSegura = product.image_url || "https://placehold.co/400x400/eeeeee/999999?text=Sem+Foto";

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
        
        {/* Substituímos o componente <Image> pela tag normal para garantir que funciona a 100% */}
        <img
          src={imagemSegura}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
      </div>
      <h3 className="font-semibold text-lg mb-2 group-hover:text-gray-600 transition">
        {product.name}
      </h3>
      <p className="text-gray-600 mb-2">{product.category}</p>
      <p className="font-bold text-xl">R$ {product.price?.toFixed(2) || "0,00"}</p>
    </Link>
  );
}