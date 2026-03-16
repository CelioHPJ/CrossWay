import { Link } from "react-router";

export function NavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-gray-700 hover:text-gray-900 transition"
    >
      {children}
    </Link>
  );
}
