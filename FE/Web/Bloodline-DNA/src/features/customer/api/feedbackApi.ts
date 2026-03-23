import axios from "axios";
import { BASE_URL } from "../../../apis/rootApi";

// Interface for the feedback submission payload
export interface FeedbackPayload {
  userId: string;
  testServiceId: string; // This corresponds to bookingId
  rating: number;
  comment: string;
}

// Interface for the API response (can be expanded as needed)
export interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Submits customer feedback to the server.
 * @param payload - The feedback data to be submitted.
 * @returns A promise that resolves to the server's response.
 */
export const submitFeedbackApi = async (
  payload: FeedbackPayload
): Promise<FeedbackResponse> => {
  try {
    // Validate required fields
    if (!payload.userId) throw new Error("User ID is required.");
    if (!payload.testServiceId)
      throw new Error("Test Service ID (Booking ID) is required.");
    if (payload.rating < 1 || payload.rating > 5)
      throw new Error("Rating must be between 1 and 5.");
    if (!payload.comment) throw new Error("Comment is required.");

    // Get token from storage
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      throw new Error("Yêu cầu xác thực. Vui lòng đăng nhập lại.");
    }

    console.log("🚀 Submitting feedback:", payload);

    const endpoint = `${BASE_URL}/Feedback`;

    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Feedback submission response:", response.data);

    // Assuming the API returns a standard success/message format
    return {
      success: true,
      message: response.data.message || "Gửi đánh giá thành công!",
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Feedback submission error:", error);

    let errorMessage = "Không thể gửi đánh giá. Vui lòng thử lại.";
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.title) {
        // For ASP.NET Core validation errors
        errorMessage = responseData.title;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
