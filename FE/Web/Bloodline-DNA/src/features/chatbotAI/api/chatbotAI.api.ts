import axios from "axios";
// src/apis/chatbotApi.ts
export const CHATBOTAI_URL = "http://localhost:3000/api";
/**
 * Gửi tin nhắn đến Gemini và lấy phản hồi
 */
interface GeminiErrorResponse {
  error?: string;
}

export const sendMessage = async (message: string, userId?: string) => {
  try {
    const response = await axios.post(
      `${CHATBOTAI_URL}/chatbotAI/chat`,
      { message, userId },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverMessage =
        (err.response?.data as GeminiErrorResponse)?.error ||
        "Lỗi không xác định từ server";
      throw new Error(serverMessage);
    }
    throw new Error("Đã xảy ra lỗi không mong muốn");
  }
};

/**
 * Lấy lịch sử chat
 */
export const getChatHistory = async (userId?: string) => {
  try {
    const response = await axios.get(`${CHATBOTAI_URL}/chatbotAI/history`, {
      params: userId ? { userId } : {},
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.error || "Lỗi không xác định từ server";
      throw new Error(serverMessage);
    }
    throw new Error("Đã xảy ra lỗi không mong muốn");
  }
};
