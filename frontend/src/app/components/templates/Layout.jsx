import { Outlet } from "react-router";
import { Header } from "../organisms/Header.jsx";
import { Footer } from "../organisms/Footer.jsx";

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
