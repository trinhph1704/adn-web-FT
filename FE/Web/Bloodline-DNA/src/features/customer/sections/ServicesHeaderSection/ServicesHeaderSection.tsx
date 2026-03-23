import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";

export const ServicesHeaderSection = (): React.JSX.Element => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] xl:h-[650px] overflow-hidden">
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 w-full h-full bg-[url(https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-3.png)] bg-cover bg-center transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff95] via-[#ffffff80] to-[#ffffff60]" />

      {/* Animated decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {/* Large floating circle - responsive sizing */}
        <div 
          className={`absolute w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 top-[15%] md:top-[20%] lg:top-[25%] right-[5%] md:right-[10%] lg:right-[15%] bg-app-accent rounded-full opacity-40 md:opacity-50 transition-all duration-1000 ease-out ${
            isVisible ? 'animate-pulse scale-110' : 'scale-100'
          }`}
          style={{
            transform: `translateY(${scrollY * -0.3}px) scale(${isVisible ? 1.1 : 1})`,
            animation: 'float-up-down 6s ease-in-out infinite',
          }}
        />
        
        {/* Small floating circle - responsive sizing */}
        <div 
          className={`absolute w-24 h-24 md:w-40 md:h-40 lg:w-60 lg:h-60 xl:w-72 xl:h-72 top-[-10%] md:top-[-15%] lg:top-[-20%] left-[-5%] md:left-[-10%] lg:left-[-15%] bg-app-secondary rounded-full opacity-20 md:opacity-30 transition-all duration-1200 ease-out ${
            isVisible ? 'animate-spin' : ''
          }`}
          style={{
            transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * 0.1}deg)`,
            animation: 'float-up-down 8s ease-in-out infinite reverse',
          }}
        />

        {/* Additional floating elements for more dynamic feel - responsive */}
        <div 
          className="absolute w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 top-[20%] md:top-[25%] left-[15%] md:left-[20%] lg:left-[25%] bg-app-accent/20 rounded-full"
          style={{
            transform: `translateY(${scrollY * -0.4}px)`,
            animation: 'float-up-down 4s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 top-[60%] md:top-[55%] lg:top-[50%] right-[25%] md:right-[30%] lg:right-[35%] bg-app-secondary/30 rounded-full"
          style={{
            transform: `translateY(${scrollY * -0.6}px)`,
            animation: 'float-up-down 5s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Animated bottom color bars - responsive height */}
      <div className="absolute bottom-0 left-0 flex w-full h-2 overflow-hidden md:h-3 lg:h-4">
        <div 
          className="h-full w-[20%] md:w-[25%] lg:w-[30%] bg-app-accent transition-all duration-1000 ease-out transform"
          style={{
            transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
          }}
        />
        <div 
          className="flex-1 h-full transition-all ease-out delay-200 transform bg-app-primary duration-1200"
          style={{
            transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
          }}
        />
        <div 
          className="h-full w-[15%] md:w-[20%] lg:w-[25%] bg-app-secondary transition-all duration-1400 ease-out transform delay-400"
          style={{
            transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
          }}
        />
      </div>

      {/* Enhanced content with animations - responsive positioning and sizing */}
      <div className={`absolute top-1/2 left-4 md:left-8 lg:left-16 xl:left-24 -translate-y-1/2 transition-all duration-1000 ease-out max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
      }`}>
        {/* Animated breadcrumb - responsive text size with Vietnamese content */}
        <div className="transition-all ease-out delay-300 transform duration-800">
          <Breadcrumb>
            <BreadcrumbList className="text-sm md:text-base lg:text-lg">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="font-body-2 font-[number:var(--body-2-font-weight)] text-app-primary text-sm md:text-base lg:text-lg tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] [font-style:var(--body-2-font-style)] hover:text-app-secondary transition-colors duration-300 hover:scale-105 transform inline-block"
                >
                  Trang Chủ
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-app-primary animate-pulse" />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/services"
                  className="font-body-2 font-[number:var(--body-2-font-weight)] text-app-primary text-sm md:text-base lg:text-lg tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] [font-style:var(--body-2-font-style)] hover:text-app-secondary transition-colors duration-300 hover:scale-105 transform inline-block"
                >
                  Dịch Vụ
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Animated title with typing effect - responsive sizing with Vietnamese content */}
        <h1 className={`font-display-1 font-[number:var(--display-1-font-weight)] text-app-primary text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-[var(--display-1-letter-spacing)] leading-[var(--display-1-line-height)] [font-style:var(--display-1-font-style)] mt-4 md:mt-6 lg:mt-8 transition-all duration-1000 ease-out delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <span className="inline-block transition-transform duration-300 hover:scale-105">
            Dịch Vụ Y Tế
          </span>
          <span className="inline-block w-1 h-6 ml-2 md:h-8 lg:h-10 xl:h-12 bg-app-secondary animate-pulse" />
        </h1>

        {/* Subtitle for better context - responsive sizing with Vietnamese content */}
        <p className={`text-base md:text-lg lg:text-xl xl:text-2xl text-app-primary/80 mt-3 md:mt-4 lg:mt-6 max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl leading-relaxed transition-all duration-1200 ease-out delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Khám phá các dịch vụ chăm sóc sức khỏe chuyên nghiệp toàn diện được thiết kế để đảm bảo sức khỏe tốt nhất cho bạn
        </p>

        {/* CTA Button - responsive with Vietnamese content */}
        <div className={`mt-6 md:mt-8 lg:mt-10 transition-all duration-1400 ease-out delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button className="px-6 py-3 text-sm font-semibold text-white transition-all duration-300 transform rounded-full bg-app-primary hover:bg-app-secondary md:px-8 lg:px-10 md:py-4 lg:py-5 md:text-base lg:text-lg hover:scale-105 hover:shadow-xl">
            Khám Phá Dịch Vụ
          </button>
        </div>
      </div>

      {/* Global styles for floating animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float-up-down {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `
      }} />
    </section>
  );
};
