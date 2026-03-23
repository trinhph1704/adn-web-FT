import axios from "axios";
import { BASE_URL } from "../../../apis/rootApi";

// User interface matching API response
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

export const getUserInfoApi = async (): Promise<User> => {
  try {
    // Try multiple token sources
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  sessionStorage.getItem('token') ||
                  sessionStorage.getItem('authToken') ||
                  // Fallback token for testing
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjI2MDNCN0Q2OUFFMTgxNzAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibGFsYWxhbGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsYTEyQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNsaWVudCIsImp0aSI6IjBkZjM5ZTEwLTRhNTktNDFlMC1hZGIzLTE4OWM1Mjg1Mjg3MCIsImV4cCI6MTc1MDIyNDgwNSwiaXNzIjoieW91cmRvbWFpbi5jb20iLCJhdWQiOiJ5b3VyZG9tYWluLmNvbSJ9.6ucR2Zmu8Ti5hyUUxVmMfytX37uAkfQ86LsKcDtwV-0';

    const response = await axios.get(`${BASE_URL}/user/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    // Handle response structure - similar to blogAPI
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // If direct user object
    if (response.data && response.data.fullName) {
      return response.data;
    }
    
    throw new Error("Dữ liệu không hợp lệ");
  } catch (error: unknown) {
    console.error("Error fetching user info:", error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      // Handle specific error cases
      if (status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
      } else if (status === 403) {
        throw new Error("Không có quyền truy cập thông tin này");
      } else if (status === 404) {
        throw new Error("Không tìm thấy thông tin người dùng");
      } else if (status === 500) {
        throw new Error("Lỗi server. Vui lòng thử lại sau");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    throw new Error("Không thể tải thông tin người dùng");
  }
};

// Update user data interface
export interface UpdateUserData {
  fullName: string;
  phone: string;
  address: string;
}

// Update user API function
export const updateUserInfoApi = async (userData: UpdateUserData): Promise<User> => {
  try {
    // Try multiple token sources
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  sessionStorage.getItem('token') ||
                  sessionStorage.getItem('authToken') ||
                  // Fallback token for testing
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjI2MDNCN0Q2OUFFMTgxNzAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibGFsYWxhbGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsYTEyQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNsaWVudCIsImp0aSI6IjBkZjM5ZTEwLTRhNTktNDFlMC1hZGIzLTE4OWM1Mjg1Mjg3MCIsImV4cCI6MTc1MDIyNDgwNSwiaXNzIjoieW91cmRvbWFpbi5jb20iLCJhdWQiOiJ5b3VyZG9tYWluLmNvbSJ9.6ucR2Zmu8Ti5hyUUxVmMfytX37uAkfQ86LsKcDtwV-0';

    const response = await axios.put(`${BASE_URL}/user/me`, userData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    // Handle response structure - similar to get API
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // If direct user object
    if (response.data && response.data.fullName) {
      return response.data;
    }
    
    throw new Error("Dữ liệu cập nhật không hợp lệ");
  } catch (error: unknown) {
    console.error("Error updating user info:", error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      // Handle specific error cases
      if (status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
      } else if (status === 403) {
        throw new Error("Không có quyền cập nhật thông tin này");
      } else if (status === 404) {
        throw new Error("Không tìm thấy thông tin người dùng");
      } else if (status === 400) {
        throw new Error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại");
      } else if (status === 500) {
        throw new Error("Lỗi server. Vui lòng thử lại sau");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    throw new Error("Không thể cập nhật thông tin người dùng");
  }
};

// Mock user data for fallback
export const getMockUserData = (): User => {
  return {
    id: "mock-user-id",
    fullName: "Người dùng mẫu",
    email: "user@example.com",
    phone: "0123456789",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    role: "Client"
  };
}; 