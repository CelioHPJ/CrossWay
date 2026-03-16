import { CartItemCard } from "../molecules/CartItemCard.jsx";

export function CartList({ items, onRemoveItem, onUpdateQuantity, onClearCart }) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <CartItemCard
          key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
          item={item}
          onRemove={onRemoveItem}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}

      {items.length > 0 && (
        <button
          onClick={onClearCart}
          className="text-red-600 hover:text-red-800 font-medium transition"
        >
          Limpar Carrinho
        </button>
      )}
    </div>
  );
}
