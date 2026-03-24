import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Loader2, Lock, Mail } from "lucide-react";
import { supabase } from "../../../utils/supabase/client";
import { Input } from "../atoms/Input.jsx";
import { Button } from "../atoms/button.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);

  const redirectTo = useMemo(
    () => location.state?.from?.pathname || "/",
    [location.state]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }

    try {
      setIsLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("E-mail ou senha inválidos. Tente novamente.");
        return;
      }

      navigate(redirectTo, { replace: true });
    } catch (unexpectedError) {
      setError("Não foi possível fazer login agora. Tente novamente em instantes.");
      console.error("Erro inesperado no login:", unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Digite seu e-mail para receber o link de redefinição.");
      return;
    }

    try {
      setIsResetLoading(true);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email
      );

      if (resetError) {
        setError("Não foi possível enviar o e-mail de redefinição.");
        return;
      }

      setMessage(
        "Enviamos um link para redefinir sua senha. Verifique seu e-mail."
      );
    } catch (unexpectedError) {
      setError("Erro inesperado ao solicitar redefinição de senha.");
      console.error("Erro inesperado ao resetar senha:", unexpectedError);
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-160px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Entrar</h1>
            <p className="mt-2 text-gray-600">
              Acesse sua conta para acompanhar pedidos e finalizar compras.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  className="h-11 pl-10"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  className="h-11 pl-10"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {message}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-gray-700 hover:text-black hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading || isResetLoading}
              >
                {isResetLoading ? "Enviando..." : "Esqueci minha senha"}
              </button>
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-black text-white hover:bg-gray-800"
              disabled={isLoading || isResetLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar na minha conta"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Ainda não tem conta?{" "}
            <Link
              to="/signup"
              className="font-semibold text-gray-900 hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
