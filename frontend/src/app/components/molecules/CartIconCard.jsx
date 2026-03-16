import { Trash2, Plus, Minus } from "lucide-react";
import { Image } from "../atoms/Image.jsx";

export function CartItemCard({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex gap-6">
      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image src={item.image} alt={item.name} />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-gray-600">{item.category}</p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-600 hover:text-red-800 transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p>Tamanho: {item.selectedSize}</p>
          <p>Cor: {item.selectedColor}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold w-8 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="font-bold text-xl">
            R$ {(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
