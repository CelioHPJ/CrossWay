import { Filter } from "lucide-react";
import { FilterButton } from "../molecules/FilterButton.jsx";

export function ProductFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5" />
        <span className="font-semibold">Filtrar por categoria:</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <FilterButton
            key={category}
            category={category}
            isActive={selectedCategory === category}
            onClick={() => onSelectCategory(category)}
          />
        ))}
      </div>
    </div>
  );
}
