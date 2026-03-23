import { Footer, Header } from "@/components/shared";
import {
  Calendar,
  CheckCircle,
  Heart,
  ShieldCheck,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Về chúng tôi | ADN Huyết Thống",
  description:
    "Trung tâm xét nghiệm ADN huyết thống hàng đầu Việt Nam với công nghệ tiên tiến và đội ngũ chuyên gia giàu kinh nghiệm.",
};

const milestones = [
  {
    year: "2008",
    title: "Thành lập công ty",
    description:
      "ADN Huyết Thống được thành lập với sứ mệnh mang công nghệ xét nghiệm ADN tiên tiến đến Việt Nam",
  },
  {
    year: "2012",
    title: "Mở rộng quy mô",
    description:
      "Khai trương phòng lab hiện đại đầu tiên tại TP.HCM với trang thiết bị nhập khẩu từ Mỹ",
  },
  {
    year: "2015",
    title: "Chứng nhận quốc tế",
    description:
      "Đạt chứng nhận ISO 15189 và CAP - tiêu chuẩn vàng trong ngành xét nghiệm y học",
  },
  {
    year: "2018",
    title: "Công nghệ AI",
    description:
      "Ứng dụng trí tuệ nhân tạo trong phân tích ADN, nâng độ chính xác lên 99.99%",
  },
  {
    year: "2020",
    title: "Mở rộng toàn quốc",
    description:
      "Phủ sóng dịch vụ trên toàn quốc với 15 chi nhánh và đội ngũ 200+ chuyên gia",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-blue-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-blue-900">
              <span className="block text-3xl md:text-5xl mt-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ADN Huyết Thống
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-blue-700">
              Trung tâm xét nghiệm ADN huyết thống hàng đầu Việt Nam với công
              nghệ tiên tiến và đội ngũ chuyên gia y tế giàu kinh nghiệm
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-200/50 rounded-full flex items-center justify-center group-hover:bg-blue-300/50 transition-colors duration-300">
                    <Users className="w-8 h-8 text-blue-900" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2 text-blue-900">15+</div>
                <div className="text-blue-600">Năm Kinh Nghiệm</div>
              </div>
              <div className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-200/50 rounded-full flex items-center justify-center group-hover:bg-blue-300/50 transition-colors duration-300">
                    <ShieldCheck className="w-8 h-8 text-blue-900" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2 text-blue-900">99.99%</div>
                <div className="text-blue-600">Độ Chính Xác</div>
              </div>
              <div className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-200/50 rounded-full flex items-center justify-center group-hover:bg-blue-300/50 transition-colors duration-300">
                    <Heart className="w-8 h-8 text-blue-900" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2 text-blue-900">50,000+</div>
                <div className="text-blue-600">Khách Hàng Tin Tưởng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-white border border-blue-100 rounded-xl shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                Sứ mệnh
              </h3>
              <p className="text-sm text-gray-600 md:text-base">
                Mang công nghệ xét nghiệm ADN chính xác, bảo mật đến mọi gia đình
                Việt Nam, giúp xác định quan hệ huyết thống một cách minh bạch.
              </p>
            </div>
            <div className="p-6 bg-white border border-blue-100 rounded-xl shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                Tầm nhìn
              </h3>
              <p className="text-sm text-gray-600 md:text-base">
                Trở thành trung tâm xét nghiệm ADN hàng đầu Đông Nam Á với tiêu
                chuẩn quốc tế và dịch vụ chuyên nghiệp.
              </p>
            </div>
            <div className="p-6 bg-white border border-blue-100 rounded-xl shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                Giá trị cốt lõi
              </h3>
              <p className="text-sm text-gray-600 md:text-base">
                Bảo mật – Chính xác – Chuyên nghiệp. Chúng tôi cam kết bảo vệ
                dữ liệu và mang lại kết quả đáng tin cậy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 md:py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Hành Trình Phát Triển
            </h2>
            <p className="text-lg text-blue-700 max-w-3xl mx-auto">
              Từ một startup nhỏ đến trung tâm xét nghiệm ADN hàng đầu Việt Nam
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200 hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-full md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                    }`}
                  >
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-center mb-3 justify-center md:justify-start">
                        <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-2xl font-bold text-blue-900">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-blue-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-blue-700">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="relative z-10 hidden md:flex">
                    <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
