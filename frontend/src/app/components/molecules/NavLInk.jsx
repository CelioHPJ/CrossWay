import { Link } from "react-router";

export function NavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-black hover:text-black transition"
    >
      {children}
    </Link>
  );
}
