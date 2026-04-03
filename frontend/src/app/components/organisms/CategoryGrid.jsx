import { CategoryCard } from "../molecules/CategoryCard.jsx";

export function CategoryGrid({ categories }) {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Categorias</h2>
          <p className="text-gray-600 text-lg">
            Explore nossas categorias de produtos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
