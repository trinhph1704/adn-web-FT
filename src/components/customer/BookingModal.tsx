"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Home,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";
import { createBookingApi, mapFormDataToBookingRequest } from "@/lib/api/bookings";
import { getUserInfoApi } from "@/lib/api/auth";
import { AddressSelector } from "./AddressSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { SelectedService } from "./BookingModalContext";

interface BookingFormData {
  serviceType: "home" | "clinic";
  name: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  testType: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: SelectedService | null;
}

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
];

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    null
  );
}

export function BookingModal({ isOpen, onClose, selectedService }: BookingModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: "home",
    name: "",
    phone: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
    testType: "civil-self",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const [bookingResponse, setBookingResponse] = useState<{ data?: { bookingId?: string }; id?: string } | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);

  const isAuthenticated = () => !!getAuthToken();

  useEffect(() => {
    if (selectedService) {
      const defaultServiceType: "home" | "clinic" =
        selectedService.collectionMethod === 1 ? "clinic" : "home";
      const defaultAddress = defaultServiceType === "clinic" ? "TẠI CƠ SỞ" : "";
      setFormData((prev) => ({
        ...prev,
        serviceType: defaultServiceType,
        testType: selectedService.id,
        address: defaultAddress,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        serviceType: "home",
        testType: "civil-self",
        address: "",
      }));
    }
  }, [selectedService]);

  useEffect(() => {
    if (step === 2 && isOpen && isAuthenticated()) {
      const isEmpty = !formData.name.trim() && !formData.phone.trim() &&
        (!formData.address.trim() || formData.address === "TẠI CƠ SỞ");
      if (isEmpty) {
        setIsLoadingUserInfo(true);
        getUserInfoApi()
          .then((userInfo) => {
            if (userInfo) {
              setFormData((prev) => ({
                ...prev,
                name: (userInfo as { fullName?: string }).fullName || prev.name,
                phone: (userInfo as { phone?: string }).phone || prev.phone,
                address: formData.serviceType === "clinic" ? "TẠI CƠ SỞ" : (userInfo as { address?: string }).address || prev.address,
              }));
            }
          })
          .catch(() => {})
          .finally(() => setIsLoadingUserInfo(false));
      }
    }
  }, [step, isOpen, formData.serviceType]);

  useEffect(() => {
    if (formData.serviceType === "clinic") {
      setFormData((prev) => ({ ...prev, address: "TẠI CƠ SỞ" }));
    } else if (formData.serviceType === "home" && formData.address === "TẠI CƠ SỞ") {
      setFormData((prev) => ({ ...prev, address: "" }));
    }
  }, [formData.serviceType]);

  const getAvailableTimeSlots = () => {
    if (!formData.preferredDate) return TIME_SLOTS;
    const selected = new Date(formData.preferredDate);
    const today = new Date();
    const sel = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
    const tdy = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (sel.getTime() !== tdy.getTime()) return TIME_SLOTS;
    const now = today.getHours() * 60 + today.getMinutes();
    return TIME_SLOTS.filter((slot) => {
      const [h, m] = slot.split(":").map(Number);
      return h * 60 + m > now;
    });
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedService) return;
    setLoading(true);
    setApiError(null);
    try {
      const request = mapFormDataToBookingRequest(formData, selectedService);
      const result = await createBookingApi(request);
      setBookingResponse(result as { data?: { bookingId?: string }; id?: string });
      setStep(3);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Đã xảy ra lỗi. Vui lòng thử lại.";
      if (msg.includes("401") || msg.includes("Unauthorized")) {
        setApiError("Bạn cần đăng nhập để đặt lịch. Vui lòng đăng nhập và thử lại.");
      } else {
        setApiError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateStep1 = () => formData.serviceType && formData.testType && selectedService;
  const validateStep2 = () => {
    const hasAddress = formData.serviceType === "clinic"
      ? formData.address === "TẠI CƠ SỞ"
      : formData.address && formData.address.split(",").length >= 2;
    return formData.name && formData.phone && formData.preferredDate && formData.preferredTime && hasAddress;
  };

  const resetForm = () => {
    setFormData({
      serviceType: "home",
      name: "",
      phone: "",
      address: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
      testType: "civil-self",
    });
    setStep(1);
    setApiError(null);
    setBookingResponse(null);
  };

  const handleClose = () => {
    const bookingId = bookingResponse?.data?.bookingId ?? (bookingResponse as { id?: string })?.id;
    if (step === 3 && bookingId) {
      const col = selectedService?.collectionMethod;
      if (col === 1) {
        router.push("/booking-list");
      } else {
        router.push(`/booking-status/${bookingId}`);
      }
      setTimeout(() => {
        resetForm();
        onClose();
      }, 100);
    } else {
      resetForm();
      onClose();
    }
  };

  const getSelectedTestType = () => {
    if (!selectedService) return null;
    const info = selectedService.testServiceInfor ?? selectedService.testServiceInfo;
    return {
      id: selectedService.id,
      name: info?.name ?? selectedService.name ?? "Dịch vụ xét nghiệm",
      price: selectedService.price ? `${selectedService.price.toLocaleString("vi-VN")}đ` : "Liên hệ",
      time: "3-7 ngày",
      category: selectedService.category === "civil" ? "Dân sự" : "Hình sự",
    };
  };

  const shouldShowServiceType = (type: "home" | "clinic") => {
    if (!selectedService) return true;
    return type === "home" ? selectedService.collectionMethod === 0 : selectedService.collectionMethod === 1;
  };

  const getAvailableServiceTypesCount = () => {
    if (!selectedService) return 2;
    return selectedService.collectionMethod === 0 || selectedService.collectionMethod === 1 ? 1 : 2;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader className="p-6 text-white rounded-t-lg bg-gradient-to-r from-blue-900 to-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Đặt Lịch Xét Nghiệm ADN</h2>
                <p className="text-white/90">
                  Chọn gói xét nghiệm ADN và phương thức thu mẫu phù hợp
                </p>
              </div>
              <button
                type="button"
                title="Đóng"
                onClick={handleClose}
                className="flex items-center justify-center w-8 h-8 transition-colors duration-200 rounded-full bg-white/20 hover:bg-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center mt-6 space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step >= stepNum ? "bg-white text-blue-900" : "bg-white/20 text-white"
                    }`}
                  >
                    {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 h-0.5 ${step > stepNum ? "bg-white" : "bg-white/20"}`} />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-blue-900">Chọn hình thức thu mẫu</h3>
                  <div className={`grid gap-4 ${getAvailableServiceTypesCount() === 1 ? "grid-cols-1 place-items-center" : "grid-cols-1 md:grid-cols-2"}`}>
                    {shouldShowServiceType("home") && (
                      <label className={`cursor-pointer ${getAvailableServiceTypesCount() === 1 ? "max-w-md" : ""}`}>
                        <input
                          type="radio"
                          name="serviceType"
                          value="home"
                          checked={formData.serviceType === "home"}
                          onChange={(e) => handleInputChange("serviceType", e.target.value as "home")}
                          className="sr-only"
                        />
                        <div
                          className={`p-6 border-2 rounded-lg transition-all duration-200 text-center ${
                            formData.serviceType === "home" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <Home className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                          <h4 className="mb-2 font-semibold text-slate-700">Tự thu mẫu / Thu tại nhà</h4>
                          <p className="text-sm text-slate-600">
                            Nhận bộ kit ADN hoặc nhân viên đến tận nhà thu mẫu
                          </p>
                          <div className="mt-3 text-sm font-medium text-blue-600">
                            🧬 {selectedService?.category === "civil" ? "Phù hợp cho ADN Dân sự" : "Phù hợp cho ADN Hình sự"}
                          </div>
                        </div>
                      </label>
                    )}
                    {shouldShowServiceType("clinic") && (
                      <label className={`cursor-pointer ${getAvailableServiceTypesCount() === 1 ? "max-w-md" : ""}`}>
                        <input
                          type="radio"
                          name="serviceType"
                          value="clinic"
                          checked={formData.serviceType === "clinic"}
                          onChange={(e) => handleInputChange("serviceType", e.target.value as "clinic")}
                          className="sr-only"
                        />
                        <div
                          className={`p-6 border-2 rounded-lg transition-all duration-200 text-center ${
                            formData.serviceType === "clinic" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <Building2 className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                          <h4 className="mb-2 font-semibold text-slate-700">Thu mẫu tại trung tâm</h4>
                          <p className="text-sm text-slate-600">Đến trung tâm để thu mẫu với quy trình chuẩn</p>
                          <div className="mt-3 text-sm font-medium text-green-600">⚖️ Có giá trị pháp lý</div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-blue-900">Chọn gói xét nghiệm ADN</h3>
                  {getSelectedTestType() ? (
                    <div className="grid grid-cols-1 gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="testType"
                          value={getSelectedTestType()!.id}
                          checked={formData.testType === getSelectedTestType()!.id}
                          onChange={(e) => handleInputChange("testType", e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                            formData.testType === getSelectedTestType()!.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-slate-700">{getSelectedTestType()!.name}</div>
                              <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  getSelectedTestType()!.category === "Dân sự" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                }`}>
                                  {getSelectedTestType()!.category}
                                </span>
                                <span>⏱️ {getSelectedTestType()!.time}</span>
                              </div>
                            </div>
                            <span className="font-semibold text-blue-900">{getSelectedTestType()!.price}</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
                      <p className="text-gray-500">Vui lòng chọn hình thức thu mẫu để xem các gói xét nghiệm có sẵn</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!validateStep1()}
                    className="px-8 py-3 text-white bg-blue-900 hover:bg-blue-800"
                  >
                    Tiếp Theo
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-blue-900">Thông tin liên hệ và đặt lịch</h3>

                {isLoadingUserInfo && (
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-center">
                      <div className="w-5 h-5 mr-2 border-2 border-blue-300 rounded-full border-t-blue-900 animate-spin" />
                      <p className="text-sm text-blue-800">Đang tự động điền thông tin của bạn...</p>
                    </div>
                  </div>
                )}

                {!isAuthenticated() && (
                  <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        <strong>Lưu ý:</strong> Bạn chưa đăng nhập. Để đặt lịch thành công, vui lòng đăng nhập trước khi tiếp tục.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <User className="w-4 h-4 mr-2" /> Họ và Tên *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <Phone className="w-4 h-4 mr-2" /> Số điện thoại *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        if (v.length <= 11) handleInputChange("phone", v);
                      }}
                      placeholder="Nhập số điện thoại"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <MapPin className="w-4 h-4 mr-2" />
                      {formData.serviceType === "home" ? "Địa chỉ nhận kit / Thu mẫu *" : "Địa chỉ thực hiện"}
                    </label>
                    {formData.serviceType === "home" ? (
                      <AddressSelector
                        value={formData.address}
                        onChange={(a) => handleInputChange("address", a)}
                        placeholder="Nhập địa chỉ nhận bộ kit ADN hoặc địa chỉ thu mẫu tại nhà"
                        required
                      />
                    ) : (
                      <div>
                        <Input
                          type="text"
                          value={formData.address}
                          readOnly
                          disabled
                          className="w-full"
                        />
                        <p className="mt-1 text-xs text-blue-600">
                          <strong>Lưu ý:</strong> Bạn sẽ đến trung tâm để thực hiện xét nghiệm
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <Calendar className="w-4 h-4 mr-2" /> Ngày hẹn gặp *
                    </label>
                    <Input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <Clock className="w-4 h-4 mr-2" /> Thời gian mong muốn *
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Chọn thời gian</option>
                      {getAvailableTimeSlots().map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-blue-900">
                      <AlertCircle className="w-4 h-4 mr-2" /> Lưu ý thêm
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Ví dụ: Cần xét nghiệm cha con, mẹ con... hoặc yêu cầu đặc biệt khác"
                      className="w-full h-24 p-3 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {apiError && (
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                      <p className="text-sm text-red-800">{apiError}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} className="px-6 py-3 text-gray-700 border-gray-300 hover:bg-gray-50">
                    Quay Lại
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!validateStep2() || loading}
                    className="px-8 py-3 text-white bg-blue-900 hover:bg-blue-800"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="w-5 h-5 mr-2 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                        Đang xử lý...
                      </span>
                    ) : (
                      "Xác Nhận Đặt Lịch"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="py-8 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="mb-2 text-2xl font-bold text-green-600">Đăng ký thành công!</h3>
                <p className="mb-6 text-slate-600">
                  Chúng tôi đã nhận được yêu cầu xét nghiệm ADN của bạn. Nhân viên tư vấn sẽ liên hệ với bạn trong vòng 30 phút để xác nhận và hướng dẫn chi tiết.
                </p>
                <div className="p-4 mb-6 rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-800">
                    <strong>Mã đăng ký:</strong>{" "}
                    {bookingResponse?.data?.bookingId ?? (bookingResponse as { id?: string })?.id ?? `ADN${Date.now().toString().slice(-6)}`}
                  </p>
                  <p className="mt-1 text-sm text-blue-800">
                    <strong>Thời gian:</strong> {formData.preferredDate} lúc {formData.preferredTime}
                  </p>
                  <p className="mt-1 text-sm text-blue-800">
                    <strong>Khách hàng:</strong> {formData.name}
                  </p>
                  <p className="mt-1 text-sm text-blue-800">
                    <strong>Số điện thoại:</strong> {formData.phone}
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  className="px-8 py-3 text-white bg-blue-900 hover:bg-blue-800"
                >
                  Đóng
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
