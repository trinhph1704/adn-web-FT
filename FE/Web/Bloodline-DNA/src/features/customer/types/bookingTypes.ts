export type DetailedBookingStatus =
  | 'Pending'
  | 'PreparingKit'
  | 'DeliveringKit'
  | 'KitDelivered'
  | 'WaitingForSample'
  | 'ReturningSample'
  | 'SampleReceived'
  | 'Testing'
  | 'Completed'
  | 'Cancelled'
  | 'StaffGettingSample'
  | 'CheckIn';


export interface BookingDetail {
  id: string;
  testType: string;
  serviceType: 'home' | 'clinic';
  name: string;
  phone: string;
  email: string;
  address?: string;
  preferredDate: string;
  preferredTime: string;
  status: DetailedBookingStatus;
  notes?: string;
  bookingDate: string;
  price: string;
  totalPrice: string;
  appointmentCode: string;
  priceNumeric?: number;
  collectionMethod?: string;
}

export interface ProgressStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'pending';
  completedDate?: string;
  estimatedDate?: string;
  details?: string[];
  actionRequired?: boolean;
  actionText?: string;
  actionPayload?: any;
}

export interface TestProgressData {
  bookingId: string;
  testType: string;
  serviceType: 'home' | 'clinic';
  customerName: string;
  currentStep: number;
  steps: ProgressStep[];
  trackingNumber?: string;
  expectedResultDate?: string;
}

export interface BookingItem {
  id: string;
  testServiceId?: string;
  appointmentDate: string;
  collectionMethod?: string;
  clientName: string;
  phone: string;
  email: string;
  address?: string;
  status: string;
  note?: string;
  createdAt: string;
  price: number;
}