export type DeliveryStatus =
  | "PreparingKit"
  | "DeliveringKit"
  | "KitDelivered"
  | "WaitingForPickup"
  | "PickingUpSample"
  | "SampleReceived"
  | "Cancelled";
export interface DeliveryLogistic {
  id: string;
  name: string;
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
  staff: string;
  name: string;
  address: string;
  phone: string;
  scheduleAt: string;
  completeAt: string | null;
  note: string;
  imageUrl?: string;
  status: DeliveryStatus;
}
export interface RawStaffResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  address: string;
}
export interface ActiveStaff {
  id: string;
  fullName: string;
  email: string;
}