export function BenefitCard({ icon, title, description }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white text-2xl">{icon}</span>
      </div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
