import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../../components/ui/Card";

// Define proper types for contact details
interface ContactDetail {
  text: string;
  isLink: boolean;
  href?: string;
  className?: string;
}

interface ContactItem {
  title: string;
  icon: React.ReactNode;
  details: ContactDetail[];
  bgColor: string;
  textColor: string;
  hoverBgColor: string;
  iconBgColor: string;
}

export const ContactSection = (): React.JSX.Element => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Enhanced contact information data with Vietnamese content
  const contactData: ContactItem[] = [
    {
      title: "CẤP CỨU",
      icon: <PhoneIcon className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 transition-all duration-300" />,
      details: [
        { text: "(84) 28-3822-4567", isLink: true, href: "tel:+842838224567" },
        {
          text: "(84) 911-234-567",
          isLink: true,
          href: "tel:+84911234567",
        },
      ],
      bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
      textColor: "text-white",
      hoverBgColor: "hover:from-yellow-500 hover:to-orange-600",
      iconBgColor: "bg-white/20",
    },
    {
      title: "ĐỊA CHỈ",
      icon: <MapPinIcon className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 transition-all duration-300" />,
      details: [
        { text: "123 Đường Y Tế", isLink: false },
        {
          text: "Quận Y Tế, TP.HCM 70000",
          isLink: true,
          href: "https://maps.google.com?q=123+Duong+Y+Te+TPHCM",
        },
      ],
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-800",
      textColor: "text-white",
      hoverBgColor: "hover:from-blue-700 hover:to-blue-900",
      iconBgColor: "bg-white/20",
    },
    {
      title: "EMAIL",
      icon: <MailIcon className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 transition-all duration-300" />,
      details: [
        { text: "info@benhvien.vn", isLink: true, href: "mailto:info@benhvien.vn" },
        {
          text: "hotro@benhvien.vn",
          isLink: true,
          href: "mailto:hotro@benhvien.vn",
          className: "text-sm md:text-base opacity-90",
        },
      ],
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      textColor: "text-white",
      hoverBgColor: "hover:from-green-600 hover:to-emerald-700",
      iconBgColor: "bg-white/20",
    },
    {
      title: "GIỜ LÀM VIỆC",
      icon: <ClockIcon className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 transition-all duration-300" />,
      details: [
        { text: "T2-T7: 07:00-19:00", isLink: false },
        { text: "Chủ nhật: Chỉ cấp cứu", isLink: false, className: "text-sm md:text-base opacity-90" },
      ],
      bgColor: "bg-gradient-to-br from-purple-600 to-purple-800",
      textColor: "text-white",
      hoverBgColor: "hover:from-purple-700 hover:to-purple-900",
      iconBgColor: "bg-white/20",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.getAttribute('data-contact-id') || '0');
            setVisibleCards(prev => new Set(prev).add(cardId));
          }
        });
      },
      { threshold: 0.3 }
    );

    const cards = document.querySelectorAll('[data-contact-id]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="flex flex-col items-center py-16 md:py-20 lg:py-24 xl:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements - responsive sizing */}
      <div className="absolute inset-0 opacity-5 md:opacity-10">
        <div className="absolute top-10 md:top-20 left-5 md:left-10 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-app-primary rounded-full blur-xl"></div>
        <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-app-secondary rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-app-accent rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Enhanced section header - responsive spacing with Vietnamese content */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20 xl:mb-24">
          <div className="inline-block">
            <span className="text-app-secondary font-semibold text-xs md:text-sm lg:text-base uppercase tracking-wider mb-2 md:mb-3 lg:mb-4 block animate-fade-in-up">
              LIÊN HỆ NGAY
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-app-primary mb-4 md:mb-6 lg:mb-8 animate-fade-in-up animation-delay-200">
              Thông Tin Liên Hệ
            </h2>
            <div className="w-16 md:w-20 lg:w-24 xl:w-32 h-1 md:h-1.5 lg:h-2 bg-gradient-to-r from-app-accent to-app-secondary mx-auto mb-6 md:mb-8 lg:mb-10 animate-fade-in-up animation-delay-400"></div>
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với chúng tôi qua các kênh tiện lợi dưới đây.
            </p>
          </div>
        </div>

        {/* Enhanced contact cards grid - responsive grid and spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 xl:gap-12 w-full">
          {contactData.map((item, index) => {
            const isVisible = visibleCards.has(index);
            const isHovered = hoveredCard === index;
            
            return (
              <Card
                key={index}
                data-contact-id={index}
                className={`group relative ${item.bgColor} ${item.hoverBgColor} rounded-2xl md:rounded-3xl border-none h-[280px] md:h-[320px] lg:h-[350px] xl:h-[380px] overflow-hidden cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-4 hover:scale-105 hover:shadow-2xl ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated background pattern - responsive */}
                <div className="absolute inset-0 opacity-10">
                  <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full transform transition-all duration-1000 ${
                    isHovered ? 'scale-150 translate-x-4 -translate-y-4' : 'scale-100'
                  }`} style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                  }}></div>
                  <div className={`absolute bottom-0 left-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full transform transition-all duration-1000 delay-100 ${
                    isHovered ? 'scale-125 -translate-x-2 translate-y-2' : 'scale-100'
                  }`} style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'
                  }}></div>
                </div>

                <CardContent className="flex flex-col h-full p-0 relative z-10">
                  <div className="flex flex-col p-6 md:p-8 lg:p-10 pt-8 md:pt-10 lg:pt-12 h-full">
                    {/* Icon with enhanced animation - responsive sizing */}
                    <div className={`mb-6 md:mb-8 lg:mb-10 transition-all duration-500 transform ${
                      isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
                    }`}>
                      <div className={`${item.iconBgColor} p-3 md:p-4 lg:p-5 rounded-full inline-block backdrop-blur-sm`}>
                        {item.icon}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 flex-grow">
                      {/* Title with enhanced styling - responsive */}
                      <h3 className={`font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl ${item.textColor} tracking-wide transition-all duration-300 ${
                        isHovered ? 'transform scale-105' : ''
                      }`}>
                        {item.title}
                      </h3>
                      
                      {/* Contact details with staggered animation - responsive */}
                      <div className="space-y-1 md:space-y-2">
                        {item.details.map((detail, idx) =>
                          detail.isLink && detail.href ? (
                            <a
                              key={idx}
                              href={detail.href}
                              rel="noopener noreferrer"
                              target={detail.href.startsWith('mailto:') || detail.href.startsWith('tel:') ? '_self' : '_blank'}
                              className={`${item.textColor} text-sm md:text-base lg:text-lg leading-relaxed hover:text-white/90 transition-all duration-300 hover:scale-105 transform inline-block ${detail.className || ""}`}
                            >
                              {detail.text}
                            </a>
                          ) : (
                            <p
                              key={idx}
                              className={`${item.textColor} text-sm md:text-base lg:text-lg leading-relaxed ${detail.className || ""}`}
                            >
                              {detail.text}
                            </p>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Hover indicator - responsive height */}
                    <div className={`absolute bottom-0 left-0 w-full h-1 md:h-1.5 lg:h-2 bg-white/30 transform transition-all duration-500 ${
                      isHovered ? 'scale-x-100' : 'scale-x-0'
                    }`}></div>
                  </div>
                </CardContent>

                {/* Ripple effect on hover */}
                <div className={`absolute inset-0 rounded-2xl md:rounded-3xl transition-all duration-500 ${
                  isHovered ? 'bg-white/10' : 'bg-transparent'
                }`}></div>
              </Card>
            );
          })}
        </div>

        {/* Enhanced call-to-action section - responsive spacing and sizing with Vietnamese content */}
       
      </div>

      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{
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
          
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
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
          
          .animate-shimmer {
            animation: shimmer 3s ease-in-out infinite;
          }
        `
      }} />
    </section>
  );
};
