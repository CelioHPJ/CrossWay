export function FilterButton({ category, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full font-medium transition ${
        isActive
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {category}
    </button>
  );
}
