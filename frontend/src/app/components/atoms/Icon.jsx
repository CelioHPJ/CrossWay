export function Icon({ children, size = "medium", className = "" }) {
  const sizes = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  return <span className={`${sizes[size]} ${className}`}>{children}</span>;
}
