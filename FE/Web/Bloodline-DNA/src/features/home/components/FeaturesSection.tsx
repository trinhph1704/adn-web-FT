import { Lock, Rocket, ShieldCheck, Users } from "lucide-react";
import type { Feature } from "../types/home.types";

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Độ chính xác 99.99%",
    description:
      "Công nghệ phân tích ADN tiên tiến đảm bảo kết quả đáng tin cậy.",
  },
  {
    icon: Lock,
    title: "Bảo mật tuyệt đối",
    description: "Dữ liệu được mã hóa, tuân thủ tiêu chuẩn bảo mật quốc tế.",
  },
  {
    icon: Rocket,
    title: "Kết quả nhanh chóng",
    description: "Nhận kết quả trong 3-5 ngày làm việc, hỗ trợ giao tận nơi.",
  },
  {
    icon: Users,
    title: "Hỗ trợ chuyên gia",
    description: "Đội ngũ tư vấn 24/7, giải đáp mọi thắc mắc về xét nghiệm.",
  },
];

const FeaturesSection: React.FC = () => (
  <section id="features" className="py-16 bg-white md:py-20">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-center text-gray-800 md:text-3xl">
        Vì sao chọn dịch vụ xét nghiệm ADN của chúng tôi?
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 text-center transition-shadow border border-blue-200 rounded-lg shadow-md bg-blue-50 hover:shadow-lg"
          >
            <feature.icon size={40} className="mx-auto mb-4 text-blue-600" />
            <h3 className="mb-2 text-lg font-semibold text-gray-800 md:text-xl">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 md:text-base">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
