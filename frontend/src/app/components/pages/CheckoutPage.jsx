import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { ordersApi } from "../../services/api.js";
import { Button } from "../atoms/button.jsx";
import { Input } from "../atoms/Input.jsx";
import { MapPin, CreditCard, QrCode, ChevronLeft, Loader2 } from "lucide-react";
import { supabase } from "../../../utils/supabase/client.js";
import { toast } from "sonner";

// ==========================================
// FUNÇÕES DE MÁSCARA (REGEX)
// ==========================================
const maskPhone = (value) => {
  const numericValue = value.replace(/\D/g, ""); // Remove tudo que não for número
  if (numericValue.length === 0) return "";
  if (numericValue.length <= 10) {
    return numericValue.replace(/^(\d{2})(\d{0,4})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "");
  }
  return numericValue.replace(/^(\d{2})(\d{0,5})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "");
};

const maskCEP = (value) => {
  const numericValue = value.replace(/\D/g, "");
  return numericValue.replace(/^(\d{5})(\d{0,3}).*/, "$1-$2").replace(/-$/, "");
};

const maskCPF = (value) => {
  const numericValue = value.replace(/\D/g, "");
  return numericValue
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskCardNumber = (value) => {
  const numericValue = value.replace(/\D/g, "");
  return numericValue.replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19); // Agrupa de 4 em 4 e limita a 16 dígitos (19 com espaços)
};

const maskExpiry = (value) => {
  const numericValue = value.replace(/\D/g, "");
  return numericValue.replace(/^(\d{2})(\d{0,2}).*/, "$1/$2").replace(/\/$/, "");
};

const maskCVV = (value) => {
  return value.replace(/\D/g, "").slice(0, 4); // Apenas números, max 4 dígitos
};

