import {
  ArrowLeftIcon,
  AwardIcon,
  BookUser,
  ClockIcon,
  DnaIcon,
  FileSignature,
  Headset,
  HeartIcon,
  MicroscopeIcon,
  PackageIcon,
  ShieldCheckIcon,
  UserCheck
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer, Header } from "../../../components";
import Loading from "../../../components/Loading";
import { type ServiceDetail, getServiceById } from "../api/servicesApi";
import { useBookingModal } from "../components/BookingModalContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";

// ===== HELPER COMPONENTS =====

const InfoCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="flex items-start p-6 space-x-4 transition-transform transform bg-white border rounded-lg hover:-translate-y-1">
        <Icon className="flex-shrink-0 w-10 h-10 mt-1 text-blue-600"/>
        <div>
            <h3 className="mb-1 text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-gray-600">{children}</p>
        </div>
    </div>
);

const ProcessStep: React.FC<{ number: string, title: string, children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="relative flex flex-col items-center">
        <div className="z-10 flex items-center justify-center w-16 h-16 text-2xl font-bold text-blue-600 bg-blue-100 border-4 border-white rounded-full shadow-md">{number}</div>
        <h3 className="mt-4 mb-2 text-lg font-semibold text-center">{title}</h3>
        <p className="max-w-xs text-sm text-center text-gray-600">{children}</p>
        {number !== '4' && <div className="absolute top-8 h-0.5 w-full bg-gray-200 hidden md:block" />}
    </div>
);


