import { BenefitCard } from "../molecules/BenefitCard.jsx";

export function BenefitsSection() {
  const benefits = [
    {
      icon: "🚚",
      title: "Frete Grátis",
      description: "Para compras acima de R$ 200",
    },
    {
      icon: "🔄",
      title: "Troca Facilitada",
      description: "30 dias para trocar ou devolver",
    },
    {
      icon: "💳",
      title: "Pagamento Seguro",
      description: "Várias formas de pagamento",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {benefits.map((benefit, index) => (
          <BenefitCard key={index} {...benefit} />
        ))}
      </div>
    </section>
  );
}
