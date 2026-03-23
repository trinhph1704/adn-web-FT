"use client";

import { Building2, Calendar, Clock, Home, MapPin, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SampleCollectionMethod } from "@/types";

interface BookingDetailTabProps {
  booking: {
    id: string;
    clientName?: string;
    phone?: string;
    address?: string;
    note?: string;
    appointmentDate?: string;
    collectionMethod?: number;
    price?: number;
    testService?: { name?: string };
  };
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr: string | undefined): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatPrice(price: number | undefined): string {
  if (price == null) return "Liên hệ";
  return price.toLocaleString("vi-VN") + " ₫";
}

export function BookingDetailTab({ booking }: BookingDetailTabProps) {
  const isSelfSample = booking.collectionMethod === SampleCollectionMethod.SelfSample;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="bg-blue-50/50">
            <h3 className="font-bold text-blue-900">Thông Tin Dịch Vụ</h3>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-4">
              {isSelfSample ? (
                <Home className="h-8 w-8 text-blue-600" />
              ) : (
                <Building2 className="h-8 w-8 text-blue-600" />
              )}
              <div>
                <p className="font-semibold text-slate-800">
                  {booking.testService?.name ?? "Xét nghiệm ADN"}
                </p>
                <p className="text-sm text-slate-500">
                  {isSelfSample ? "Tự thu mẫu / Thu tại nhà" : "Thu mẫu tại trung tâm"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="font-medium">{formatDate(booking.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="font-medium">{formatTime(booking.appointmentDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-blue-50/50">
            <h3 className="font-bold text-blue-900">Thông Tin Khách Hàng</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 p-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-slate-500">Họ tên</p>
                <p className="font-medium">{booking.clientName ?? "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-slate-500">Điện thoại</p>
                <p className="font-medium">{booking.phone ?? "-"}</p>
              </div>
            </div>
            {booking.address && (
              <div className="col-span-2 flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-slate-500">Địa chỉ</p>
                  <p className="font-medium">{booking.address}</p>
                </div>
              </div>
            )}
            {booking.note && (
              <div className="col-span-2 mt-4 border-t pt-4">
                <p className="mb-1 text-sm font-medium text-slate-600">Ghi chú:</p>
                <p className="text-sm italic text-slate-500">&quot;{booking.note}&quot;</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-green-50/50">
            <h3 className="font-bold text-green-900">Thanh Toán</h3>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Giá dịch vụ</span>
                <span>{formatPrice(booking.price)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-purple-50/50">
            <h3 className="font-bold text-purple-900">Hỗ Trợ</h3>
          </CardHeader>
          <CardContent className="p-6 text-sm text-slate-600">
            <p className="mb-2">Cần hỗ trợ? Liên hệ với chúng tôi qua:</p>
            <p>
              <strong>Hotline:</strong>{" "}
              <a href="tel:0342555702" className="text-blue-600 hover:underline">
                0342555702
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
