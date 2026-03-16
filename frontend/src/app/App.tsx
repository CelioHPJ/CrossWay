import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CartProvider } from "./context/CartContext.jsx";

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}