// ============================================
// ENUMS - Based on BE ADNTester.BO.Enums
// ============================================

export enum UserRole {
  Admin = 0,
  Staff = 1,
  Client = 2,
  Manager = 3
}

export enum BookingStatus {
  Pending = 0,              // Chờ xử lý
  PreparingKit = 1,         // Chuẩn bị kit test
  DeliveringKit = 2,        // Đang giao kit
  KitDelivered = 3,         // Đã giao kit
  WaitingForSample = 4,     // Chờ lấy mẫu
  ReturningSample = 5,      // Đang trả mẫu
  SampleReceived = 6,       // Đã nhận mẫu
  Testing = 7,              // Đang xét nghiệm
  Completed = 8,            // Hoàn thành
  Cancelled = 9,            // Đã hủy
  StaffGettingSample = 10,  // Staff lấy mẫu
  CheckIn = 11              // Check-in
}

export enum TestServiceType {
  Civil = 0,   // Dân sự
  Legal = 1    // Hành chính/Pháp lý
}

export enum SampleCollectionMethod {
  SelfSample = 0,   // Tự lấy mẫu
  AtFacility = 1    // Lấy mẫu tại cơ sở
}

export enum SampleType {
  Unknown = 0,
  BuccalSwab = 1,    // Tăm bông miệng
  Blood = 2,         // Máu
  HairWithRoot = 3,  // Tóc có chân
  Fingernail = 4,    // Móng tay
  Saliva = 5,        // Nước bọt
  Other = 99
}

export enum PaymentStatus {
  Pending = 0,    // Chưa thanh toán
  Deposited = 1,  // Đã đặt cọc
  Paid = 2,       // Đã thanh toán
  Failed = 3,     // Thất bại
  Refunded = 4,   // Đã hoàn tiền
  Cancelled = 5   // Đã hủy
}

export enum RelationshipToSubject {
  Father = 0,
  Mother = 1,
  Child = 2,
  Sibling = 3,
  Grandparent = 4,
  Other = 99
}

export enum LogisticStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Failed = 3
}

// ============================================
// INTERFACES - Based on BE ADNTester.BO.Entities
// ============================================

// Base Entity
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

// User
export interface User extends BaseEntity {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  passwordHash?: string;  // Not exposed to client
  role: UserRole;
  isActive: boolean;
}

// Test Service
export interface TestService extends BaseEntity {
  name: string;
  description: string;
  sampleCount: number;
  type: TestServiceType;
  isActive: boolean;
  prices?: ServicePrice[];
}

// Service Price
export interface ServicePrice extends BaseEntity {
  serviceId: string;
  price: number;
  collectionMethod: SampleCollectionMethod;
  effectiveFrom: Date;
  effectiveTo?: Date;
  testServiceInfo?: TestService;
}

// Test Booking
export interface TestBooking extends BaseEntity {
  clientId: string;
  client?: User;
  testServiceId: string;
  testService?: TestService;
  price: number;
  collectionMethod: SampleCollectionMethod;
  status: BookingStatus;
  appointmentDate: Date;
  note?: string;
  clientName?: string;
  address?: string;
  phone?: string;
  kit?: TestKit;
  testResult?: TestResult;
}

// Test Kit
export interface TestKit extends BaseEntity {
  bookingId: string;
  booking?: TestBooking;
  collectionMethod: SampleCollectionMethod;
  deliveryInfoId?: string;
  deliveryInfo?: LogisticsInfo;
  pickupInfoId?: string;
  pickupInfo?: LogisticsInfo;
  sentToLabAt?: Date;
  labReceivedAt?: Date;
  sampleCount: number;
  note?: string;
  samples?: TestSample[];
}

// Test Sample
export interface TestSample extends BaseEntity {
  kitId: string;
  kit?: TestKit;
  sampleCode: string;
  donorName: string;
  relationshipToSubject: RelationshipToSubject;
  sampleType: SampleType;
  collectedById?: string;
  collector?: User;
  collectedAt?: Date;
  labReceivedAt?: Date;
}

// Test Result
export interface TestResult extends BaseEntity {
  testBookingId: string;
  testBooking?: TestBooking;
  resultSummary: string;
  resultDate: Date;
  resultFileUrl: string;
}

// Payment
export interface Payment extends BaseEntity {
  orderCode: number;
  amount: number;
  depositAmount?: number;
  remainingAmount?: number;
  status: PaymentStatus;
  paidAt?: Date;
  description?: string;
  bookingId: string;
  booking?: TestBooking;
}

// Logistics Info
export interface LogisticsInfo extends BaseEntity {
  address: string;
  phone: string;
  status: LogisticStatus;
  scheduledAt?: Date;
  completedAt?: Date;
  note?: string;
}

