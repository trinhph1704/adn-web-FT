"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";
import { Loading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getBookingById } from "@/lib/api/bookings";
import { BookingStatus } from "@/types";
import { getStatusConfig } from "@/components/customer/bookingStatus/StatusConfig";
import { BookingDetailTab } from "@/components/customer/bookingStatus/BookingDetailTab";
import { BookingProgressTab } from "@/components/customer/bookingStatus/BookingProgressTab";

export default function BookingStatusPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"detail" | "progress">("detail");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBookingById(id);
        setBooking(data as Record<string, unknown>);
        setError(null);
      } catch {
        setBooking(null);
        setError("Không thể tải thông tin đặt lịch");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loading size="large" message="Đang tải thông tin đơn hẹn..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
          <h3 className="mb-2 text-xl font-semibold text-slate-600">
            {error ?? "Không tìm thấy lịch hẹn"}
          </h3>
          <p className="mb-6 text-slate-500">
            {error ? "Vui lòng thử lại sau." : "Lịch hẹn không tồn tại hoặc đã bị xóa."}
          </p>
          <Button
            onClick={() => router.push("/customer/booking-list")}
            className="bg-blue-900 text-white hover:bg-blue-800"
          >
            Về Danh Sách
          </Button>
        </div>
      </div>
    );
  }

  const status = (booking.status as BookingStatus) ?? BookingStatus.Pending;
  const statusInfo = getStatusConfig(status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fcfefe] to-gray-50">
      <section className="relative w-full overflow-hidden bg-blue-50 py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af" />
          </svg>
        </div>
        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
                Trang Chủ
              </Link>
              <span className="text-slate-400">/</span>
              <Link href="/customer/booking-list" className="text-blue-600 hover:text-blue-800 hover:underline">
                Danh Sách Đặt Lịch
              </Link>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-blue-900">Trạng Thái Đơn Hẹn</span>
            </nav>
          </div>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="flex-1">
              <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">
                Trạng Thái Đơn Hẹn
                <span className="mt-2 block text-2xl font-medium text-blue-700 md:text-3xl">
                  Theo Dõi Tiến Trình Xét Nghiệm
                </span>
              </h1>
              <p className="mb-4 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
                Theo dõi chi tiết tiến trình xét nghiệm ADN của bạn từ khi đăng ký đến lúc nhận kết quả.
              </p>
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${statusInfo.color}`}
                >
                  <StatusIcon className="h-5 w-5" />
                  {statusInfo.label}
                </div>
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Mã đơn:</span> #{String(booking.id ?? "").slice(-8)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 border-b">
          <button
            type="button"
            onClick={() => setActiveTab("detail")}
            className={`px-4 py-3 font-semibold transition-colors duration-200 ${
              activeTab === "detail"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Chi Tiết Đơn Hẹn
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("progress")}
            className={`px-4 py-3 font-semibold transition-colors duration-200 ${
              activeTab === "progress"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Theo Dõi Tiến Trình
          </button>
        </div>

        <div>
          {activeTab === "detail" ? (
            <BookingDetailTab booking={booking as Parameters<typeof BookingDetailTab>[0]["booking"]} />
          ) : (
            <BookingProgressTab booking={booking as Parameters<typeof BookingProgressTab>[0]["booking"]} />
          )}
        </div>
      </main>
    </div>
  );
}
