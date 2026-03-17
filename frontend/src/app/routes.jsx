import { createBrowserRouter } from "react-router";
import { Layout } from "./components/templates/Layout";
import { HomePage } from "./components/pages/HomePage";
import { ProductsPage } from "./components/pages/ProductsPage";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { CartPage } from "./components/pages/CartPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/product/:id", element: <ProductDetailPage /> },
      { path: "/products/:category", element: <ProductsPage /> },
      { path: "/cart", element: <CartPage /> },
    ],
  },
]);