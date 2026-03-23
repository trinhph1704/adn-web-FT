import {
  ActivityIcon,
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ClockIcon,
  HeartIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  ShieldIcon,
  StethoscopeIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Footer, Header } from "../../../components";
import Loading from "../../../components/Loading";
import { getServiceById, servicesApi, type TestService } from "../api/servicesApi";
import { useBookingModal } from "../components/BookingModalContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

// UI Interface for displaying services
interface Service {
  id: string;               // priceServiceId
  serviceId?: string;       // real testServiceId
  testServiceInfo?: { id: string;[key: string]: any };
  title: string;
  description: string;
  category: string;
  price: string;
  priceNumeric: number;
  duration: string;
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  doctor: string;
  location: string;
  available: boolean;
  featured: boolean;
  isActive: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
  collectionMethod: number;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

// ===== HELPER FUNCTIONS =====
// Category mappings for backward compatibility (fallback only)
const categoryMappings: { [key: string]: string } = {
  'Civil': 'civil',
  'Legal': 'legal',
  'Emergency': 'civil',
  'Consultation': 'civil',
  'Checkup': 'civil',
  'Monitoring': 'civil'
};

// NOTE: Primary classification is now based on collectionMethod:
// collectionMethod 0 = Dân Sự (Civil) 
// collectionMethod 1 = Hành Chính (Legal)

const categoryDurations: { [key: string]: string } = {
  'Civil': '45-60 phút',
  'Legal': '1-2 giờ',
  'Emergency': '24/7',
  'Consultation': '30-45 phút',
  'Checkup': '1-2 giờ',
  'Monitoring': 'Theo tháng'
};

const categoryImages: { [key: string]: string } = {
  'Civil': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
  'Legal': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
  'Emergency': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
  'Consultation': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
  'Checkup': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
  'Monitoring': 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg'
};

const categoryFeatures: { [key: string]: string[] } = {
  'Civil': ['Xét nghiệm máu', 'Siêu âm', 'Chẩn đoán', 'Tư vấn'],
  'Legal': ['Xét nghiệm ADN', 'Phân tích mẫu tóc', 'Báo cáo pháp lý', 'Tư vấn chuyên môn'],
  'Emergency': ['Xe cấp cứu', 'Hồi sức cấp cứu', 'Phẫu thuật khẩn cấp', 'Chăm sóc đặc biệt'],
  'Consultation': ['Tư vấn chuyên sâu', 'Khám lâm sàng', 'Đưa ra phác đồ', 'Theo dõi điều trị'],
  'Checkup': ['Khám tổng quát', 'Xét nghiệm cơ bản', 'Siêu âm', 'Tư vấn sức khỏe'],
  'Monitoring': ['Theo dõi từ xa', 'Báo cáo định kỳ', 'Tư vấn online', 'Hỗ trợ 24/7']
};

const categoryDoctors: { [key: string]: string } = {
  'Civil': 'BS. Nguyễn Văn A',
  'Legal': 'BS.CK1 Phan Thị C',
  'Emergency': 'BS.CK2 Trần Thị B',
  'Consultation': 'BS.CK1 Lê Văn C',
  'Checkup': 'BS. Phạm Thị D',
  'Monitoring': 'BS. Hoàng Văn E'
};

const categoryLocations: { [key: string]: string } = {
  'Civil': 'Khoa Xét nghiệm',
  'Legal': 'Phòng ADN - Pháp y',
  'Emergency': 'Khoa Cấp cứu',
  'Consultation': 'Phòng Tư vấn',
  'Checkup': 'Khoa Khám bệnh',
  'Monitoring': 'Khoa Theo dõi'
};

// Transform API data to UI format
const transformAPIDataToUIFormat = (apiServices: TestService[]): Service[] => {
  console.log('🔄 Transforming API data to UI format...');

  if (!Array.isArray(apiServices)) {
    console.warn('⚠️ API services is not an array, using empty array');
    return [];
  }

  return apiServices.map((apiService, index) => {
    console.log(`🔄 Processing service ${index + 1}:`, apiService);

    const serviceInfo = apiService.testServiceInfor;
    const title = serviceInfo?.name || `Service ${apiService.id}`;
    const description = serviceInfo?.description || 'Không có mô tả';
    const apiCategory = serviceInfo?.category || 'Civil';
    const isActive = apiService.isActive;

    // Map API category to UI category based on collectionMethod
    // collectionMethod 0 = Dân Sự (Civil)
    // collectionMethod 1 = Hành Chính (Legal)
    let uiCategory: string;
    if (apiService.collectionMethod === 0) {
      uiCategory = 'civil'; // Dân Sự
    } else if (apiService.collectionMethod === 1) {
      uiCategory = 'legal'; // Hành Chính
    } else {
      // Fallback to original category mapping if collectionMethod is unexpected
      uiCategory = categoryMappings[apiCategory] || 'civil';
    }

    console.log(`📝 Service ${index + 1} mapping:`, {
      id: apiService.id,
      title: title,
      apiCategory: apiCategory,
      collectionMethod: apiService.collectionMethod,
      uiCategory: uiCategory,
      isActive: isActive
    });

    const transformedService = {
      id: apiService.id,
      serviceId: apiService.serviceId,
      testServiceInfo: apiService.testServiceInfor,
      title: title,
      description: description,
      category: uiCategory,
      price: `${apiService.price.toLocaleString('vi-VN')}đ`,
      priceNumeric: apiService.price,
      duration: categoryDurations[apiCategory] || '30-60 phút',
      rating: 4.7 + Math.random() * 0.3,
      reviews: Math.floor(Math.random() * 300) + 50,
      image: categoryImages[apiCategory] || categoryImages['Civil'],
      features: categoryFeatures[apiCategory] || ['Dịch vụ chất lượng cao', 'Đội ngũ chuyên nghiệp'],
      doctor: categoryDoctors[apiCategory] || 'BS. Chuyên khoa',
      location: categoryLocations[apiCategory] || 'Phòng khám',
      available: isActive,
      featured: apiService.price > 1000000,
      isActive: isActive,
      effectiveFrom: apiService.effectiveFrom,
      effectiveTo: apiService.effectiveTo,
      collectionMethod: apiService.collectionMethod
    };

    console.log(`✅ Transformed service:`, transformedService);
    return transformedService;
  });
};

// Mock data for fallback
const getMockServices = (): TestService[] => {
  return [
    {
      id: "mock-1",
      serviceId: "mock-service-1",
      price: 500000,
      collectionMethod: 0, // Dân Sự
      currency: "VND",
      effectiveFrom: new Date().toISOString(),
      effectiveTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      testServiceInfor: {
        id: "mock-1",
        name: "Xét nghiệm máu cơ bản",
        description: "Kiểm tra các chỉ số máu cơ bản cho mục đích y tế",
        category: "Civil",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priceServices: []
      }
    },
    {
      id: "mock-2",
      serviceId: "mock-service-2",
      price: 2000000,
      collectionMethod: 1, // Hành Chính
      currency: "VND",
      effectiveFrom: new Date().toISOString(),
      effectiveTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      testServiceInfor: {
        id: "mock-2",
        name: "Xét nghiệm ADN pháp lý",
        description: "Lấy mẫu tóc để xét nghiệm ADN cho mục đích pháp lý",
        category: "Legal",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priceServices: []
      }
    },
    {
      id: "mock-3",
      serviceId: "mock-service-3",
      price: 800000,
      collectionMethod: 0, // Dân Sự
      currency: "VND",
      effectiveFrom: new Date().toISOString(),
      effectiveTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      testServiceInfor: {
        id: "mock-3",
        name: "Xét nghiệm gen di truyền",
        description: "Phân tích gen để xác định tính di truyền",
        category: "Civil",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priceServices: []
      }
    },
    {
      id: "mock-4",
      serviceId: "mock-service-4",
      price: 1500000,
      collectionMethod: 1, // Hành Chính
      currency: "VND",
      effectiveFrom: new Date().toISOString(),
      effectiveTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      testServiceInfor: {
        id: "mock-4",
        name: "Xác định quan hệ huyết thống",
        description: "Xét nghiệm ADN để xác định quan hệ cha con hoặc họ hàng",
        category: "Legal",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priceServices: []
      }
    }
  ];
};

// ===== MAIN COMPONENT =====
export const Services = (): React.JSX.Element => {
  // State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [detailLoading, setDetailLoading] = useState<string | null>(null);
  const { openBookingModal } = useBookingModal();
  const navigate = useNavigate();

  // Event Handlers
  const handleViewDetail = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    setDetailLoading(id);

    try {
      const serviceDetail = await getServiceById(id);
      navigate(`/services/${id}`, {
        state: {
          serviceDetail,
          currentService: services.find(s => s.id === id)
        }
      });
    } catch (error) {
      let errorMessage = 'Không thể tải chi tiết dịch vụ';
      if (error instanceof Error) {
        if (error.message.includes('yêu cầu đăng nhập')) {
          errorMessage = 'Để xem chi tiết đầy đủ, vui lòng đăng nhập. Đang hiển thị thông tin cơ bản.';
        } else {
          errorMessage = error.message;
        }
      }
      navigate(`/services/${id}`, {
        state: {
          error: errorMessage,
          currentService: services.find(s => s.id === id)
        }
      });
    } finally {
      setDetailLoading(null);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
  };

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log('🚀 Loading services...');
        setLoading(true);

        const apiResponse = await servicesApi();
        console.log('📦 API response:', apiResponse);

        // Handle different response structures
        let apiServices: TestService[] = [];
        if (apiResponse?.data && Array.isArray(apiResponse.data)) {
          apiServices = apiResponse.data;
        } else if (Array.isArray(apiResponse)) {
          apiServices = apiResponse;
        }

        const transformedServices = transformAPIDataToUIFormat(apiServices);
        setServices(transformedServices);
        setError(null);
        console.log('✅ Services loaded successfully!');

      } catch (err) {
        console.error('Error loading services:', err);

        // Fallback to mock data
        const mockServices = getMockServices();
        const transformedServices = transformAPIDataToUIFormat(mockServices);
        setServices(transformedServices);

        // Set user-friendly error message
        let errorMessage = 'API không khả dụng, đang hiển thị dữ liệu mẫu.';
        if (err instanceof Error) {
          if (err.message.includes('401')) {
            errorMessage = 'Bạn có thể xem dịch vụ mà không cần đăng nhập. Đang hiển thị dữ liệu mẫu.';
          } else if (err.message.includes('timeout')) {
            errorMessage = 'Kết nối quá chậm. Đang hiển thị dữ liệu mẫu.';
          } else if (err.message.includes('yêu cầu đăng nhập')) {
            errorMessage = 'Bạn có thể xem dịch vụ mà không cần đăng nhập. Đang hiển thị dữ liệu mẫu.';
          }
        }
        setError(errorMessage);

      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Update categories based on services
  const categories: ServiceCategory[] = [
    {
      id: "all",
      name: "Tất Cả",
      icon: <StethoscopeIcon className="w-5 h-5" />,
      count: services.length
    },
    {
      id: "civil",
      name: "Dân Sự",
      icon: <HeartIcon className="w-5 h-5" />,
      count: services.filter(s => s.category === 'civil').length
    },
    {
      id: "legal",
      name: "Hình Sự",
      icon: <ShieldIcon className="w-5 h-5" />,
      count: services.filter(s => s.category === 'legal').length
    }
  ];

  // Log categories for debugging
  useEffect(() => {
    console.log('📊 Categories count:', categories.map(c => ({ name: c.name, count: c.count })));
  }, [services]);

  // Filter services
  useEffect(() => {
    console.log('🔍 Starting filter process...');
    console.log('📊 Total services:', services.length);
    console.log('🏷️ Selected category:', selectedCategory);
    console.log('🔍 Search term:', searchTerm);

    // Log all services with their categories (based on collectionMethod)
    services.forEach((service, index) => {
      console.log(`📋 Service ${index + 1}: "${service.title}" - Category: "${service.category}" (CollectionMethod: ${service.collectionMethod})`);
    });

    let filtered = services;

    // Filter by category
    if (selectedCategory !== "all") {
      console.log(`🔽 Filtering by category: ${selectedCategory}`);
      const beforeCount = filtered.length;
      filtered = filtered.filter(service => service.category === selectedCategory);
      console.log(`📉 Filtered from ${beforeCount} to ${filtered.length} services`);

      // Log which services passed the filter
      filtered.forEach((service, index) => {
        console.log(`✅ Filtered service ${index + 1}: "${service.title}" - Category: "${service.category}"`);
      });
    }

    // Filter by search term
    if (searchTerm) {
      console.log(`🔍 Filtering by search term: ${searchTerm}`);
      const beforeCount = filtered.length;
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase())) ||
        service.doctor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(`📉 Search filtered from ${beforeCount} to ${filtered.length} services`);
    }

    console.log('🎯 Final filtered services count:', filtered.length);
    setFilteredServices(filtered);
  }, [selectedCategory, searchTerm, services]);

  // Helper functions
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const formatPrice = (price: string) => {
    if (price.includes("đ")) return price;
    const numericPrice = parseFloat(price.replace(/[^\d]/g, ''));
    return !isNaN(numericPrice) ? `${numericPrice.toLocaleString('vi-VN')}đ` : `${price}đ`;
  };

  const getCollectionMethodInfo = (collectionMethod: number) => {
    if (collectionMethod === 0) {
      return {
        text: "Dân Sự - Tự thu mẫu / Thu tại nhà",
        icon: <HomeIcon className="w-4 h-4 mr-1.5 text-green-600" />,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200"
      };
    } else if (collectionMethod === 1) {
      return {
        text: "Hình Sự - Thu mẫu tại trung tâm",
        icon: <MapPinIcon className="w-4 h-4 mr-1.5 text-blue-600" />,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200"
      };
    } else {
      return {
        text: "Phương thức chưa xác định",
        icon: <ClockIcon className="w-4 h-4 mr-1.5 text-gray-500" />,
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        borderColor: "border-gray-200"
      };
    }
  };

  // ===== RENDER FUNCTIONS =====

  // Loading State
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="fixed z-50 w-full">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <Loading 
            size="large" 
            message="Đang tải danh sách dịch vụ..." 
            color="blue" 
          />
        </div>
      </div>
    );
  }

  // Error State
  if (error && services.length === 0) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="fixed z-50 w-full">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="mb-4 text-red-500">
              <ClipboardCheckIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Có lỗi xảy ra</h3>
            <p className="mb-4 text-gray-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main Render
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
                  <BreadcrumbItem><span className="font-semibold text-blue-900">Dịch Vụ Y Tế</span></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">Dịch Vụ Y Tế
              <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
                Chất Lượng Cao
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
              Cung cấp dịch vụ chăm sóc sức khỏe toàn diện với đội ngũ chuyên gia y tế hàng đầu và công nghệ hiện đại nhất.
            </p>

          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">

            {/* Section Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center bg-[#E8F4FD] px-4 py-2 rounded-full mb-4">
                <SearchIcon className="w-4 h-4 text-[#0066CC] mr-2" />
                <span className="text-[#0066CC] font-medium text-sm">TÌM KIẾM DỊCH VỤ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#003875] mb-4">
                Tìm Dịch Vụ Phù Hợp
              </h2>
              <p className="max-w-2xl mx-auto text-gray-600">
                Khám phá các dịch vụ y tế chuyên nghiệp được thiết kế để đáp ứng nhu cầu chăm sóc sức khỏe của bạn
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0066CC]/5 to-[#00D4FF]/5 rounded-2xl blur-xl"></div>
                <div className="relative p-2 bg-white border border-gray-200 shadow-xl rounded-2xl">
                  <div className="flex items-center">
                    <SearchIcon className="absolute left-6 text-[#0066CC] w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm dịch vụ, bác sĩ, chuyên khoa..."
                      className="w-full py-4 pl-16 pr-6 text-lg text-gray-800 placeholder-gray-500 bg-transparent border-0 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button className="bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#003875] !text-white px-8 py-3 rounded-xl font-semibold shadow-md">
                      Tìm Kiếm
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300 border-2 hover:scale-105 ${selectedCategory === category.id
                      ? 'bg-gradient-to-br from-[#0066CC] to-[#0052A3] border-[#0066CC] !text-white shadow-xl'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-[#0066CC] hover:shadow-lg'
                    }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${selectedCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-gradient-to-br from-[#E8F4FD] to-[#B3D9F2] group-hover:from-[#0066CC]/10 group-hover:to-[#0066CC]/20'
                    }`}>
                    <div className={`${selectedCategory === category.id ? 'text-white' : 'text-[#0066CC]'}`}>
                      {category.icon}
                    </div>
                  </div>

                  {/* Name */}
                  <span className="mb-2 text-sm font-semibold text-center">
                    {category.name}
                  </span>

                  {/* Count */}
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E8F4FD] text-[#0066CC] group-hover:bg-[#0066CC]/10'
                    }`}>
                    {category.count} dịch vụ
                  </span>

                  {/* Selection Indicator */}
                  {selectedCategory === category.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00D4FF] rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#003875]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services List Section */}
        <section className="py-20 bg-blue-50">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">

            {/* Section Header */}
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#003875] mb-6">
                Danh Sách Dịch Vụ Y Tế
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-gray-600">
                Dịch vụ có sẵn: <span className="font-semibold text-[#0066CC]">{filteredServices.length}</span>
                {selectedCategory !== "all" && (
                  <span> trong danh mục <span className="font-semibold text-[#0066CC]">{getCategoryName(selectedCategory)}</span></span>
                )}
              </p>
            </div>

            {/* Error Warning */}
            {error && (
              <div className="p-4 mb-8 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center">
                  <div className="mr-3 text-blue-600">ℹ️</div>
                  <div>
                    <p className="font-medium text-blue-800">{error}</p>
                    <p className="text-sm text-blue-600">
                      Bạn có thể xem và tìm hiểu về các dịch vụ của chúng tôi. Để đặt lịch, vui lòng đăng nhập.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {filteredServices.map((service) => (
                  <Card
                    key={service.id}
                    className="relative overflow-hidden transition-all duration-300 bg-white border shadow-md group hover:shadow-xl hover:-translate-y-2 rounded-2xl"
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none group-hover:opacity-100">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0066CC]/5 via-[#00D4FF]/5 to-[#0052A3]/5"></div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute z-20 top-4 left-4">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm transition-all duration-300 bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                        ✓ Đang hoạt động
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {service.featured && (
                      <div className="absolute z-20 top-4 right-4">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                          ⭐ Nổi bật
                        </span>
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative overflow-hidden h-60 rounded-t-2xl">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Hover Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 ease-in-out transform translate-y-full pointer-events-none group-hover:translate-y-0">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-white">{service.doctor}</span>
                          <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">{service.location}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      {/* Title & Description */}
                      <div className="mb-4">
                        <h3 className="mb-2 text-xl font-bold leading-tight text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                          {service.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      {/* Collection Method Info */}
                      <div className="mb-4">
                        {(() => {
                          const methodInfo = getCollectionMethodInfo(service.collectionMethod);
                          return (
                            <div className={`inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium ${methodInfo.bgColor} ${methodInfo.textColor} ${methodInfo.borderColor}`}>
                              {methodInfo.icon}
                              <span>{methodInfo.text}</span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Sample Requirements */}
                      <div className="p-4 mb-4 border rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                        <div className="flex items-center mb-2">
                          <h4 className="text-sm font-medium text-amber-800">Yêu Cầu Mẫu Xét Nghiệm</h4>
                        </div>
                        <div className="mb-2 text-sm text-amber-700">
                          <strong>Số Lượng:</strong> 2 mẫu bắt buộc
                        </div>
                        <div className="text-sm text-amber-700">
                          <strong>Loại Mẫu:</strong> Tăm bông miệng, Máu, Tóc có chân tóc, Móng tay, Nước bọt 
                        </div>
                      </div>

                      {/* Divider */}
                      <hr className="my-4 border-gray-100" />

                      {/* Price */}
                      <div className="mb-4">
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(service.price)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            openBookingModal({
                              id: service.id, // priceServiceId
                              serviceId: service.serviceId, // real testServiceId if available
                              name: service.title,
                              category: service.category,
                              price: Number(service.priceNumeric),
                              collectionMethod: Number(service.collectionMethod),
                              testServiceInfor: service.testServiceInfo ?? (service.serviceId ? { id: service.serviceId } : undefined)
                            });
                          }}
                          className="flex-1 font-semibold transition-all duration-300 transform rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 !text-white hover:shadow-lg hover:scale-105"
                          title="Đăng nhập để đặt lịch"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Đặt Lịch
                        </Button>
                        <Button
                          onClick={(e) => handleViewDetail(e, service.id)}
                          disabled={detailLoading === service.id}
                          variant="outline"
                          className="px-4 font-semibold transition-all duration-300 transform rounded-lg shadow-md border-slate-300 text-slate-600 hover:bg-slate-50 hover:shadow-lg hover:scale-105 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {detailLoading === service.id ? (
                            <div className="w-4 h-4 border-2 rounded-full border-slate-400 border-t-transparent animate-spin"></div>
                          ) : (
                            'Quy trình'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="py-20 text-center">
                <div className="relative inline-block mb-8">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto rounded-full shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                    <StethoscopeIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#0066CC] to-[#0052A3] rounded-full flex items-center justify-center">
                    <SearchIcon className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="mb-4 text-2xl font-bold text-gray-700">Không tìm thấy dịch vụ phù hợp</h3>
                <p className="max-w-md mx-auto mb-8 leading-relaxed text-gray-500">
                  Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc để khám phá các dịch vụ y tế của chúng tôi
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    onClick={handleResetFilters}
                    className="bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#003875] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    🔄 Đặt Lại Bộ Lọc
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="border-2 border-[#0066CC] text-[#0066CC] hover:bg-[#0066CC] hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                  >
                    Xóa Từ Khóa Tìm Kiếm
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-white md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
                Tại Sao Chọn Dịch Vụ Của Chúng Tôi?
              </h2>
              <p className="max-w-3xl mx-auto text-lg leading-relaxed text-slate-600">
                Chúng tôi cam kết mang lại chất lượng chăm sóc sức khỏe tốt nhất với công nghệ hiện đại
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-4">
              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <AwardIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Chất Lượng Cao</h3>
                <p className="text-slate-600">Dịch vụ y tế chất lượng cao với đội ngũ chuyên gia giàu kinh nghiệm</p>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <ClockIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Phục Vụ 24/7</h3>
                <p className="text-slate-600">Sẵn sàng phục vụ bạn mọi lúc với dịch vụ cấp cứu và tư vấn 24/7</p>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <ActivityIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Công Nghệ Tiên Tiến</h3>
                <p className="text-slate-600">Sử dụng thiết bị y tế hiện đại nhất cho chẩn đoán và điều trị</p>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <CheckCircleIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Uy Tín Đáng Tin</h3>
                <p className="text-slate-600">Được tin tưởng bởi hàng nghìn bệnh nhân với tỷ lệ hài lòng cao</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-900 to-blue-700">
          <div className="container max-w-4xl px-4 mx-auto text-center md:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Sẵn Sàng Đặt Lịch Dịch Vụ?
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-white/90">
              Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch sử dụng dịch vụ phù hợp
            </p>
            <p className="mb-6 text-sm text-white/80">
              💡 Đăng nhập để đặt lịch và xem thông tin chi tiết dịch vụ
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {/* <Button
                onClick={() => openBookingModal()}
                className="px-8 py-4 text-lg font-semibold text-blue-900 bg-white rounded-full hover:bg-blue-50 hover:text-blue-900"
                title="Đăng nhập để đặt lịch"
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Đặt Lịch Ngay
              </Button>
              <Button
                onClick={() => navigate('/auth/login')}
                variant="outline"
                className="px-8 py-4 text-lg text-white border-white rounded-full hover:bg-white hover:text-blue-900"
              >
                <UserCheckIcon className="w-5 h-5 mr-2" />
                Đăng Nhập
              </Button> */}
              <Button variant="outline" className="px-8 py-4 text-lg text-white border-white rounded-full hover:bg-white hover:text-blue-900">
                <PhoneIcon className="w-5 h-5 mr-2" />
                Hotline: 1900-xxxx
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