// Blog & Tags
export interface Blog extends BaseEntity {
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  authorId: string;
  author?: User;
  isPublished: boolean;
  publishedAt?: Date;
  tags?: Tag[];
}

export interface Tag extends BaseEntity {
  name: string;
  slug: string;
}

// Feedback
export interface Feedback extends BaseEntity {
  userId: string;
  user?: User;
  bookingId?: string;
  booking?: TestBooking;
  rating: number;
  comment: string;
  isPublished: boolean;
}

// Sample Type Instruction
export interface SampleTypeInstruction extends BaseEntity {
  sampleType: SampleType;
  title: string;
  instructions: string;
  videoUrl?: string;
  imageUrls?: string[];
}

// ============================================
// DTOs - Data Transfer Objects
// ============================================

// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userName: string;
  role: string;
  userId: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  role?: UserRole;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

// Service DTOs
export interface CreateTestServiceDto {
  name: string;
  description: string;
  sampleCount: number;
  type: TestServiceType;
  prices: CreateServicePriceDto[];
}

export interface CreateServicePriceDto {
  price: number;
  collectionMethod: SampleCollectionMethod;
}

export interface UpdateTestServiceDto {
  id: string;
  name?: string;
  description?: string;
  sampleCount?: number;
  type?: TestServiceType;
  isActive?: boolean;
}

// Booking DTOs
export interface CreateTestBookingDto {
  testServiceId: string;
  priceServiceId: string;
  collectionMethod: SampleCollectionMethod;
  appointmentDate: Date;
  note?: string;
  clientName: string;
  address?: string;
  phone: string;
}

export interface UpdateTestBookingDto {
  id: string;
  appointmentDate?: Date;
  note?: string;
  status?: BookingStatus;
}

// Sample DTOs
export interface CreateTestSampleDto {
  kitId: string;
  donorName: string;
  relationshipToSubject: RelationshipToSubject;
  sampleType: SampleType;
}

export interface UpdateTestSampleDto {
  id: string;
  sampleType?: SampleType;
  collectedAt?: Date;
}

// Result DTOs
export interface CreateTestResultDto {
  testBookingId: string;
  resultSummary: string;
  resultFileUrl: string;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

// Pagination
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// UTILITY TYPES
// ============================================

// Status Labels (Vietnamese)
export const BookingStatusLabels: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: 'Chờ xử lý',
  [BookingStatus.PreparingKit]: 'Chuẩn bị kit',
  [BookingStatus.DeliveringKit]: 'Đang giao kit',
  [BookingStatus.KitDelivered]: 'Đã giao kit',
  [BookingStatus.WaitingForSample]: 'Chờ lấy mẫu',
  [BookingStatus.ReturningSample]: 'Đang trả mẫu',
  [BookingStatus.SampleReceived]: 'Đã nhận mẫu',
  [BookingStatus.Testing]: 'Đang xét nghiệm',
  [BookingStatus.Completed]: 'Hoàn thành',
  [BookingStatus.Cancelled]: 'Đã hủy',
  [BookingStatus.StaffGettingSample]: 'Staff lấy mẫu',
  [BookingStatus.CheckIn]: 'Check-in'
};

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.Admin]: 'Quản trị viên',
  [UserRole.Staff]: 'Nhân viên',
  [UserRole.Client]: 'Khách hàng',
  [UserRole.Manager]: 'Quản lý'
};

export const SampleTypeLabels: Record<SampleType, string> = {
  [SampleType.Unknown]: 'Chưa xác định',
  [SampleType.BuccalSwab]: 'Tăm bông miệng',
  [SampleType.Blood]: 'Máu',
  [SampleType.HairWithRoot]: 'Tóc có chân',
  [SampleType.Fingernail]: 'Móng tay',
  [SampleType.Saliva]: 'Nước bọt',
  [SampleType.Other]: 'Khác'
};

export const TestServiceTypeLabels: Record<TestServiceType, string> = {
  [TestServiceType.Civil]: 'Dân sự',
  [TestServiceType.Legal]: 'Hành chính'
};

export const CollectionMethodLabels: Record<SampleCollectionMethod, string> = {
  [SampleCollectionMethod.SelfSample]: 'Tự lấy mẫu',
  [SampleCollectionMethod.AtFacility]: 'Lấy mẫu tại cơ sở'
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: 'Chờ thanh toán',
  [PaymentStatus.Deposited]: 'Đã đặt cọc',
  [PaymentStatus.Paid]: 'Đã thanh toán',
  [PaymentStatus.Failed]: 'Thất bại',
  [PaymentStatus.Refunded]: 'Đã hoàn tiền',
  [PaymentStatus.Cancelled]: 'Đã hủy'
};

// Format helpers
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

