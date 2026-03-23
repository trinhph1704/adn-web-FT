import api from "./client";

export interface CreateBookingRequest {
  testServiceId: string;
  priceServiceId: string;
  collectionMethod: number;
  clientId?: string;
  appointmentDate: string;
  note: string;
  clientName: string;
  address: string;
  phone: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export const createBookingApi = async (data: CreateBookingRequest) => {
  const response = await api.post<ApiResponse<{ bookingId: string }>>("/api/bookings", data);
  return response.data;
};

export const getBookingsApi = async (params?: { userId?: string; status?: number }) => {
  const searchParams = new URLSearchParams();
  if (params?.userId) searchParams.set("userId", params.userId);
  if (params?.status !== undefined) searchParams.set("status", String(params.status));
  const query = searchParams.toString();
  const url = query ? `/api/bookings?${query}` : "/api/bookings";
  const response = await api.get<ApiResponse<unknown[]>>(url);
  return response.data.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get<ApiResponse<unknown>>(`/api/bookings/${id}`);
  return response.data.data;
};

export const updateBookingApi = async (id: string, data: Partial<CreateBookingRequest>) => {
  const response = await api.put<ApiResponse<unknown>>(`/api/bookings/${id}`, data);
  return response.data;
};

export interface BookingFormData {
  serviceType: "home" | "clinic";
  name: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  testType: string;
}

export interface SelectedServiceForBooking {
  id: string;
  serviceId?: string;
  name?: string;
  category?: string;
  price?: number;
  collectionMethod?: number;
  testServiceInfor?: { id: string; [key: string]: unknown };
  testServiceInfo?: { id: string; [key: string]: unknown };
}

export function mapFormDataToBookingRequest(
  formData: BookingFormData,
  selectedService: SelectedServiceForBooking
): CreateBookingRequest {
  if (!formData.preferredDate || !formData.preferredTime) {
    throw new Error("Vui lòng chọn ngày và giờ hẹn.");
  }
  if (!formData.name?.trim() || !formData.phone?.trim()) {
    throw new Error("Vui lòng điền đầy đủ họ tên và số điện thoại.");
  }
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
    throw new Error("Số điện thoại không hợp lệ (10-15 chữ số).");
  }
  if (formData.name.trim().length < 2) {
    throw new Error("Họ tên phải có ít nhất 2 ký tự.");
  }

  const dateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}:00`);
  if (isNaN(dateTime.getTime())) {
    throw new Error("Định dạng ngày/giờ không hợp lệ.");
  }
  if (dateTime <= new Date()) {
    throw new Error("Ngày hẹn phải là ngày trong tương lai.");
  }

  const testServiceId =
    selectedService.serviceId ||
    selectedService.testServiceInfor?.id ||
    selectedService.testServiceInfo?.id;
  const priceServiceId = selectedService.id;

  if (!testServiceId || !priceServiceId) {
    throw new Error("Thông tin dịch vụ không hợp lệ. Vui lòng chọn lại.");
  }

  const collectionMethod =
    selectedService.collectionMethod ?? (formData.serviceType === "clinic" ? 1 : 0);

  return {
    testServiceId,
    priceServiceId,
    collectionMethod,
    appointmentDate: dateTime.toISOString(),
    note: (formData.notes || "").trim(),
    clientName: formData.name.trim(),
    address: (formData.address || "").trim(),
    phone: formData.phone.replace(/\s/g, ""),
  };
}
