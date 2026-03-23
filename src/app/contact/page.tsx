import { Footer, Header } from "@/components/shared";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Liên hệ | ADN Huyết Thống",
  description:
    "Liên hệ với ADN Huyết Thống để được tư vấn và đặt lịch xét nghiệm ADN.",
};

const contactInfo = [
  {
    title: "Email hỗ trợ",
    value: "bloodlineDNA@support.com",
    icon: Mail,
    link: "mailto:bloodlineDNA@support.com",
  },
  {
    title: "Hotline 24/7",
    value: "+84 342 555 702",
    icon: Phone,
    link: "tel:+84342555702",
  },
  {
    title: "Địa chỉ",
    value: "TP. Hồ Chí Minh",
    icon: MapPin,
    link: "#",
  },
  {
    title: "Giờ làm việc",
    value: "Thứ 2 - Chủ Nhật: 7:00 - 22:00",
    icon: Clock,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Header />
      <main className="px-4 py-12 mx-auto max-w-5xl sm:px-6 lg:px-8">
        <section className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
            Liên hệ với chúng tôi
          </h1>
          <p className="max-w-3xl mx-auto text-sm text-gray-600 md:text-base">
            Đội ngũ chuyên gia sẵn sàng tư vấn và hỗ trợ bạn về dịch vụ xét
            nghiệm ADN huyết thống.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item) => (
            <div
              key={item.title}
              className="p-6 bg-white border border-blue-100 rounded-xl shadow-sm"
            >
              <div className="flex items-center mb-3">
                <item.icon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
              </div>
              {item.link ? (
                <Link
                  href={item.link}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.value}
                </Link>
              ) : (
                <p className="text-sm text-gray-600">{item.value}</p>
              )}
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="p-6 bg-white border border-blue-100 rounded-xl shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <ContactForm />
          </div>

          <div className="p-6 bg-white border border-blue-100 rounded-xl shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Tại sao chọn chúng tôi?
            </h2>
            <ul className="space-y-3 text-sm text-gray-600 md:text-base">
              <li>Độ chính xác 99.99% với công nghệ phân tích ADN tiên tiến.</li>
              <li>Bảo mật tuyệt đối, tuân thủ tiêu chuẩn quốc tế.</li>
              <li>Kết quả nhanh trong 3-5 ngày làm việc.</li>
              <li>Đội ngũ tư vấn 24/7, chuyên nghiệp.</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
