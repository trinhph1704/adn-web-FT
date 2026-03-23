import type { TrustIndicator } from "../types/home.types";

const indicators: TrustIndicator[] = [
  { value: "10K+", label: "Khách hàng" },
  { value: "50K+", label: "Xét nghiệm ADN" },
  { value: "100+", label: "Chuyên gia" },
];

const TrustSection: React.FC = () => (
  <section className="py-12 text-white md:py-16 bg-gradient-to-br from-blue-600 to-blue-800">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-center md:text-3xl">
        Được tin tưởng bởi
      </h2>
      <div className="flex flex-col gap-6 text-center md:flex-row md:justify-between">
        {indicators.map((indicator, index) => (
          <div key={index} className="flex-1">
            <span className="block mb-2 text-4xl font-bold md:text-5xl">
              {indicator.value}
            </span>
            <p className="text-base md:text-lg">{indicator.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;
