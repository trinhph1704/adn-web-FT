'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header, Footer, Loading } from '@/components/shared';
import {
  Search,
  Calendar,
  Home,
  MapPin,
  Stethoscope,
  Heart,
  Shield,
  CheckCircle,
  Clock,
  Award,
  Activity,
  Phone,
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  category: 'civil' | 'legal';
  price: number;
  collectionMethod: number;
  image: string;
  features: string[];
  isActive: boolean;
}

const categoryInfo = {
  civil: {
    name: 'Dân Sự',
    icon: Heart,
    description: 'Tự thu mẫu / Thu tại nhà',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  legal: {
    name: 'Hành Chính',
    icon: Shield,
    description: 'Thu mẫu tại trung tâm',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
};

// Mock data
const mockServices: Service[] = [
  {
    id: '1',
    title: 'Xét nghiệm ADN Cha Con',
    description: 'Xác định quan hệ huyết thống giữa cha và con với độ chính xác 99.99%',
    category: 'civil',
    price: 3500000,
    collectionMethod: 0,
    image: 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
    features: ['Kết quả 3-5 ngày', 'Lấy mẫu tại nhà', 'Bảo mật tuyệt đối'],
    isActive: true,
  },
  {
    id: '2',
    title: 'Xét nghiệm ADN Pháp lý',
    description: 'Xét nghiệm ADN cho mục đích pháp lý, có giá trị trước tòa án',
    category: 'legal',
    price: 5500000,
    collectionMethod: 1,
    image: 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
    features: ['Có giá trị pháp lý', 'Lấy mẫu tại cơ sở', 'Công chứng kết quả'],
    isActive: true,
  },
  {
    id: '3',
    title: 'Xét nghiệm Quan hệ Họ hàng',
    description: 'Xác định quan hệ huyết thống giữa anh chị em, ông bà và cháu',
    category: 'civil',
    price: 4500000,
    collectionMethod: 0,
    image: 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
    features: ['Độ chính xác cao', 'Bảo mật thông tin', 'Hỗ trợ tư vấn 24/7'],
    isActive: true,
  },
  {
    id: '4',
    title: 'Xét nghiệm ADN Thai nhi',
    description: 'Xác định huyết thống khi thai nhi còn trong bụng mẹ, an toàn và không xâm lấn',
    category: 'legal',
    price: 8500000,
    collectionMethod: 1,
    image: 'https://i.postimg.cc/YSFzZ4VZ/9e0e121abaf50eab57e4.jpg',
    features: ['An toàn 100%', 'Không xâm lấn', 'Kết quả chính xác'],
    isActive: true,
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'civil' | 'legal'>('all');

  useEffect(() => {
    // Simulate API call
    const loadServices = async () => {
      setLoading(true);
      try {
        // In production, replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setServices(mockServices);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory && service.isActive;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const categories = [
    {
      id: 'all',
      name: 'Tất Cả',
      icon: Stethoscope,
      count: services.length,
    },
    {
      id: 'civil',
      name: 'Dân Sự',
      icon: Heart,
      count: services.filter((s) => s.category === 'civil').length,
    },
    {
      id: 'legal',
      name: 'Hành Chính',
      icon: Shield,
      count: services.filter((s) => s.category === 'legal').length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden md:py-28 bg-blue-50">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af" />
          </svg>
        </div>
        <div className="container relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Trang Chủ
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-semibold text-blue-900">Dịch Vụ Y Tế</span>
          </nav>

          <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">
            Dịch Vụ Y Tế
            <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
              Chất Lượng Cao
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            Cung cấp dịch vụ chăm sóc sức khỏe toàn diện với đội ngũ chuyên gia y tế hàng đầu và công nghệ hiện đại nhất.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-white">
        <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-blue-50">
              <Search className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">TÌM KIẾM DỊCH VỤ</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
              Tìm Dịch Vụ Phù Hợp
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Khám phá các dịch vụ y tế chuyên nghiệp được thiết kế để đáp ứng nhu cầu chăm sóc sức khỏe của bạn
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative p-2 bg-white border border-gray-200 shadow-xl rounded-2xl">
              <div className="flex items-center">
                <Search className="absolute w-6 h-6 text-blue-600 left-6" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ, bác sĩ, chuyên khoa..."
                  className="w-full py-4 pl-16 pr-6 text-lg text-gray-800 placeholder-gray-500 bg-transparent border-0 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="px-8 py-3 font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700">
                  Tìm Kiếm
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as 'all' | 'civil' | 'legal')}
                className={`flex flex-col items-center p-6 transition-all duration-300 border-2 rounded-2xl hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-600 text-white shadow-xl'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:shadow-lg'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
                    selectedCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-blue-50'
                  }`}
                >
                  <category.icon
                    className={`w-8 h-8 ${
                      selectedCategory === category.id ? 'text-white' : 'text-blue-600'
                    }`}
                  />
                </div>
                <span className="mb-2 text-sm font-semibold">{category.name}</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {category.count} dịch vụ
                </span>
                {selectedCategory === category.id && (
                  <div className="absolute w-6 h-6 bg-cyan-400 rounded-full -top-2 -right-2 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-900" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-blue-50">
        <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
              Danh Sách Dịch Vụ Y Tế
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Dịch vụ có sẵn:{' '}
              <span className="font-semibold text-blue-600">{filteredServices.length}</span>
              {selectedCategory !== 'all' && (
                <span>
                  {' '}
                  trong danh mục{' '}
                  <span className="font-semibold text-blue-600">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                </span>
              )}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loading size="large" message="Đang tải danh sách dịch vụ..." />
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => {
                const catInfo = categoryInfo[service.category];
                return (
                  <div
                    key={service.id}
                    className="relative overflow-hidden transition-all duration-300 bg-white border shadow-md group hover:shadow-xl hover:-translate-y-2 rounded-2xl"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-60 rounded-t-2xl">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 rounded-full">
                          ✓ Đang hoạt động
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="mb-2 text-xl font-bold leading-tight text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                        {service.title}
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Category Badge */}
                      <div
                        className={`inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium mb-4 ${catInfo.bgColor} ${catInfo.textColor} ${catInfo.borderColor}`}
                      >
                        {service.collectionMethod === 0 ? (
                          <Home className="w-4 h-4 mr-1.5" />
                        ) : (
                          <MapPin className="w-4 h-4 mr-1.5" />
                        )}
                        <span>
                          {catInfo.name} - {catInfo.description}
                        </span>
                      </div>

                      {/* Features */}
                      <div className="p-3 mb-4 border rounded-lg bg-amber-50 border-amber-200">
                        <h4 className="mb-2 text-sm font-medium text-amber-800">
                          Đặc điểm nổi bật
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-700"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <hr className="my-4 border-gray-100" />

                      {/* Price */}
                      <div className="mb-4">
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(service.price)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/booking?serviceId=${service.id}`}
                          className="flex items-center justify-center flex-1 gap-2 py-3 font-semibold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          <Calendar className="w-4 h-4" />
                          Đặt Lịch
                        </Link>
                        <Link
                          href={`/services/${service.id}`}
                          className="px-4 py-3 font-semibold transition-all border rounded-lg text-slate-600 border-slate-300 hover:bg-slate-50"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full">
                <Stethoscope className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-700">
                Không tìm thấy dịch vụ phù hợp
              </h3>
              <p className="max-w-md mx-auto mb-8 text-gray-500">
                Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-8 py-4 font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700"
              >
                🔄 Đặt Lại Bộ Lọc
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white md:py-20">
        <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
              Tại Sao Chọn Dịch Vụ Của Chúng Tôi?
            </h2>
            <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600">
              Chúng tôi cam kết mang lại chất lượng chăm sóc sức khỏe tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                <Award className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900">Chất Lượng Cao</h3>
              <p className="text-gray-600">
                Dịch vụ y tế chất lượng cao với đội ngũ chuyên gia giàu kinh nghiệm
              </p>
            </div>

            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                <Clock className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900">Phục Vụ 24/7</h3>
              <p className="text-gray-600">
                Sẵn sàng phục vụ bạn mọi lúc với dịch vụ tư vấn 24/7
              </p>
            </div>

            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                <Activity className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900">Công Nghệ Tiên Tiến</h3>
              <p className="text-gray-600">
                Sử dụng thiết bị y tế hiện đại nhất cho chẩn đoán và xét nghiệm
              </p>
            </div>

            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                <CheckCircle className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900">Uy Tín Đáng Tin</h3>
              <p className="text-gray-600">
                Được tin tưởng bởi hàng nghìn khách hàng với tỷ lệ hài lòng cao
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="container max-w-4xl px-4 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Sẵn Sàng Đặt Lịch Dịch Vụ?
          </h2>
          <p className="mb-8 text-xl leading-relaxed text-white/90">
            Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch sử dụng dịch vụ phù hợp
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-blue-900 bg-white rounded-full hover:bg-blue-50"
            >
              <Calendar className="w-5 h-5" />
              Đặt Lịch Ngay
            </Link>
            <a
              href="tel:1900xxxx"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg text-white border border-white rounded-full hover:bg-white hover:text-blue-900"
            >
              <Phone className="w-5 h-5" />
              Hotline: 1900-xxxx
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