const FormField = ({ error, children, className }) => (
  <div className={`flex flex-col ${className || ""}`}>
    {children}
    {error && <span className="text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">{error}</span>}
  </div>
);

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);

  // ==========================================
  // ESTADO CENTRALIZADO DO FORMULÁRIO
  // ==========================================
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    taxId: "",
    countName: ""
  });

  // ==========================================
  // BUSCA USUÁRIO LOGADO NO SUPABASE
  // ==========================================
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Pega o nome do metadata (se cadastrou com nome) ou usa o email como fallback
        const userName = user.user_metadata?.full_name || user.user_metadata?.name || "";

        setFormData((prev) => ({
          ...prev,
          countName: userName
        }));
      }
    });
  }, []);

  // ==========================================
  // HANDLER DE ATUALIZAÇÃO E FORMATAÇÃO
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplica a máscara correspondente ao campo
    if (name === "phone") formattedValue = maskPhone(value);
    else if (name === "cep") formattedValue = maskCEP(value);
    else if (name === "taxId") formattedValue = maskCPF(value);
    else if (name === "cardNumber") formattedValue = maskCardNumber(value);
    else if (name === "cardExpiry") formattedValue = maskExpiry(value);
    else if (name === "cardCvv") formattedValue = maskCVV(value);

    // Atualiza o estado
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));

    // Remove o erro assim que o usuário edita
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckout = async () => {
    const newErrors = {};

    // Validação do Contato
    if (!formData.email) newErrors.email = "Campo obrigatório";
    if (!formData.phone) newErrors.phone = "Campo obrigatório";
    if (!formData.taxId) newErrors.taxId = "Campo obrigatório";

    // Validação do Endereço
    if (!formData.cep) newErrors.cep = "Campo obrigatório";
    if (!formData.street) newErrors.street = "Campo obrigatório";
    if (!formData.number) newErrors.number = "Campo obrigatório";
    if (!formData.neighborhood) newErrors.neighborhood = "Campo obrigatório";
    if (!formData.city) newErrors.city = "Campo obrigatório";

    // Validação do Cartão de Crédito
    if (paymentMethod === "credit_card") {
      if (!formData.cardNumber) newErrors.cardNumber = "Campo obrigatório";
      if (!formData.cardName) newErrors.cardName = "Campo obrigatório";
      if (!formData.cardExpiry) newErrors.cardExpiry = "Campo obrigatório";
      if (!formData.cardCvv) newErrors.cardCvv = "Campo obrigatório";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Interrompe se houver erros
    }

    setIsProcessing(true);

    try {
      // 1. Gera a ordem Pendente no banco do Supabase via api.js local
      let pendingOrderId = "";
      if (user?.id) {
        try {
          // ordersApi.create espera: userId, items, total
          const orderRes = await ordersApi.create(user.id, items, finalTotal);
          pendingOrderId = orderRes?.orderId || orderRes?.id || (Array.isArray(orderRes) && orderRes[0]?.id) || "";
          console.log("Ordem pendente gerada:", pendingOrderId);
        } catch (dbError) {
          console.warn("Aviso: Falha não crítica ao salvar a ordem inicial offline", dbError);
        }
      }

      // Prepara o payload convertendo o preço pra centavos exigidos pela API do AbacatePay
      const payload = {
        origin: window.location.origin, // Pega dinamicamente se o vite tá na 5173, 5174, etc
        orderId: pendingOrderId, // Enviaremos a orderId na requisição!
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price * 100
        })),
        customer: {
          countname: formData.countName,
          name: formData.countName || formData.cardName || formData.email, // Prioriza o Nome Oficial do Usuário logado
          email: formData.email,
          cellphone: formData.phone.replace(/\D/g, ""), // Tira os parênteses e hifens da máscara
          taxId: formData.taxId.replace(/\D/g, ""),
        },
        method: paymentMethod === 'pix' ? 'PIX' : 'CARD'
      };

      console.log("Chamando Edge Function de forma direta...");

      // Faz um fetch direto pro ambiente localhost sem precisar "quebrar" o .env pro restante do site
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro no servidor de pagamentos.");
      }

      if (data && data.checkoutUrl) {
        // Redireciona de fato o usuário para o gateway
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("O link de checkout não foi retornado pelo AbacatePay.");
      }

    } catch (error) {
      console.error("Erro no checkout:", error);
      toast.error("Houve um erro ao processar seu pagamento. Confira o console para detalhes.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulação de frete fixo
  const shippingCost = totalPrice > 500 ? 0 : 45.00;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/cart" className="flex items-center text-md font-medium text-gray-700 hover:text-black transition">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar para Sacola
          </Link>
          <h1 className="text-xl font-medium tracking-widest uppercase">Crossway</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          <div className="lg:col-span-7 space-y-12">

            {/* Seção 1: Contato */}
            <section>
              <h2 className="text-xl font-medium tracking-wider uppercase mb-6 flex items-center gap-3">
                <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
                Contato
              </h2>
              <div className="space-y-4">
                <FormField error={errors.email}>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E-mail"
                    className="h-12 rounded-none border-gray-300 focus-visible:ring-black"
                    aria-invalid={!!errors.email}
                  />
                </FormField>
                <FormField error={errors.phone}>
                  <Input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Telefone / WhatsApp (Ex: 35 99999-9999)"
                    className="h-12 rounded-none border-gray-300 focus-visible:ring-black"
                    aria-invalid={!!errors.phone}
                  />
                </FormField>

                <FormField error={errors.taxId}>
                  <Input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    placeholder="CPF"
                    className="h-12 rounded-none border-gray-300 focus-visible:ring-black"
                    aria-invalid={!!errors.taxId}
                  />
                </FormField>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Seção 2: Entrega */}
            <section>
              <h2 className="text-xl font-medium tracking-wider uppercase mb-6 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                Endereço de Entrega
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField error={errors.cep} className="md:col-span-2">
                  <Input
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="CEP"
                    className="h-12 rounded-none border-gray-300"
                    aria-invalid={!!errors.cep}
                  />
                </FormField>
                <FormField error={errors.street} className="md:col-span-2">
                  <Input
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Rua / Avenida"
                    className="h-12 rounded-none border-gray-300"
                    aria-invalid={!!errors.street}
                  />
                </FormField>
                <FormField error={errors.number}>
                  <Input
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="Número"
                    className="h-12 rounded-none border-gray-300"
                    aria-invalid={!!errors.number}
                  />
                </FormField>
                <FormField error={errors.complement}>
                  <Input
                    name="complement"
                    value={formData.complement}
                    onChange={handleInputChange}
                    placeholder="Complemento (Opcional)"
                    className="h-12 rounded-none border-gray-300"
                  />
                </FormField>
                <FormField error={errors.neighborhood}>
                  <Input
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Bairro"
                    className="h-12 rounded-none border-gray-300"
                    aria-invalid={!!errors.neighborhood}
                  />
                </FormField>
                <FormField error={errors.city}>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Cidade"
                    className="h-12 rounded-none border-gray-300"
                    aria-invalid={!!errors.city}
                  />
                </FormField>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Seção 3: Pagamento */}
            <section>
              <h2 className="text-xl font-medium tracking-wider uppercase mb-6 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                Pagamento
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`border p-4 flex flex-col items-center justify-center gap-3 transition-colors ${paymentMethod === "credit_card" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">Cartão de Crédito</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("pix")}
                  className={`border p-4 flex flex-col items-center justify-center gap-3 transition-colors ${paymentMethod === "pix" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <QrCode className="w-6 h-6" />
                  <span className="text-sm font-medium">PIX</span>
                </button>
              </div>

              {paymentMethod === "credit_card" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <FormField error={errors.cardNumber}>
                    <Input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="Número do Cartão"
                      className="h-12 rounded-none border-gray-300"
                      aria-invalid={!!errors.cardNumber}
                    />
                  </FormField>
                  <FormField error={errors.cardName}>
                    <Input
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="Nome impresso no cartão"
                      className="h-12 rounded-none border-gray-300"
                      aria-invalid={!!errors.cardName}
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField error={errors.cardExpiry}>
                      <Input
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="Validade (MM/AA)"
                        className="h-12 rounded-none border-gray-300"
                        aria-invalid={!!errors.cardExpiry}
                      />
                    </FormField>
                    <FormField error={errors.cardCvv}>
                      <Input
                        name="cardCvv"
                        type="password"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        placeholder="CVV"
                        className="h-12 rounded-none border-gray-300"
                        aria-invalid={!!errors.cardCvv}
                      />
                    </FormField>
                  </div>
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="p-6 bg-gray-50 border border-gray-100 text-center animate-in fade-in duration-500">
                  <p className="text-gray-600 font-light">O QR Code para pagamento será gerado após a confirmação do pedido.</p>
                </div>
              )}
            </section>
          </div>

          {/* ==========================================
              COLUNA DIREITA: Resumo do Pedido
              ========================================== */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50 p-8 lg:sticky lg:top-8">
              <h2 className="text-xl font-medium tracking-wider uppercase mb-8">Resumo do Pedido</h2>

              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                    <div className="w-20 h-20 bg-white border border-gray-100 flex items-center justify-center p-2 flex-shrink-0">
                      <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.selectedSize && `Tam: ${item.selectedSize}`} {item.selectedColor && `| Cor: ${item.selectedColor}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Frete</span>
                  <span>{shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <Button
                className="w-full mt-8 h-14 bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest text-sm transition-colors disabled:opacity-50"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Aguarde...
                  </span>
                ) : (
                  "Confirmar Pedido"
                )}
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}