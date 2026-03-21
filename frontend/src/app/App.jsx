import { RouterProvider } from "react-router";
import { router } from "./routes.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider> 
    </AuthProvider>
    
  );
}