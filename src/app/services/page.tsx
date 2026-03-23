'use client';

import { Footer, Header } from "@/components/shared";
import {
  Calendar,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBookingModal } from "@/components/customer/BookingModalProvider";
import type { ServicePrice, TestService } from "@/types";
import {
  SampleCollectionMethod,
  TestServiceTypeLabels,
  TestServiceType,
} from "@/types";

interface ServiceItem extends ServicePrice {
  testServiceInfor?: TestService;
}

const fallbackServices: ServiceItem[] = [
  {
    id: "1",
    serviceId: "s1",
    price: 500000,
    collectionMethod: SampleCollectionMethod.SelfSample,
    effectiveFrom: new Date(),
    effectiveTo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    testServiceInfor: {
      id: "s1",
      name: "Xét nghiệm ADN huyết thống cha - con",
      description:
        "Xác định quan hệ cha con với độ chính xác 99.99%. Tự lấy mẫu tại nhà hoặc đến cơ sở.",
      sampleCount: 2,
      type: TestServiceType.Civil,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: "2",
    serviceId: "s2",
    price: 2000000,
    collectionMethod: SampleCollectionMethod.AtFacility,
    effectiveFrom: new Date(),
    effectiveTo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    testServiceInfor: {
      id: "s2",
      name: "Xét nghiệm ADN pháp lý",
      description:
        "Xét nghiệm ADN có giá trị pháp lý, lấy mẫu tại trung tâm dưới sự giám sát.",
      sampleCount: 2,
      type: TestServiceType.Legal,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: "3",
    serviceId: "s3",
    price: 800000,
    collectionMethod: SampleCollectionMethod.SelfSample,
    effectiveFrom: new Date(),
    effectiveTo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    testServiceInfor: {
      id: "s3",
      name: "Xét nghiệm ADN huyết thống mẹ - con",
      description:
        "Xác định quan hệ mẹ con với độ chính xác cao. Mẫu tăm bông miệng đơn giản.",
      sampleCount: 2,
      type: TestServiceType.Civil,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

export default function ServicesPage() {
  const { openBookingModal } = useBookingModal();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch("/api/services");
        const json = await res.json();
        if (res.ok && json?.data?.length) {
          setServices(json.data);
        } else {
          setServices(fallbackServices);
        }
      } catch {
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const info = s.testServiceInfor;
    if (!info) return false;
    const matchSearch =
      !searchTerm ||
      info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "all" ||
      (selectedCategory === "civil" && info.type === TestServiceType.Civil) ||
      (selectedCategory === "legal" && info.type === TestServiceType.Legal);
    return matchSearch && matchCategory;
  });

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + " ₫";

  const getCollectionMethodInfo = (method: SampleCollectionMethod) => {
    if (method === SampleCollectionMethod.SelfSample) {
      return {
        text: "Tự lấy mẫu / Thu tại nhà",
        icon: Home,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
      };
    }
    return {
      text: "Lấy mẫu tại trung tâm",
      icon: MapPin,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCFEFE] to-gray-50">
      <Header />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-blue-50">
        <div className="container relative z-10 px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center gap-2 mb-6 text-sm text-blue-600">
            <Link href="/" className="hover:underline">
              Trang Chủ
            </Link>
            <span>/</span>
            <span className="font-semibold text-blue-900">Dịch Vụ Xét Nghiệm ADN</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl">
            Dịch Vụ Xét Nghiệm ADN
            <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
              Chất Lượng Cao
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            Cung cấp dịch vụ xét nghiệm ADN huyết thống chuyên nghiệp với đội ngũ
            chuyên gia và công nghệ hiện đại.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white">
        <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full mb-4">
              <Search className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-600 font-medium text-sm">
                TÌM KIẾM DỊCH VỤ
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Tìm Dịch Vụ Phù Hợp
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Khám phá các dịch vụ xét nghiệm ADN chuyên nghiệp
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {["all", "civil", "legal"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat === "all"
                  ? "Tất Cả"
                  : cat === "civil"
                    ? "Dân Sự"
                    : "Hành Chính"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-blue-50">
        <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold text-center text-blue-900 md:text-3xl">
            Danh Sách Dịch Vụ
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => {
                const info = service.testServiceInfor;
                if (!info) return null;
                const methodInfo = getCollectionMethodInfo(
                  service.collectionMethod
                );
                const MethodIcon = methodInfo.icon;

                return (
                  <div
                    key={service.id}
                    className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100"
                  >
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full mb-3">
                      {TestServiceTypeLabels[info.type]}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {info.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {info.description}
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-4 ${methodInfo.bgColor} ${methodInfo.textColor}`}
                    >
                      <MethodIcon className="w-4 h-4" />
                      {methodInfo.text}
                    </div>
                    <div className="text-xl font-bold text-blue-600 mb-4">
                      {formatPrice(service.price)}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        openBookingModal({
                          id: service.id,
                          serviceId: service.serviceId,
                          name: info.name,
                          category: info.type === TestServiceType.Civil ? "civil" : "legal",
                          price: service.price,
                          collectionMethod: service.collectionMethod,
                          testServiceInfor: { id: info.id, name: info.name },
                          testServiceInfo: { id: info.id, name: info.name },
                        })
                      }
                      className="flex items-center justify-center gap-2 w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <Calendar className="w-4 h-4" />
                      Đặt Lịch
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <ShieldCheck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-700">Không tìm thấy dịch vụ</h3>
              <p className="text-gray-500 mt-2">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="container max-w-4xl px-4 mx-auto text-center md:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Sẵn Sàng Đặt Lịch?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Liên hệ ngay để được tư vấn và đặt lịch xét nghiệm ADN
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-blue-900 bg-white rounded-full hover:bg-blue-50"
            >
              Đăng Nhập
            </Link>
            <a
              href="tel:+84342555702"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg text-white border border-white rounded-full hover:bg-white hover:text-blue-900"
            >
              Hotline: +84 342 555 702
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
