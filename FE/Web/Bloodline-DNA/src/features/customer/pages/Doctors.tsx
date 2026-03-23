import {
  ActivityIcon,
  AwardIcon,
  BabyIcon,
  BrainIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  GraduationCapIcon,
  HeartIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
  StethoscopeIcon,
  UserIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Footer, Header } from "../../../components";
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

interface Doctor {
  id: number;
  name: string;
  title: string;
  specialization: string;
  experience: string;
  education: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  about: string;
  languages: string[];
  availableHours: string;
  services: string[];
  featured: boolean;
}

interface Specialization {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

export const Doctors = (): React.JSX.Element => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  // const sectionRef = useRef<HTMLElement>(null);

  const { openBookingModal } = useBookingModal();

  const specializations: Specialization[] = [
    {
      id: "all",
      name: "Tất Cả",
      icon: <UserIcon className="w-5 h-5" />,
      count: 12
    },
    {
      id: "cardiology",
      name: "Tim Mạch",
      icon: <HeartIcon className="w-5 h-5" />,
      count: 3
    },
    {
      id: "ophthalmology", 
      name: "Mắt",
      icon: <EyeIcon className="w-5 h-5" />,
      count: 2
    },
    {
      id: "neurology",
      name: "Thần Kinh",
      icon: <BrainIcon className="w-5 h-5" />,
      count: 2
    },
    {
      id: "pediatrics",
      name: "Nhi Khoa",
      icon: <BabyIcon className="w-5 h-5" />,
      count: 2
    },
    {
      id: "general",
      name: "Đa Khoa",
      icon: <StethoscopeIcon className="w-5 h-5" />,
      count: 3
    }
  ];

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "BS.CK2 Nguyễn Văn An",
      title: "Tiến sĩ, Bác sĩ Chuyên khoa II",
      specialization: "cardiology",
      experience: "15 năm kinh nghiệm",
      education: "Đại học Y Hà Nội, Chuyên tu tại Mỹ",
      location: "Bệnh viện Đa khoa Quốc tế",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.9,
      reviews: 234,
      price: "500.000đ",
      about: "Chuyên gia hàng đầu về tim mạch với hơn 15 năm kinh nghiệm điều trị các bệnh lý tim mạch phức tạp.",
      languages: ["Tiếng Việt", "English"],
      availableHours: "8:00 - 17:00",
      services: ["Khám tim mạch", "Siêu âm tim", "Điện tâm đồ", "Can thiệp mạch vành"],
      featured: true
    },
    {
      id: 2,
      name: "BS.CK1 Trần Thị Bình",
      title: "Bác sĩ Chuyên khoa I",
      specialization: "ophthalmology",
      experience: "12 năm kinh nghiệm",
      education: "Đại học Y Dược TP.HCM",
      location: "Phòng khám Chuyên khoa Mắt",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.8,
      reviews: 189,
      price: "400.000đ",
      about: "Bác sĩ chuyên khoa mắt với kinh nghiệm phong phú trong điều trị các bệnh lý về mắt.",
      languages: ["Tiếng Việt"],
      availableHours: "8:00 - 16:30",
      services: ["Khám mắt tổng quát", "Phẫu thuật cận thị", "Điều trị đục thủy tinh thể"],
      featured: false
    },
    {
      id: 3,
      name: "BS.CK2 Lê Minh Đức",
      title: "Tiến sĩ, Bác sĩ Chuyên khoa II",
      specialization: "neurology",
      experience: "18 năm kinh nghiệm",
      education: "Đại học Y Hà Nội, Thạc sĩ tại Nhật",
      location: "Trung tâm Thần kinh",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.9,
      reviews: 312,
      price: "600.000đ",
      about: "Chuyên gia thần kinh hàng đầu với nhiều công trình nghiên cứu được công nhận quốc tế.",
      languages: ["Tiếng Việt", "English", "日本語"],
      availableHours: "9:00 - 17:00",
      services: ["Khám thần kinh", "Điều trị đau đầu", "Chẩn đoán động kinh", "Tư vấn tâm lý"],
      featured: true
    },
    {
      id: 4,
      name: "BS. Phạm Thu Hằng",
      title: "Bác sĩ Chuyên khoa I",
      specialization: "pediatrics",
      experience: "10 năm kinh nghiệm",
      education: "Đại học Y Dược TP.HCM",
      location: "Bệnh viện Nhi đồng",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.7,
      reviews: 156,
      price: "350.000đ",
      about: "Bác sĩ nhi khoa tận tâm, chuyên điều trị các bệnh lý ở trẻ em từ sơ sinh đến 16 tuổi.",
      languages: ["Tiếng Việt", "English"],
      availableHours: "8:00 - 17:00",
      services: ["Khám nhi tổng quát", "Tiêm chủng", "Dinh dưỡng trẻ em", "Tư vấn phát triển"],
      featured: false
    },
    {
      id: 5,
      name: "BS.CK1 Hoàng Văn Tuấn",
      title: "Bác sĩ Chuyên khoa I",
      specialization: "general",
      experience: "14 năm kinh nghiệm",
      education: "Đại học Y Hà Nội",
      location: "Bệnh viện Đa khoa Trung ương",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.6,
      reviews: 198,
      price: "300.000đ",
      about: "Bác sĩ đa khoa giàu kinh nghiệm, chuyên khám và điều trị các bệnh lý nội khoa thường gặp.",
      languages: ["Tiếng Việt"],
      availableHours: "7:30 - 16:00",
      services: ["Khám nội tổng quát", "Điều trị tiểu đường", "Cao huyết áp", "Tư vấn sức khỏe"],
      featured: false
    },
    {
      id: 6,
      name: "BS.CK2 Nguyễn Thị Mai",
      title: "Tiến sĩ, Bác sĩ Chuyên khoa II",
      specialization: "cardiology",
      experience: "16 năm kinh nghiệm",
      education: "Đại học Y Dược TP.HCM, PhD tại Úc",
      location: "Bệnh viện Tim Hà Nội",
      image: "https://c.animaapp.com/mbgey19id5YPrV/img/rectangle-20-5.png",
      rating: 4.8,
      reviews: 267,
      price: "550.000đ",
      about: "Chuyên gia tim mạch nữ hàng đầu, đặc biệt trong lĩnh vực tim mạch can thiệp.",
      languages: ["Tiếng Việt", "English"],
      availableHours: "8:30 - 17:30",
      services: ["Khám tim mạch nữ", "Phẫu thuật tim", "Can thiệp mạch", "Tư vấn tim thai"],
      featured: true
    }
  ];

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

  useEffect(() => {
    let filtered = doctors;
    
    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialization);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredDoctors(filtered);
  }, [selectedSpecialization, searchTerm]);

  const getSpecializationName = (spec: string) => {
    const specialization = specializations.find(s => s.id === spec);
    return specialization ? specialization.name : spec;
  };

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
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af"/></svg>
          </div>
          <div className="container relative z-10 px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">Trang Chủ</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><span className="font-semibold text-blue-900">Đội Ngũ Bác Sĩ</span></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">Đội Ngũ Bác Sĩ
              <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
                Chuyên Gia Hàng Đầu
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">Gặp gỡ các chuyên gia y tế hàng đầu với nhiều năm kinh nghiệm và trình độ chuyên môn cao, cam kết mang lại dịch vụ chăm sóc sức khỏe tốt nhất.</p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 bg-white border-b border-gray-200 md:py-16">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <SearchIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
                  className="w-full py-4 pl-12 pr-4 text-lg transition-colors duration-200 border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {specializations.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecialization(spec.id)}
                  className={`flex items-center px-4 md:px-6 py-2 md:py-3 rounded-full transition-all duration-300 text-sm md:text-base font-medium ${
                    selectedSpecialization === spec.id
                      ? 'bg-blue-900 !text-white shadow-lg'
                      : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  {spec.icon}
                  <span className="ml-2">{spec.name}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedSpecialization === spec.id
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    {spec.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="py-16 md:py-20 lg:py-24 bg-blue-50">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            {/* Results Info */}
            <div className="mb-8">
              <p className="text-lg text-slate-600">
                Tìm thấy <span className="font-semibold text-blue-900">{filteredDoctors.length}</span> bác sĩ
                {selectedSpecialization !== "all" && (
                  <span> trong chuyên khoa <span className="font-semibold text-blue-900">{getSpecializationName(selectedSpecialization)}</span></span>
                )}
              </p>
            </div>

            {/* Featured Doctors */}
            {filteredDoctors.some(doctor => doctor.featured) && (
              <div className="mb-12">
                <h2 className="mb-8 text-2xl font-bold text-blue-900 md:text-3xl">Bác Sĩ Nổi Bật</h2>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredDoctors.filter(doctor => doctor.featured).map((doctor) => (
                    <Card key={doctor.id} className="relative overflow-hidden transition-all duration-500 bg-white border-0 group hover:shadow-2xl hover:-translate-y-2">
                      {/* Featured Badge */}
                      <div className="absolute z-10 px-3 py-1 text-sm font-semibold text-yellow-900 bg-yellow-400 rounded-full top-4 right-4">
                        ⭐ Nổi Bật
                      </div>
                      
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={doctor.image}
                          alt={doctor.name}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent group-hover:opacity-100"></div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="mb-1 text-xl font-bold text-blue-900 transition-colors duration-300 group-hover:text-blue-700">
                            {doctor.name}
                          </h3>
                          <p className="mb-1 text-sm font-semibold text-blue-600">{doctor.title}</p>
                          <p className="font-medium text-blue-600">{getSpecializationName(doctor.specialization)}</p>
                        </div>

                        <div className="mb-4 space-y-2 text-sm">
                          <div className="flex items-center text-slate-600">
                            <GraduationCapIcon className="w-4 h-4 mr-2 text-blue-500" />
                            {doctor.experience}
                          </div>
                          <div className="flex items-center text-slate-600">
                            <MapPinIcon className="w-4 h-4 mr-2 text-blue-500" />
                            {doctor.location}
                          </div>
                          <div className="flex items-center text-slate-600">
                            <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
                            {doctor.availableHours}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="ml-1 font-semibold text-gray-800">{doctor.rating}</span>
                            <span className="ml-1 text-sm text-slate-500">({doctor.reviews})</span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-blue-900">{doctor.price}</span>
                            <p className="text-xs text-slate-500">/ lần khám</p>
                          </div>
                        </div>

                        <p className="mb-4 text-sm text-slate-600 line-clamp-2">
                          {doctor.about}
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                          {/* <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:!text-white text-sm py-2">
                            Xem Chi Tiết
                          </Button> */}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Doctors */}
            <div>
              <h2 className="mb-8 text-2xl font-bold text-blue-900 md:text-3xl">
                {filteredDoctors.some(doctor => doctor.featured) ? "Tất Cả Bác Sĩ" : "Danh Sách Bác Sĩ"}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.id} className="overflow-hidden transition-all duration-300 bg-white border-0 group hover:shadow-xl hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={doctor.image}
                        alt={doctor.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                      {doctor.featured && (
                        <div className="absolute px-2 py-1 text-xs font-semibold text-yellow-900 bg-yellow-400 rounded-full top-2 right-2">
                          ⭐
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <h3 className="mb-1 text-lg font-bold text-blue-900 transition-colors duration-300 group-hover:text-blue-700 line-clamp-1">
                          {doctor.name}
                        </h3>
                        <p className="text-sm font-medium text-blue-600">{getSpecializationName(doctor.specialization)}</p>
                      </div>

                      <div className="mb-3 space-y-1 text-xs">
                        <div className="flex items-center text-slate-600">
                          <GraduationCapIcon className="w-3 h-3 mr-1 text-blue-500" />
                          {doctor.experience}
                        </div>
                        <div className="flex items-center text-slate-600">
                          <ClockIcon className="w-3 h-3 mr-1 text-blue-500" />
                          {doctor.availableHours}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-semibold text-gray-800">{doctor.rating}</span>
                        </div>
                        <span className="text-sm font-bold text-blue-900">{doctor.price}</span>
                      </div>

                      {/* <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:!text-white text-sm py-2">
                            Xem Chi Tiết
                          </Button>
                      </div> */}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Results */}
              {filteredDoctors.length === 0 && (
                <div className="py-16 text-center">
                  <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="mb-2 text-xl font-semibold text-slate-600">Không tìm thấy bác sĩ</h3>
                  <p className="text-slate-500">Vui lòng thử lại với từ khóa khác hoặc thay đổi bộ lọc</p>
                  <Button 
                    onClick={() => {
                      setSelectedSpecialization("all");
                      setSearchTerm("");
                    }}
                    className="mt-4 bg-blue-900 hover:bg-blue-800 !text-white"
                  >
                    Đặt Lại Bộ Lọc
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Our Doctors */}
        <section className="py-16 bg-white md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-6 text-3xl font-bold text-blue-900 md:text-4xl lg:text-5xl">
                Tại Sao Chọn Bác Sĩ Của Chúng Tôi?
              </h2>
              <p className="max-w-3xl mx-auto text-lg leading-relaxed text-slate-600">
                Đội ngũ bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm và được đào tạo bài bản
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <AwardIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Chuyên Gia Hàng Đầu</h3>
                <p className="text-slate-600">Các bác sĩ được đào tạo tại những trường đại học y khoa uy tín</p>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <HeartIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Tận Tâm Chăm Sóc</h3>
                <p className="text-slate-600">Luôn đặt sức khỏe và sự hài lòng của bệnh nhân lên hàng đầu</p>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <ActivityIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Công Nghệ Hiện Đại</h3>
                <p className="text-slate-600">Sử dụng trang thiết bị y tế tiên tiến nhất cho chẩn đoán chính xác</p>
              </div>

              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <CheckCircleIcon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-blue-900">Kinh Nghiệm Phong Phú</h3>
                <p className="text-slate-600">Nhiều năm kinh nghiệm điều trị thành công hàng nghìn ca bệnh</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-900 to-blue-700">
          <div className="container max-w-4xl px-4 mx-auto text-center md:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Sẵn Sàng Đặt Lịch Khám?
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-white/90">
              Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch khám với bác sĩ phù hợp
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                onClick={openBookingModal}
                className="px-8 py-4 text-lg font-semibold text-blue-900 bg-white rounded-full hover:bg-blue-50 hover:text-blue-900"
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Đặt Lịch Khám
              </Button>
              {/* <Button variant="outline" className="px-8 py-4 text-lg text-white border-white rounded-full hover:bg-white hover:text-blue-900">
                <PhoneIcon className="w-5 h-5 mr-2" />
                Hotline: 1900-xxxx
              </Button> */}
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="relative">
          <Footer />
        </div>
      </div>
    </div>
  );
}; 