import {
  ActivityIcon,
  ArrowRightIcon,
  ClipboardCheckIcon,
  HeartIcon,
  ShieldIcon,
  StethoscopeIcon,
  UserCheckIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useBookingModal } from "../../components/BookingModalContext";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export const ServicesSection = (): React.JSX.Element => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const { openBookingModal } = useBookingModal();

  // Enhanced service card data with Vietnamese content
  const serviceCards = [
    {
      id: 1,
      title: "Cấp Cứu 24/7",
      description:
        "Dịch vụ y tế cấp cứu 24/7 với đội ngũ chuyên gia y tế giàu kinh nghiệm sẵn sàng xử lý các tình huống nguy cấp với sự chăm sóc và chính xác tối đa.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: true,
      hasFloatingIcon: false,
      overlayIcon: HeartIcon,
      category: "Cấp Cứu",
      price: "24/7 Luôn Sẵn Sàng",
    },
    {
      id: 2,
      title: "Khám Sức Khỏe Định Kỳ",
      description:
        "Khám sức khỏe toàn diện và chăm sóc phòng ngừa để giúp duy trì sức khỏe tối ưu và phát hiện sớm các vấn đề tiềm ẩn.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: false,
      hasFloatingIcon: true,
      floatingIcon: ShieldIcon,
      category: "Phòng Ngừa",
      price: "Từ 1.500.000đ",
    },
    {
      id: 3,
      title: "Tư Vấn Chuyên Khoa",
      description:
        "Tư vấn chuyên sâu với các bác sĩ chuyên khoa được chứng nhận trong nhiều lĩnh vực y tế để giải quyết các vấn đề sức khỏe cụ thể của bạn.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: false,
      hasFloatingIcon: true,
      floatingIcon: ActivityIcon,
      category: "Tư Vấn",
      price: "Từ 2.000.000đ",
    },
    {
      id: 4,
      title: "Theo Dõi Sức Khỏe",
      description:
        "Theo dõi sức khỏe liên tục và các kế hoạch chăm sóc cá nhân hóa để giúp bạn duy trì sức khỏe tối ưu suốt cuộc đời.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: false,
      hasFloatingIcon: true,
      floatingIcon: UserCheckIcon,
      category: "Theo Dõi",
      price: "Từ 990.000đ/tháng",
    },
    {
      id: 5,
      title: "Dịch Vụ Xét Nghiệm",
      description:
        "Xét nghiệm và chẩn đoán hiện đại với kết quả nhanh chóng, chính xác được thực hiện bởi các kỹ thuật viên được chứng nhận.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: false,
      hasFloatingIcon: true,
      floatingIcon: ClipboardCheckIcon,
      category: "Chẩn Đoán",
      price: "Từ 750.000đ",
    },
    {
      id: 6,
      title: "Khám Từ Xa",
      description:
        "Tư vấn sức khỏe trực tuyến tại nhà với các nhà cung cấp dịch vụ chăm sóc sức khỏe có giấy phép thông qua video call an toàn.",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      hasOverlay: false,
      hasFloatingIcon: true,
      floatingIcon: StethoscopeIcon,
      category: "Chăm Sóc Ảo",
      price: "Từ 1.200.000đ",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(
              entry.target.getAttribute("data-card-id") || "0"
            );
            setVisibleCards((prev) => new Set(prev).add(cardId));
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = document.querySelectorAll("[data-card-id]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-20 lg:py-24 xl:py-28 bg-gradient-to-b from-white via-gray-50 to-white"
    >
      <div className="container px-4 mx-auto md:px-6 lg:px-8 xl:px-12 max-w-7xl">
        {/* Section header with Vietnamese content */}
        <div className="mb-12 text-center md:mb-16 lg:mb-20 xl:mb-24">
          <div className="inline-block">
            <span className="block mb-2 text-xs font-semibold tracking-wider uppercase text-app-secondary md:text-sm lg:text-base md:mb-3 lg:mb-4 animate-fade-in-up">
              DỊCH VỤ CỦA CHÚNG TÔI
            </span>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl text-app-primary md:mb-6 lg:mb-8 animate-fade-in-up animation-delay-200">
              Dịch Vụ Y Tế Chất Lượng Cao
            </h2>
            <div className="w-16 md:w-20 lg:w-24 xl:w-32 h-1 md:h-1.5 lg:h-2 bg-gradient-to-r from-app-accent to-app-secondary mx-auto mb-6 md:mb-8 lg:mb-10 animate-fade-in-up animation-delay-400"></div>
            <p className="max-w-2xl mx-auto text-base leading-relaxed text-gray-600 md:text-lg lg:text-xl xl:text-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl animate-fade-in-up animation-delay-600">
              Giải pháp chăm sóc sức khỏe toàn diện được thiết kế riêng để đáp
              ứng nhu cầu cá nhân của bạn với công nghệ tiên tiến và sự chăm sóc
              tận tâm.
            </p>
          </div>
        </div>

        {/* Enhanced grid with staggered animation - responsive grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 md:gap-8 lg:gap-10 xl:gap-12">
          {serviceCards.map((card, index) => {
            const IconComponent = card.hasOverlay
              ? card.overlayIcon
              : card.floatingIcon;
            const isVisible = visibleCards.has(card.id);

            return (
              <Card
                key={card.id}
                data-card-id={card.id}
                className={`group rounded-xl border-0 shadow-lg hover:shadow-2xl overflow-hidden bg-white transition-all duration-700 ease-out transform hover:-translate-y-3 hover:scale-105 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className="relative h-[250px] md:h-[280px] lg:h-[320px] xl:h-[350px] overflow-hidden">
                  {/* Image with zoom effect */}
                  <img
                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                    alt={card.title}
                    src={card.image}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:opacity-100" />

                  {/* Category tag - responsive sizing */}
                  <div className="absolute top-3 md:top-4 lg:top-5 left-3 md:left-4 lg:left-5 bg-app-primary/90 text-white px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 rounded-full text-xs md:text-sm lg:text-base font-medium backdrop-blur-sm">
                    {card.category}
                  </div>

                  {/* Price tag - responsive sizing */}
                  <div className="absolute top-3 md:top-4 lg:top-5 right-3 md:right-4 lg:right-5 bg-app-accent/90 text-app-primary px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 rounded-full text-xs md:text-sm lg:text-base font-semibold backdrop-blur-sm">
                    {card.price}
                  </div>

                  {/* Overlay icon - responsive sizing */}
                  {card.hasOverlay && IconComponent && (
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 transform scale-95 opacity-0 bg-app-primary/85 rounded-t-xl group-hover:opacity-100 group-hover:scale-100">
                      <IconComponent className="w-12 h-12 text-white md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 animate-pulse" />
                    </div>
                  )}

                  {/* Floating icon with enhanced animation - responsive sizing */}
                  {card.hasFloatingIcon && IconComponent && (
                    <div className="absolute w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bottom-[-32px] md:bottom-[-36px] lg:bottom-[-40px] xl:bottom-[-48px] right-[16px] md:right-[20px] lg:right-[24px] bg-gradient-to-br from-app-primary to-app-secondary rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ease-out group-hover:bottom-[-28px] md:group-hover:bottom-[-32px] lg:group-hover:bottom-[-35px] xl:group-hover:bottom-[-40px] group-hover:scale-110 group-hover:rotate-12">
                      <IconComponent className="w-6 h-6 text-white md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 group-hover:animate-bounce" />
                    </div>
                  )}

                  {/* Hover overlay with action */}
                  <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 opacity-0 bg-app-primary/0 group-hover:bg-app-primary/10 group-hover:opacity-100">
                    <div className="transition-transform duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <Button className="bg-white text-app-primary hover:bg-app-accent hover:text-white shadow-lg text-xs md:text-sm lg:text-base px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3">
                        Xem Nhanh
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="relative px-4 pt-12 pb-6 md:pt-14 lg:pt-16 xl:pt-20 md:px-5 lg:px-6 xl:px-8 md:pb-7 lg:pb-8 xl:pb-10">
                  {/* Content with staggered animation - responsive spacing */}
                  <div className="space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6">
                    <h3 className="text-lg font-bold leading-tight transition-colors duration-300 md:text-xl lg:text-2xl xl:text-3xl text-app-primary group-hover:text-app-secondary">
                      {card.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-gray-600 transition-colors duration-300 md:text-base lg:text-lg line-clamp-3 group-hover:text-gray-700">
                      {card.description}
                    </p>

                    {/* Enhanced button with arrow animation - responsive sizing */}
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm font-semibold transition-all duration-300 text-app-secondary hover:text-app-primary group/btn md:text-base lg:text-lg"
                    >
                      <span className="transition-all duration-300 border-b-2 border-transparent group-hover/btn:border-app-primary">
                        Tìm Hiểu Thêm
                      </span>
                      <ArrowRightIcon className="w-3 h-3 ml-2 transition-transform duration-300 md:h-4 md:w-4 lg:h-5 lg:w-5 group-hover/btn:translate-x-1" />
                    </Button>
                  </div>

                  {/* Animated border on hover */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 md:h-1.5 lg:h-2 bg-gradient-to-r from-app-accent to-app-secondary group-hover:w-full transition-all duration-500 ease-out"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to action with new background color - responsive spacing and sizing */}
        <div className="mt-16 text-center md:mt-20 lg:mt-24 xl:mt-28">
          <div className="max-w-4xl p-6 mx-auto text-white shadow-2xl bg-gradient-to-br from-blue-600 to-blue-800 md:p-8 lg:p-10 xl:p-12 rounded-2xl md:rounded-3xl">
            <h3 className="mb-3 text-xl font-bold md:text-2xl lg:text-3xl xl:text-4xl md:mb-4 lg:mb-6">
              Sẵn Sàng Bắt Đầu?
            </h3>
            <p className="mb-6 text-base md:text-lg lg:text-xl xl:text-2xl opacity-90 md:mb-8 lg:mb-10">
              Liên hệ với chúng tôi ngay hôm nay để đặt lịch tư vấn
            </p>
            <Button
              onClick={openBookingModal}
              className="px-6 py-3 text-sm font-semibold text-yellow-600 transition-all duration-300 bg-white rounded-full shadow-lg hover:bg-yellow-400 hover:text-blue-800 md:px-8 lg:px-10 xl:px-12 md:py-4 lg:py-5 xl:py-6"
            >
              Đặt Lịch Hẹn
            </Button>
          </div>
        </div>
      </div>

      {/* Global styles for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          
          .animation-delay-200 {
            animation-delay: 200ms;
          }
          
          .animation-delay-400 {
            animation-delay: 400ms;
          }
          
          .animation-delay-600 {
            animation-delay: 600ms;
          }
          
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `,
        }}
      />
    </section>
  );
};