import React, { useState } from "react";
import { Link } from "react-router"; 
import { useCart } from "../../context/CartContext.jsx";
import { Button } from "../atoms/button.jsx"; 
import { Input } from "../atoms/Input.jsx"; 
import { MapPin, CreditCard, QrCode, ChevronLeft } from "lucide-react";

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

export function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  // ==========================================
  // ESTADO CENTRALIZADO DO FORMULÁRIO
  // ==========================================
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
    cardCvv: ""
  });

  // ==========================================
  // HANDLER DE ATUALIZAÇÃO E FORMATAÇÃO
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplica a máscara correspondente ao campo
    if (name === "phone") formattedValue = maskPhone(value);
    else if (name === "cep") formattedValue = maskCEP(value);
    else if (name === "cardNumber") formattedValue = maskCardNumber(value);
    else if (name === "cardExpiry") formattedValue = maskExpiry(value);
    else if (name === "cardCvv") formattedValue = maskCVV(value);

    // Atualiza o estado
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleCheckout = () => {
    console.log("Dados prontos para envio ao backend:", formData);
    alert("Abra o console (F12) para ver o JSON com os dados formatados!");
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
                <Input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="E-mail" 
                  className="h-12 rounded-none border-gray-300 focus-visible:ring-black" 
                />
                <Input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Telefone / WhatsApp (Ex: 35 99999-9999)" 
                  className="h-12 rounded-none border-gray-300 focus-visible:ring-black" 
                />
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
                <Input 
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  placeholder="CEP" 
                  className="h-12 rounded-none border-gray-300 md:col-span-2" 
                />
                <Input 
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Rua / Avenida" 
                  className="h-12 rounded-none border-gray-300 md:col-span-2" 
                />
                <Input 
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="Número" 
                  className="h-12 rounded-none border-gray-300" 
                />
                <Input 
                  name="complement"
                  value={formData.complement}
                  onChange={handleInputChange}
                  placeholder="Complemento" 
                  className="h-12 rounded-none border-gray-300" 
                />
                <Input 
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  placeholder="Bairro" 
                  className="h-12 rounded-none border-gray-300" 
                />
                <Input 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Cidade" 
                  className="h-12 rounded-none border-gray-300" 
                />
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
                  <Input 
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Número do Cartão" 
                    className="h-12 rounded-none border-gray-300" 
                  />
                  <Input 
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="Nome impresso no cartão" 
                    className="h-12 rounded-none border-gray-300" 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="Validade (MM/AA)" 
                      className="h-12 rounded-none border-gray-300" 
                    />
                    <Input 
                      name="cardCvv"
                      type="password"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      placeholder="CVV" 
                      className="h-12 rounded-none border-gray-300" 
                    />
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
                className="w-full mt-8 h-14 bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest text-sm transition-colors"
                onClick={handleCheckout}
              >
                Confirmar Pedido
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}