import {
  ArrowRightIcon,
  CarIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SendIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Footer, Header } from "../../../components";
import ChatbotAI from "../../chatbotAI/components/ChatbotAI";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

// interface ContactInfo {
//   id: number;
//   title: string;
//   description: string;
//   value: string;
//   icon: React.ReactNode;
//   type: 'phone' | 'email' | 'address' | 'hours';
//   link?: string;
// }

// interface OfficeHour {
//   day: string;
//   hours: string;
//   isToday?: boolean;
// }

export const Contacts = (): React.JSX.Element => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  // const sectionRef = useRef<HTMLElement>(null);

  // URL của Google Apps Script - thay thế bằng URL thực tế của bạn
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbypEXvmJ75Har_K0AH4pT7SI-t2q_jyhYUO269P0iuMbOYHlIDvTNPVBigOqBSKdMJGRw/exec';

  // const contactInfo: ContactInfo[] = [
  //   {
  //     id: 1,
  //     title: "Hotline 24/7",
  //     description: "Hỗ trợ khẩn cấp và tư vấn",
  //     value: "1900-xxxx",
  //     icon: <PhoneIcon className="w-8 h-8 text-blue-600" />,
  //     type: 'phone',
  //     link: "tel:1900xxxx"
  //   },
  //   {
  //     id: 2,
  //     title: "Email Hỗ Trợ",
  //     description: "Gửi câu hỏi và nhận tư vấn",
  //     value: "support@hospital.vn",
  //     icon: <MailIcon className="w-8 h-8 text-blue-600" />,
  //     type: 'email',
  //     link: "mailto:support@hospital.vn"
  //   },
  //   {
  //     id: 3,
  //     title: "Địa Chỉ Bệnh Viện",
  //     description: "Số 123, Đường ABC, Quận XYZ",
  //     value: "TP. Hồ Chí Minh",
  //     icon: <MapPinIcon className="w-8 h-8 text-blue-600" />,
  //     type: 'address',
  //     link: "https://maps.google.com"
  //   },
  //   {
  //     id: 4,
  //     title: "Giờ Làm Việc",
  //     description: "Thứ 2 - Chủ Nhật",
  //     value: "24/7",
  //     icon: <ClockIcon className="w-8 h-8 text-blue-600" />,
  //     type: 'hours'
  //   }
  // ];

  // const officeHours: OfficeHour[] = [
  //   { day: "Thứ Hai", hours: "7:00 - 22:00" },
  //   { day: "Thứ Ba", hours: "7:00 - 22:00", isToday: true },
  //   { day: "Thứ Tư", hours: "7:00 - 22:00" },
  //   { day: "Thứ Năm", hours: "7:00 - 22:00" },
  //   { day: "Thứ Sáu", hours: "7:00 - 22:00" },
  //   { day: "Thứ Bảy", hours: "8:00 - 20:00" },
  //   { day: "Chủ Nhật", hours: "8:00 - 18:00" }
  // ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    console.log(scrollY, isVisible);
    window.addEventListener("scroll", handleScroll);

    const timer = setTimeout(() => setIsVisible(true), 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Phương pháp 1: Dùng form submission thay vì fetch để tránh CORS
      const formElement = document.createElement('form');
      formElement.method = 'POST';
      formElement.action = APPS_SCRIPT_URL;
      formElement.target = 'hidden-iframe';
      
      // Thêm các field vào form
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        formElement.appendChild(input);
      });
      
      document.body.appendChild(formElement);
      formElement.submit();
      document.body.removeChild(formElement);
      
      // Giả lập thành công vì không thể đọc response từ cross-origin
      setTimeout(() => {
        setShowSuccessModal(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setIsSubmitting(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowSuccessModal(true); // Vẫn hiện success modal vì CORS
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Lắng nghe khi iframe load xong (tức là form đã được submit thành công)
  // useEffect(() => {
  //   const iframe = document.querySelector('iframe[name="hidden-iframe"]') as HTMLIFrameElement;
    
  //   if (iframe) {
  //     const handleIframeLoad = () => {
  //       if (isSubmitting) {
  //         // Form đã được gửi thành công
  //         setTimeout(() => {
  //           alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
  //           // Reset form
  //           const form = document.querySelector('form') as HTMLFormElement;
  //           if (form) {
  //             form.reset();
  //           }
  //           setIsSubmitting(false);
  //         }, 500);
  //       }
  //     };

  //     iframe.addEventListener('load', handleIframeLoad);
      
  //     return () => {
  //       iframe.removeEventListener('load', handleIframeLoad);
  //     };
  //   }
  // }, [isSubmitting]);



  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        {/* Header */}
        <div className="fixed z-50 w-full">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full py-20 overflow-hidden md:py-28 bg-blue-50">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af" /></svg>
          </div>
          <div className="container relative z-10 px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">Trang Chủ</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><span className="font-semibold text-blue-900">Liên Hệ</span></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">Liên Hệ Với Chúng Tôi
              <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
                Hỗ Trợ 24/7
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn với đội ngũ chuyên viên tận tâm, giải đáp mọi thắc mắc về dịch vụ y tế.</p>
          </div>
        </section>

        {/* Contact Form & Contact Info */}
        <section className="py-16 bg-white md:py-20 lg:py-24">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="p-8 bg-white shadow-xl rounded-2xl md:p-10">
                  <div className="mb-8">
                    <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
                      Gửi Tin Nhắn
                    </h2>
                    <p className="text-lg leading-relaxed text-slate-600">
                      Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Hidden iframe để nhận response từ Google Apps Script */}
                    <iframe 
                      name="hidden-iframe" 
                      style={{ display: 'none' }}
                      title="Hidden iframe for form submission"
                    ></iframe>
                    
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-semibold text-slate-700">
                          Họ và Tên *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 transition-colors duration-200 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="Nhập họ và tên của bạn"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-slate-700">
                          Số Điện Thoại *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 transition-colors duration-200 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="0912 345 678"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-semibold text-slate-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 transition-colors duration-200 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block mb-2 text-sm font-semibold text-slate-700">
                        Chủ Đề
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 transition-colors duration-200 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="Đặt Lịch Khám">Đặt lịch khám</option>
                        <option value="Tư Vấn Y Tế">Tư vấn y tế</option>      
                        <option value="Góp Ý">Góp ý</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block mb-2 text-sm font-semibold text-slate-700">
                        Tin Nhắn *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 transition-colors duration-200 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
                        placeholder="Nhập tin nhắn của bạn..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-900 hover:bg-blue-800 !text-white py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                          Đang Gửi...
                        </>
                      ) : (
                        <>
                          <SendIcon className="w-5 h-5 mr-2" />
                          Gửi Tin Nhắn
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info Cards in Sidebar */}
              <div className="space-y-8 lg:col-span-2">
                {/* Top Row: Emergency and Location */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Emergency/Hotline Card */}
                  <Card
                    className="flex items-center justify-center w-full p-8 text-center transition-all duration-300 border-0 aspect-square group hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-blue-100 to-blue-50"
                  >
                    <CardContent className="flex flex-col items-center p-0">
                      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 bg-white rounded-full shadow-lg group-hover:bg-blue-200">
                          <PhoneIcon className="w-8 h-8 text-blue-700" />
                        </div>
                      </div>
                      <h3 className="mb-3 text-lg font-bold tracking-wider text-blue-900 uppercase transition-colors duration-300 group-hover:text-blue-700 whitespace-nowrap">
                        Hotline 24/7
                      </h3>
                      <div className="space-y-2">
                        <p className="mb-3 text-sm text-center text-slate-600 whitespace-nowrap">
                          Hỗ trợ khẩn cấp và tư vấn
                        </p>
                        <a
                          href="tel:1900xxxx"
                          className="block text-lg font-semibold text-blue-800 transition-colors duration-200 hover:text-blue-900 whitespace-nowrap"
                        >
                          0342 555 702
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location Card */}
                  <Card
                    className="flex items-center justify-center w-full p-8 text-center transition-all duration-300 border-0 aspect-square group hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-blue-800 to-blue-900"
                  >
                    <CardContent className="flex flex-col items-center p-0">
                      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 rounded-full shadow-lg bg-white/20 group-hover:bg-white/30">
                          <MapPinIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="mb-3 text-lg font-bold tracking-wider text-white uppercase transition-colors duration-300 group-hover:text-gray-100">
                        Địa Chỉ
                      </h3>
                      <div className="space-y-2">
                        <p className="mb-2 text-sm text-center text-white/90 whitespace-nowrap">
                          Số 123, Đường ABC, Quận XYZ
                        </p>
                        <a
                          href="https://maps.google.com"
                          className="block text-lg font-semibold text-white transition-colors duration-200 hover:text-gray-200 whitespace-nowrap"
                        >
                          TP. Hồ Chí Minh
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom Row: Email and Working Hours */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Email Card */}
                  <Card
                    className="
      w-full aspect-square             /* đảm bảo width = height */
      group text-center
      p-6                               /* giảm padding để tránh nội dung chèn tràn */
      hover:shadow-xl transition-all duration-300 hover:-translate-y-2
      border-0 bg-gradient-to-br from-blue-100 to-blue-50
      flex flex-col justify-center items-center  /* căn giữa nội dung */
      overflow-hidden                    /* nếu nội dung quá cao sẽ bị ẩn bớt */
    "
                  >
                    <CardContent className="flex flex-col items-center justify-center p-0">
                      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 bg-white rounded-full shadow-lg group-hover:bg-blue-200">
                          <MailIcon className="w-8 h-8 text-blue-700" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-bold tracking-wider text-blue-900 uppercase transition-colors duration-300 group-hover:text-blue-700">
                        Email
                      </h3>
                      <p className="mb-3 text-sm text-center text-slate-600 whitespace-nowrap">
                        Gửi câu hỏi và nhận tư vấn
                      </p>
                      <a
                        href="mailto:support@hospital.vn"
                        className="text-base font-semibold text-center text-blue-800 break-words transition-colors duration-200 hover:text-blue-900"
                      >
                        blodlineDNA@support.com
                      </a>
                    </CardContent>
                  </Card>

                  {/* Working Hours Card */}
                  <Card
                    className="flex flex-col items-center justify-center w-full p-6 overflow-hidden text-center transition-all duration-300 border-0 aspect-square group hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-blue-100 to-blue-50"
                  >
                    <CardContent className="flex flex-col items-center justify-center p-0">
                      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 bg-white rounded-full shadow-lg group-hover:bg-blue-200">
                          <ClockIcon className="w-8 h-8 text-blue-700" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-bold tracking-wider text-blue-900 uppercase transition-colors duration-300 group-hover:text-blue-700">
                        Giờ Làm Việc
                      </h3>
                      <p className="mb-3 text-sm text-center text-slate-600">
                        Thứ 2 – Chủ Nhật
                      </p>
                      <p className="text-lg font-semibold text-center text-blue-800">
                        24/7
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white md:py-0">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
                Vị Trí Bệnh Viện
              </h2>
              <p className="text-lg leading-relaxed text-slate-600">
                Chúng tôi có vị trí thuận lợi, dễ dàng di chuyển bằng các phương tiện giao thông
              </p>
            </div>

            <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Map */}
              <div className="lg:col-span-2">
                <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4967970106!2d106.6981!3d10.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529432c6b6c9d%3A0x15b5b5c5b5c5b5c5!2sSaigon!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-2xl"
                  ></iframe>
                </div>
              </div>

              {/* Location Info */}
              <div className="space-y-6">
                <Card className="border-0 bg-blue-50">
                  <CardContent className="p-6">
                    <h3 className="flex items-center mb-4 text-xl font-bold text-blue-900">
                      <MapPinIcon className="w-5 h-5 mr-2" />
                      Địa Chỉ Chi Tiết
                    </h3>
                    <p className="mb-4 leading-relaxed text-slate-600">
                      Số 123, Đường ABC, Phường XYZ<br />
                      Quận 1, TP. Hồ Chí Minh<br />
                      Việt Nam
                    </p>
                    <Button className="bg-blue-900 hover:bg-blue-800 !text-white">
                      <ArrowRightIcon className="w-4 h-4 mr-2" />
                      Chỉ Đường
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-green-50">
                  <CardContent className="p-6">
                    <h3 className="flex items-center mb-4 text-xl font-bold text-blue-900">
                      <CarIcon className="w-5 h-5 mr-2" />
                      Giao Thông
                    </h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>• Xe bus: Tuyến 01, 02, 03</li>
                      <li>• Metro: Ga Bến Thành (500m)</li>
                      <li>• Taxi/Grab: Có sẵn</li>
                      <li>• Bãi đỗ xe: Miễn phí</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="relative">
          <div className="fixed bottom-0 right-0 p-4">
            <ChatbotAI />
          </div>
          <Footer />
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-md mx-4 overflow-hidden bg-white shadow-2xl rounded-2xl animate-in zoom-in-95 duration-300">
            {/* Header với gradient */}
            <div className="p-6 text-center text-white bg-gradient-to-r from-green-500 to-green-600">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full bg-opacity-20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Gửi Tin Nhắn Thành Công!</h3>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="mb-6 text-center text-gray-600 leading-relaxed">
                Cảm ơn bạn đã liên hệ với chúng tôi! Chúng tôi sẽ phản hồi trong vòng <strong className="text-blue-600">24 giờ</strong> qua email hoặc số điện thoại bạn đã cung cấp.
              </p>
              
              {/* Thông tin liên hệ nhanh */}
              <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
                <p className="mb-2 text-sm font-semibold text-blue-800">Liên hệ khẩn cấp:</p>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>📞 Hotline: <strong>0342 555 702</strong></p>
                  <p>✉️ Email: <strong>support@hospital.vn</strong></p>
                </div>
              </div>
              
              {/* Nút đóng */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-6 py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 