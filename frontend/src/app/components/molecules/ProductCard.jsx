import { Link } from "react-router";
import { Image } from "../atoms/Image.jsx";

export function ProductCard({ product }) {
  return (
    <Link to={`/produto/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="font-semibold text-lg mb-2 group-hover:text-gray-600 transition">
        {product.name}
      </h3>
      <p className="text-gray-600 mb-2">{product.category}</p>
      <p className="font-bold text-xl">R$ {product.price.toFixed(2)}</p>
    </Link>
  );
}
