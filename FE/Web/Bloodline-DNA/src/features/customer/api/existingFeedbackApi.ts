import type { AxiosError } from "axios";
import axios from "axios";

// Base API URL
const API_BASE_URL = "https://api.adntester.duckdns.org/api";

// Function để lấy auth token
const getAuthToken = (): string | null => {
  return (
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    null
  );
};

// Interface cho User Feedback response
export interface UserFeedback {
  id: string;
  userId: string;
  testServiceId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Interface cho API response
export interface FeedbackApiResponse {
  success: boolean;
  data?: UserFeedback[] | UserFeedback;
  message: string;
  statusCode?: number;
}

// Function để lấy tất cả feedback của user
export const getUserFeedbacksApi = async (
  userId: string
): Promise<FeedbackApiResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please login to get feedbacks.");
  }

  try {
    console.log(`🔄 Getting feedbacks for user: ${userId}`);
    
    const res = await axios.get(
      `${API_BASE_URL}/Feedback/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ User feedbacks retrieved successfully:`, res.data);
    return res.data as FeedbackApiResponse;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    // Handle 4xx/5xx errors
    if (error.response) {
      const { status, data } = error.response;
      const msg = data?.message || "Unknown error";

      switch (status) {
        case 401:
          throw new Error("Unauthorized: Please login to continue.");
        case 403:
          throw new Error("Access denied: You do not have permission to get feedbacks.");
        case 404:
          throw new Error("No feedbacks found for this user.");
        case 400:
          throw new Error(`Invalid request: ${msg}`);
        default:
          throw new Error(`HTTP ${status}: ${msg}`);
      }
    }

    // Network/timeout errors
    console.error(`❌ Error getting user feedbacks:`, error);
    throw new Error(error.message || "Network error");
  }
};

// Function để lấy chi tiết feedback theo ID
export const getFeedbackByIdApi = async (
  feedbackId: string
): Promise<FeedbackApiResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please login to get feedback details.");
  }

  try {
    console.log(`🔄 Getting feedback details for ID: ${feedbackId}`);
    
    const res = await axios.get(
      `${API_BASE_URL}/Feedback/${feedbackId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Feedback details retrieved successfully:`, res.data);
    return res.data as FeedbackApiResponse;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    // Handle 4xx/5xx errors
    if (error.response) {
      const { status, data } = error.response;
      const msg = data?.message || "Unknown error";

      switch (status) {
        case 401:
          throw new Error("Unauthorized: Please login to continue.");
        case 403:
          throw new Error("Access denied: You do not have permission to get feedback details.");
        case 404:
          throw new Error("Feedback not found.");
        case 400:
          throw new Error(`Invalid request: ${msg}`);
        default:
          throw new Error(`HTTP ${status}: ${msg}`);
      }
    }

    // Network/timeout errors
    console.error(`❌ Error getting feedback details:`, error);
    throw new Error(error.message || "Network error");
  }
}; 