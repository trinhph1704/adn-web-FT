import api from "./client";

export interface LoginResponse {
  token: string;
  userName: string;
  role: string;
  userId: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export const loginApi = async (email: string, password: string) => {
  const response = await api.post<ApiResponse<LoginResponse>>("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const getUserInfoApi = async (token?: string) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await api.get<ApiResponse<{ id: string; fullName: string; email: string; role: string }>>(
    "/api/user/me",
    headers ? { headers } : undefined
  );
  return response.data.data;
};

export interface RegisterUser {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role?: number;
}

export const registerApi = async (userData: RegisterUser) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/api/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (
  email: string,
  otpCode: string,
  newPassword: string
) => {
  const response = await api.post("/api/auth/reset-password", {
    email,
    otpCode,
    newPassword,
  });
  return response.data;
};
