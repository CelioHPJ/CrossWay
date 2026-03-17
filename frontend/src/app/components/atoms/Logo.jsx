import { Link } from "react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <span className="text-2xl font-semibold fonte-teste tracking-widest text-gray-900">CROSSWAY</span>
     {/* <img 
        src={} 
        alt="Logo Crest Clothing" 
        className="h-20 w-auto" // Ajuste a altura (h-8 = 32px) conforme necessário
      />  */}
    </Link>
  );
}