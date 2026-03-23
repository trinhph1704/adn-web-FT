import { Collapse } from "antd";
import { MessageSquare } from "lucide-react";
import type { FAQ } from "../types/home.types";

const { Panel } = Collapse;

const faqs: FAQ[] = [
  {
    key: "1",
    question: "Xét nghiệm ADN huyết thống có chính xác không?",
    answer:
      "Có, xét nghiệm của chúng tôi đạt độ chính xác 99.99% nhờ công nghệ phân tích ADN tiên tiến và quy trình kiểm soát chất lượng nghiêm ngặt.",
  },
  {
    key: "2",
    question: "Mất bao lâu để nhận kết quả?",
    answer:
      "Kết quả thường được gửi trong vòng 3-5 ngày làm việc sau khi nhận mẫu, tùy thuộc vào loại xét nghiệm.",
  },
  {
    key: "3",
    question: "Thông tin của tôi có được bảo mật không?",
    answer:
      "Tuyệt đối! Mọi dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế. Chúng tôi không chia sẻ thông tin với bên thứ ba.",
  },
  {
    key: "4",
    question: "Cần chuẩn bị gì trước khi lấy mẫu ADN?",
    answer:
      "Không cần chuẩn bị đặc biệt. Chỉ cần đến cơ sở hoặc sắp xếp lấy mẫu tại nhà theo lịch hẹn.",
  },
  {
    key: "5",
    question: "Xét nghiệm có thể thực hiện cho trẻ em không?",
    answer:
      "Có, xét nghiệm ADN an toàn cho mọi lứa tuổi, bao gồm trẻ em, với quy trình lấy mẫu không xâm lấn.",
  },
];

const FAQSection: React.FC = () => (
  <section className="py-16 md:py-20 bg-blue-50">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-center text-gray-800 md:text-3xl">
        Câu hỏi thường gặp
      </h2>
      <Collapse
        accordion
        bordered={false}
        className="bg-white rounded-lg shadow-md"
        expandIcon={({ isActive }) => (
          <MessageSquare
            size={20}
            className={`text-blue-600 transition-transform ${
              isActive ? "rotate-90" : ""
            }`}
          />
        )}
      >
        {faqs.map((faq) => (
          <Panel header={faq.question} key={faq.key}>
            <p className="text-sm text-gray-600 md:text-base">{faq.answer}</p>
          </Panel>
        ))}
      </Collapse>
    </div>
  </section>
);

export default FAQSection;