// ===== MAIN COMPONENT =====
export const DetailServices = (): React.JSX.Element => {
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);

  const { openBookingModal } = useBookingModal();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadServiceData = async () => {
      setLoading(true);
      window.scrollTo(0, 0); // Scroll to top on load
      try {
        if (id) {
          const detail = await getServiceById(id);
          setServiceDetail(detail);
          setError(null);
        } else {
          throw new Error('Không tìm thấy ID dịch vụ');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin dịch vụ';
        setError(errorMessage);
        setServiceDetail(null);
      } finally {
        setLoading(false);
      }
    };
    loadServiceData();
  }, [id]);
  
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="relative z-50">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading 
            size="large" 
            message="Đang tải thông tin dịch vụ..." 
            color="blue" 
          />
        </div>
      </div>
    );
  }

  if (error || !serviceDetail) {
    return (
      <div className="w-full min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center" style={{height: 'calc(100vh - 80px)'}}>
          <div className="p-4 text-center">
            <DnaIcon className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Không thể tải thông tin dịch vụ</h3>
            <p className="mb-4 text-gray-600">{error || "Dịch vụ bạn tìm không tồn tại."}</p>
            <Button onClick={() => navigate('/services')} className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <ArrowLeftIcon className="w-4 h-4 mr-2" /> Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    // Get the first active price service as default
    const firstPriceService = serviceDetail.priceServices?.[0];
    
    openBookingModal({
      id: firstPriceService?.id || serviceDetail.id, // Use priceService.id as main id
      serviceId: serviceDetail.id, // Service detail id as serviceId
      name: serviceDetail.name,
      price: firstPriceService?.price || serviceDetail.price || 0, // Prioritize priceService.price
      category: serviceDetail.category || 'civil',
      collectionMethod: firstPriceService?.collectionMethod || 0,
      testServiceInfor: firstPriceService?.testServiceInfor || {
        id: serviceDetail.id,
        name: serviceDetail.name,
        description: serviceDetail.description,
        category: serviceDetail.category
      }
    });
  };
  
  return (
    <div className="bg-gray-50">
      <Header />
      
      <main className="container px-4 py-8 mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/" className="hover:text-blue-700">Trang Chủ</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="/services" className="hover:text-blue-700">Dịch Vụ</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><span className="font-semibold text-gray-700">{serviceDetail.name}</span></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section */}
        <section id="hero-section" className="p-8 mb-16 bg-white border shadow-md rounded-xl">
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl">{serviceDetail.name}</h1>
                <p className="mb-8 text-lg text-gray-600">{serviceDetail.description || "Dịch vụ xét nghiệm ADN hàng đầu, cung cấp kết quả chính xác và đáng tin cậy cho các nhu cầu cá nhân và pháp lý."}</p>
                
                <Button onClick={handleBooking} size="lg" className="w-full md:w-auto text-lg !text-white bg-blue-600 hover:bg-blue-700">
                  Đặt Lịch Ngay
                </Button>
              </div>
              <div className="flex items-center justify-center">
                  <DnaIcon className="w-48 h-48 text-blue-100" />
              </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Gói Dịch Vụ Bao Gồm</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <InfoCard icon={PackageIcon} title="Bộ Kit Lấy Mẫu">Bộ dụng cụ chuyên dụng, vô trùng và dễ sử dụng tại nhà.</InfoCard>
              <InfoCard icon={FileSignature} title="Báo Cáo Chi Tiết">Bản phân tích kết quả đầy đủ, diễn giải rõ ràng và dễ hiểu.</InfoCard>
              <InfoCard icon={UserCheck} title="Bảo Mật Thông Tin">Cam kết bảo mật tuyệt đối dữ liệu cá nhân và kết quả xét nghiệm.</InfoCard>
              <InfoCard icon={Headset} title="Tư Vấn Chuyên Gia">Hỗ trợ giải đáp mọi thắc mắc trước và sau khi có kết quả.</InfoCard>
          </div>
        </section>

        {/* How it works Section */}
        <section className="p-8 mb-16 bg-white border shadow-md rounded-xl md:p-12">
          <h2 className="mb-10 text-3xl font-bold text-center text-gray-800">Quy Trình 4 Bước Đơn Giản</h2>
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
              <ProcessStep number="1" title="Đặt Lịch">Chọn dịch vụ và đặt lịch trực tuyến hoặc qua hotline.</ProcessStep>
              <ProcessStep number="2" title="Thu Mẫu">Tự thu mẫu tại nhà theo hướng dẫn hoặc đến trung tâm.</ProcessStep>
              <ProcessStep number="3" title="Phân Tích">Mẫu của bạn được xử lý tại phòng lab đạt chuẩn quốc tế.</ProcessStep>
              <ProcessStep number="4" title="Nhận Kết Quả">Nhận kết quả bảo mật qua email hoặc Zalo sau vài ngày.</ProcessStep>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Tại Sao Chọn Bloodline DNA?</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <InfoCard icon={ShieldCheckIcon} title="Độ Chính Xác 99.999%">Sử dụng công nghệ giải trình tự gen thế hệ mới nhất cho kết quả đáng tin cậy.</InfoCard>
                <InfoCard icon={AwardIcon} title="Tiêu Chuẩn Quốc Tế">Phòng xét nghiệm đạt chuẩn ISO 17025, đảm bảo quy trình nghiêm ngặt.</InfoCard>
                <InfoCard icon={MicroscopeIcon} title="Công Nghệ Hiện Đại">Hệ thống máy móc và trang thiết bị được nhập khẩu từ Mỹ, Đức.</InfoCard>
                <InfoCard icon={BookUser} title="Chuyên Gia Hàng Đầu">Đội ngũ kỹ thuật viên và chuyên gia di truyền giàu kinh nghiệm.</InfoCard>
                <InfoCard icon={HeartIcon} title="Tư Vấn Tận Tâm">Chúng tôi luôn đặt sự hài lòng và an tâm của khách hàng lên hàng đầu.</InfoCard>
                <InfoCard icon={ClockIcon} title="Trả Kết Quả Nhanh">Quy trình tối ưu giúp rút ngắn thời gian chờ đợi của khách hàng.</InfoCard>
            </div>
        </section>

        {/* Testimonial Section */}
        <section className="mb-16">
            <div className="p-8 text-center text-white bg-blue-600 rounded-xl md:p-12">
                <p className="mb-4 text-xl italic">"Dịch vụ rất chuyên nghiệp và nhanh chóng. Nhờ Bloodline DNA mà gia đình tôi đã giải tỏa được mọi nghi ngờ. Cảm ơn trung tâm rất nhiều!"</p>
                <p className="text-lg font-bold">- Anh Nguyễn Văn A, TP. Hồ Chí Minh</p>
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}; 