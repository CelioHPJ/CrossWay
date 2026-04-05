import { createBrowserRouter } from "react-router";
import { Layout } from "./components/templates/Layout";
import { HomePage } from "./components/pages/HomePage";
import { ProductsPage } from "./components/pages/ProductsPage";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { CartPage } from "./components/pages/CartPage";
import { LoginPage } from "./components/pages/LoginPage";
import { SignupPage } from "./components/pages/SignupPage";
import { UserPage } from "./components/pages/UserPage";
import { AdminPage } from "./components/pages/AdminPage";
import { AdminRoute } from "./components/atoms/AdminRoute";
import { CategoryPage } from "./components/pages/CategoryPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/product/:id", element: <ProductDetailPage /> },
      { path: "/products/:slug", element: <CategoryPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/profile", element: <UserPage /> },
      {path: "/AdminPage", element: <AdminRoute><AdminPage /></AdminRoute> }
    ],
  },
]);