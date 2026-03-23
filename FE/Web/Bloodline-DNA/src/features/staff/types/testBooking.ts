export interface TestBookingResponse {
  id: string;
  testServiceId: string;
  clientId: string;
  clientName: string;
  email: string;
  appointmentDate: string;
  price: number;
  collectionMethod: string;
  status: string; // Sử dụng const enum
  note: string;
  createdAt: string;
  updatedAt: string;
  kitId?: string;
}

export interface TestBookingResponseStaff {
  id: string;
  testServiceId: string;
  clientId: string;
  clientName: string;
  email: string;
  address: string;
  appointmentDate: string;
  price: number;
  collectionMethod: string;
  status: string; // Sử dụng const enum
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestBookingStatusRequest {
  bookingId: string;
  status: number;
}

export interface CalendarProps {
  bookingsByDate?: Record<string, number>;
  events: TestBookingResponse[];
  onUpdateStatus?: (updatedBooking: TestBookingResponse) => void;
}

export function renderCollectionMethod(method: string) {
  switch (method) {
    case "0":
      return "Tự lấy mẫu";
    case "1":
      return "Tại cơ sở";
    default:
      return "Không rõ";
  }
}
