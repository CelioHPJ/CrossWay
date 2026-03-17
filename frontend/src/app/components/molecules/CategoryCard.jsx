import { Link } from "react-router";

export function CategoryCard({ category }) {
  // Se 'category' for um objeto como { name: "Camisetas" }, use category.name
  // Se 'category' for apenas a string "Camisetas", use apenas category
  const categoryName = typeof category === 'object' ? category.name : category;

  return (
    <Link 
      // 1. Use crases ( ` ) em vez de aspas simples para que o ${} funcione
      to={`/products/${categoryName.toLowerCase()}`}
      className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition"
    >
      {/* 2. Mostre o nome da categoria aqui */}
      <p className="font-semibold text-lg">{categoryName}</p>
    </Link>
  );
}