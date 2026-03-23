import axios from "axios";
import { BASE_URL } from "../../../apis/rootApi";

export interface RegisterUser {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: number;
}

export const registerApi = async (userData: RegisterUser) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Trích xuất thông báo lỗi từ backend nếu có
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      throw new Error(serverMessage);
    } else {
      // Lỗi không phải từ Axios
      throw new Error("Lỗi không xác định khi đăng ký.");
    }
  }
};