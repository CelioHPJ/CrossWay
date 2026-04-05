import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  // 🌟 PERSISTÊNCIA: Inicializa tentando ler do LocalStorage
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("crossway_cart");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // 🌟 PERSISTÊNCIA: Salva no LocalStorage sempre que 'items' mudar
  useEffect(() => {
    localStorage.setItem("crossway_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, size, color) => {
    // 1. Descobre o stock real da variante selecionada
    const varianteSelecionada = product.product_variants?.find(
      (v) => v.size === size && v.color === color
    );
    const stockDisponivel = varianteSelecionada ? varianteSelecionada.stock : 0;

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      // 2. Se já tem no carrinho, verifica limite de estoque
      if (existingItem) {
        if (existingItem.quantity >= stockDisponivel) {
          alert(`Temos apenas ${stockDisponivel} unidade(s) deste tamanho e cor em estoque.`);
          return prevItems;
        }

        return prevItems.map((item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // 3. Se é o primeiro a ser adicionado
      if (stockDisponivel < 1) {
        alert("Desculpe, este produto esgotou nesta variação.");
        return prevItems;
      }

      return [
        ...prevItems, 
        { ...product, quantity: 1, selectedSize: size, selectedColor: color }
      ];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setItems((prevItems) => 
      prevItems.filter(
        (item) => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId && item.selectedSize === size && item.selectedColor === color) {
          
          const varianteSelecionada = item.product_variants?.find(
            (v) => v.size === size && v.color === color
          );
          const stockDisponivel = varianteSelecionada ? varianteSelecionada.stock : 0;

          if (quantity > stockDisponivel) {
            alert(`Limite atingido. Temos apenas ${stockDisponivel} unidade(s) disponíveis.`);
            return { ...item, quantity: stockDisponivel };
          }

          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items, // O Header deve usar 'items' ou 'items.length'
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}