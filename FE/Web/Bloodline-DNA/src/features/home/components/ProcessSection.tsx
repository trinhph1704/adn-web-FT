import { Calendar, Dna, FileText, FlaskConical } from "lucide-react";
import type { ProcessStep } from "../types/home.types";

const steps: ProcessStep[] = [
  {
    icon: Calendar,
    title: "Đặt lịch",
    description: "Đăng ký trực tuyến hoặc liên hệ để đặt lịch lấy mẫu.",
  },
  {
    icon: FlaskConical,
    title: "Lấy mẫu",
    description: "Lấy mẫu ADN đơn giản tại cơ sở hoặc tại nhà.",
  },
  {
    icon: Dna,
    title: "Phân tích",
    description: "Mẫu được phân tích trong phòng thí nghiệm hiện đại.",
  },
  {
    icon: FileText,
    title: "Nhận kết quả",
    description: "Kết quả được gửi qua email bảo mật hoặc giao trực tiếp.",
  },
];

const ProcessSection: React.FC = () => (
  <section className="py-16 md:py-20 bg-blue-50">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-center text-gray-800 md:text-3xl">
        Quy trình xét nghiệm ADN huyết thống
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={index} className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600/10">
              <step.icon size={32} className="text-blue-600" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-gray-800 md:text-lg">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 md:text-base">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSection;
