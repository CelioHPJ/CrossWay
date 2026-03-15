import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./components/Home.jsx";
import { Products } from "./components/Products.jsx";
import { ProductDetail } from "./components/ProductDetail.jsx";
import { Cart } from "./components/Cart.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "produtos", Component: Products },
      { path: "produto/:id", Component: ProductDetail },
      { path: "carrinho", Component: Cart },
    ],
  },
]);