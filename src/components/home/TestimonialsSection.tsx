import { Star } from 'lucide-react';

interface Testimonial {
  content: string;
  name: string;
  location: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    content:
      'Dịch vụ rất chuyên nghiệp, kết quả nhanh và bảo mật. Tôi đã xác định được quan hệ huyết thống một cách dễ dàng.',
    name: 'Nguyễn Văn A',
    location: 'Hà Nội',
    rating: 5,
  },
  {
    content:
      'Đội ngũ hỗ trợ rất nhiệt tình, giải đáp mọi thắc mắc. Kết quả chính xác và đáng tin cậy.',
    name: 'Trần Thị B',
    location: 'TP. HCM',
    rating: 5,
  },
  {
    content:
      'Quy trình đơn giản, tôi chỉ cần đặt lịch và nhận kết quả qua email. Rất tiện lợi!',
    name: 'Lê Văn C',
    location: 'Đà Nẵng',
    rating: 5,
  },
  {
    content:
      'Rất hài lòng với dịch vụ. Nhân viên tận tình, kết quả chính xác và nhanh chóng.',
    name: 'Võ Thị D',
    location: 'Cần Thơ',
    rating: 4,
  },
  {
    content:
      'Công nghệ hiện đại, quy trình minh bạch. Tôi cảm thấy yên tâm khi sử dụng dịch vụ.',
    name: 'Hoàng Văn E',
    location: 'Hải Phòng',
    rating: 5,
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex-shrink-0 w-80 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
      <div className="flex mb-3">
        {Array.from({ length: Math.floor(testimonial.rating) }).map((_, i) => (
          <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-gray-200 md:text-base">
        &quot;{testimonial.content}&quot;
      </p>
      <div className="mt-auto">
        <p className="font-semibold text-white">{testimonial.name}</p>
        <p className="text-sm text-gray-300">{testimonial.location}</p>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-16 text-white md:py-20 bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-center md:text-3xl">
          Khách hàng nói gì về chúng tôi
        </h2>
        <div className="overflow-hidden">
          <div className="testimonials-scroll flex gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`first-${index}`} testimonial={testimonial} />
            ))}
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`second-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

