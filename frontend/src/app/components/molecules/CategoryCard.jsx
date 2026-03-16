import { Link } from "react-router";

export function CategoryCard({ category }) {
  return (
    <Link
      to="/produtos"
      className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition"
    >
      <p className="font-semibold text-lg">{category}</p>
    </Link>
  );
}
