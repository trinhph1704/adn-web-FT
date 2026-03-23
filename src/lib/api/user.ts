import api from "./client";

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
}

export const getCurrentUserProfileApi = async (): Promise<UserProfile> => {
  const response = await api.get<ApiResponse<UserProfile>>("/api/user/me");
  return response.data.data;
};

export const updateUserProfileApi = async (data: {
  fullName?: string;
  phone?: string;
  address?: string;
}) => {
  const response = await api.put<ApiResponse<{ success: boolean }>>("/api/user/me", data);
  return response.data;
};

export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export const getAllUsersApi = async (): Promise<UserListItem[]> => {
  const response = await api.get<ApiResponse<UserListItem[]>>("/api/user");
  return response.data.data;
};
