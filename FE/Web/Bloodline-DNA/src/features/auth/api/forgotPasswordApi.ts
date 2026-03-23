import axios from "axios";
import { BASE_URL } from "../../../apis/rootApi";

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/request-reset`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { success, data, message } = response.data;

    // Nếu success là true nhưng data là chuỗi báo lỗi
    if (
      !success ||
      (typeof data === "string" && data.includes("Không tìm thấy"))
    ) {
      throw new Error(data || message || "Không thể gửi yêu cầu");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.data ||
        "Lỗi không xác định từ server";
      throw new Error(serverMessage);
    }
    throw new Error("Đã xảy ra lỗi không mong muốn");
  }
};

export const resetPassword = async (
  email: string,
  otpCode: string,
  newPassword: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/reset-password`,
      { email, otpCode, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Lỗi không xác định từ server";
      throw new Error(serverMessage);
    }
    throw new Error("Đã xảy ra lỗi không mong muốn");
  }
};