import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { Badge } from "../atoms/Badge.jsx";

export function CartIcon({ itemCount }) {
  return (
    <Link to="/carrinho" className="relative flex items-center text-gray-700 hover:text-gray-900 transition">
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && <Badge>{itemCount}</Badge>}
    </Link>
  );
}
