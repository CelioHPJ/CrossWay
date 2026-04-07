import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const abacateKey = Deno.env.get("ABACATEPAY_API_KEY");

    if (!abacateKey) {
      throw new Error("A chave da API (ABACATEPAY_API_KEY) não está configurada neste ambiente!");
    }

    const data = await req.json();
    console.log("Recebendo solicitação de checkout com payload:", data);

    const abacatePayload = {
      frequency: "ONE_TIME",
      methods: [data.method],
      products: data.items.map((item: any) => ({
        externalId: item.name.substring(0, 50),
        name: item.name,
        quantity: item.quantity,
        price: Math.floor(item.price), // Preço em centavos
      })),
      returnUrl: `${data.origin || 'http://localhost:5173'}/cart`,
      completionUrl: `${data.origin || 'http://localhost:5173'}/success${data.orderId ? '?order_id=' + data.orderId : ''}`,
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        cellphone: data.customer.cellphone,
        taxId: data.customer.taxId.replace(/\D/g, ""),
      }
    };

    const response = await fetch("https://api.abacatepay.com/v1/billing/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${abacateKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(abacatePayload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || JSON.stringify(result));
    }

    // A resposta do Abacate API é { data: { url: "..." } } na estrutura oficial deles (o objeto billing fica em 'data')
    // Pela documentação oficial e SDKs, ele retorna o objeto billing que tem a key `url` ou `checkoutUrl`.
    const checkoutUrl = result.data?.url || result.url;

    return new Response(
      JSON.stringify({ checkoutUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Erro na integração do AbacatePay:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
