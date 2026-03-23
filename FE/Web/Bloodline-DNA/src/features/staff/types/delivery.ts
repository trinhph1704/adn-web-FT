export const statusColorMap: Record<string, string> = {
  PreparingKit: "orange",
  DeliveringKit: "blue",
  KitDelivered: "green",
  WaitingForPickup: "gold",
  ReturningSample: "gold",
  PickingUpSample: "purple",
  SampleReceived: "cyan",
  Testing: "cyan",
  Cancelled: "red",
};

export const statusTextMap: Record<string, string> = {
  PreparingKit: "Đang chuẩn bị bộ Kit",
  DeliveringKit: "Đang giao bộ Kit",
  KitDelivered: "Đã nhận Kit",
  WaitingForPickup: "Đợi đến lấy mẫu",
  PickingUpSample: "Đang lấy mẫu",
  SampleReceived: "Đã nhận mẫu",
  Testing: "Đang xét nghiệm",
  Cancelled: "Đã hủy",
};

export type DeliveryStatus =
  | "PreparingKit"
  | "DeliveringKit"
  | "KitDelivered"
  | "WaitingForPickup"
  | "PickingUpSample"
  | "SampleReceived"
  | "Cancelled";

  export const statusMapNumberToKey: Record<number, DeliveryStatus> = {
  0: "PreparingKit",
  1: "DeliveringKit",
  2: "KitDelivered",
  3: "WaitingForPickup",
  4: "PickingUpSample",
  5: "SampleReceived",
  6: "Cancelled",
};
export interface DeliveryLogistic {
  id: string;
  staffId: string | null;
  staff: { fullName?: string } | null;
  address: string;
  phone: string;
  scheduledAt: string;
  completedAt: string | null;
  note: string;
  imageUrl?: string;
  type: number;
  status: string;
}
export interface DeliveryOrder {
  id: string;
  staffId: string | null;
  staff: { fullName?: string } | null;
  name: string;
  address: string;
  phone: string;
  scheduledAt: string;
  completeAt: string | null;
  note: string;
  type: number;
  imageUrl?: string;
  status: DeliveryStatus;
}
export interface TestBookingStatusRequest {
  bookingId: string;
  status: number;
}