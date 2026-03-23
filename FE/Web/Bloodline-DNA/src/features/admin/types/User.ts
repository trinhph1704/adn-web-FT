export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
}

export interface UserRequest {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: number;
}

