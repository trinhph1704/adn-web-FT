/**
 * TypeScript Types cho Bloodline-DNA NextJS
 * Mapping từ .NET Entities
 */

// ==================== ENUMS ====================

export type UserRole = 'customer' | 'staff' | 'manager' | 'admin';

export type BookingStatus = 
  | 'pending'           // Chờ xác nhận
  | 'confirmed'         // Đã xác nhận
  | 'sample_collected'  // Đã thu mẫu
  | 'testing'           // Đang xét nghiệm
  | 'completed'         // Hoàn thành
  | 'cancelled';        // Đã hủy

export type TestServiceType = 'civil' | 'legal';

export type SampleCollectionMethod = 'home' | 'clinic';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type BlogStatus = 'draft' | 'published' | 'archived';

// ==================== BASE ENTITY ====================

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== USER ====================

export interface User extends BaseEntity {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
}

export interface CreateUserDTO {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

// ==================== TEST SERVICE ====================

export interface TestService extends BaseEntity {
  name: string;
  description: string;
  type: TestServiceType;
  sampleCount: number;
  isActive: boolean;
}

export interface ServicePrice extends BaseEntity {
  serviceId: string;
  price: number;
  collectionMethod: SampleCollectionMethod;
  currency: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  isActive: boolean;
  // Populated field
  testService?: TestService;
}

// ==================== BOOKING ====================

export interface TestBooking extends BaseEntity {
  clientId: string;
  serviceId: string;
  priceId: string;
  clientName: string;
  phone: string;
  address: string;
  appointmentDate: Date;
  collectionMethod: SampleCollectionMethod;
  status: BookingStatus;
  price: number;
  note?: string;
  // Populated fields
  client?: User;
  service?: TestService;
}

export interface CreateBookingDTO {
  serviceId: string;
  priceId: string;
  clientName: string;
  phone: string;
  address: string;
  appointmentDate: Date;
  note?: string;
}

export interface UpdateBookingDTO {
  status?: BookingStatus;
  appointmentDate?: Date;
  note?: string;
  address?: string;
}

// ==================== TEST RESULT ====================

export interface TestResult extends BaseEntity {
  bookingId: string;
  staffId: string;
  resultData: Record<string, unknown>;
  conclusion: string;
  status: 'pending' | 'completed';
  pdfUrl?: string;
  // Populated fields
  booking?: TestBooking;
  staff?: User;
}

export interface CreateTestResultDTO {
  bookingId: string;
  resultData: Record<string, unknown>;
  conclusion: string;
}

// ==================== PAYMENT ====================

export interface Payment extends BaseEntity {
  bookingId: string;
  amount: number;
  method: string;
  transactionId: string;
  status: PaymentStatus;
  paymentUrl?: string;
  // Populated fields
  booking?: TestBooking;
}

export interface CreatePaymentDTO {
  bookingId: string;
  amount: number;
  method: string;
}

// ==================== BLOG ====================

export interface Blog extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  thumbnail?: string;
  status: BlogStatus;
  slug: string;
  viewCount: number;
  // Populated fields
  author?: User;
}

export interface CreateBlogDTO {
  title: string;
  content: string;
  tags?: string[];
  thumbnail?: string;
  status?: BlogStatus;
}

export interface UpdateBlogDTO {
  title?: string;
  content?: string;
  tags?: string[];
  thumbnail?: string;
  status?: BlogStatus;
}

// ==================== FEEDBACK ====================

export interface Feedback extends BaseEntity {
  userId: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  // Populated fields
  user?: User;
  booking?: TestBooking;
}

export interface CreateFeedbackDTO {
  bookingId: string;
  rating: number;
  comment: string;
}

// ==================== API RESPONSE ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== AUTH ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

