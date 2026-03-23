export interface Login {
  email: string;
  password: string;
}

export interface RegisterUser {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;  // Giờ này sẽ là number
  address: string;
}

// Sử dụng const assertion thay vì enum
export const UserRole = {
  Admin: 0,
  Staff: 1,
  Client: 2,
  Manager: 3
} as const;

// Type cho UserRole values
export type UserRole = typeof UserRole[keyof typeof UserRole]; // 0 | 1 | 2 | 3

// Reverse mapping để convert từ number về string (optional)
export const UserRoleNames = {
  0: 'Admin',
  1: 'Staff',
  2: 'Client',
  3: 'Manager'
} as const;

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  email: string;
  otpCode: string;
  newPassword: string;
}