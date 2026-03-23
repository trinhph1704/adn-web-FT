import { AiFillStar } from "react-icons/ai";
import type { Testimonial } from "../types/home.types";

const testimonials: Testimonial[] = [
  {
    content:
      "Dịch vụ rất chuyên nghiệp, kết quả nhanh và bảo mật. Tôi đã xác định được quan hệ huyết thống một cách dễ dàng.",
    name: "Nguyễn Văn A",
    location: "Hà Nội",
    rating: 5,
  },
  {
    content:
      "Đội ngũ hỗ trợ rất nhiệt tình, giải đáp mọi thắc mắc. Kết quả chính xác và đáng tin cậy.",
    name: "Trần Thị B",
    location: "TP. HCM",
    rating: 4.5,
  },
  {
    content:
      "Quy trình đơn giản, tôi chỉ cần đặt lịch và nhận kết quả qua email. Rất tiện lợi!",
    name: "Lê Văn C",
    location: "Đà Nẵng",
    rating: 5,
  },
  {
    content:
      "Rất hài lòng với dịch vụ. Nhân viên tận tình, kết quả chính xác và nhanh chóng.",
    name: "Võ Thị D",
    location: "Cần Thơ",
    rating: 4,
  },
  {
    content:
      "Công nghệ hiện đại, quy trình minh bạch. Tôi cảm thấy yên tâm khi sử dụng dịch vụ.",
    name: "Hoàng Văn E",
    location: "Hải Phòng",
    rating: 5,
  },
];

const TestimonialCard: React.FC<{
  testimonial: Testimonial;
  index: number;
  set: string;
}> = ({ testimonial, index, set }) => (
  <div className="testimonial-card" key={`${set}-${index}`}>
    <div className="flex mb-2">
      {Array.from({ length: Math.floor(testimonial.rating) }).map((_, i) => (
        <AiFillStar key={i} className="text-xl text-yellow-400" />
      ))}
    </div>
    <p className="mb-4 text-sm leading-relaxed text-gray-200 md:text-base">
      "{testimonial.content}"
    </p>
    <div className="mt-auto">
      <p className="font-semibold text-white">{testimonial.name}</p>
      <p className="text-sm text-gray-300">{testimonial.location}</p>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => (
  <section className="py-16 text-white md:py-20 bg-gradient-to-br from-blue-600 to-blue-800">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-center md:text-3xl">
        Khách hàng nói gì về chúng tôi
      </h2>
      <div className="testimonial-container">
        <div className="auto-scroll-container">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`first-${index}`}
              testimonial={testimonial}
              index={index}
              set="first"
            />
          ))}
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`second-${index}`}
              testimonial={testimonial}
              index={index}
              set="second"
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
