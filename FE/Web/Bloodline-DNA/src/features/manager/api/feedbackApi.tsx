import rootApi from "../../../apis/rootApi";
import type { FeedbackResponse } from "../types/feedback";

// GET: Lấy danh sách feedback
export const getFeedbacksApi = async (): Promise<FeedbackResponse[]> => {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      // rootApi sẽ tự động thêm Authorization header thông qua interceptor
      const response = await rootApi.get<{ data: FeedbackResponse[] }>("/Feedback");
      if (!response.data?.data) {
        throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
      }
      return response.data.data;
    } catch (error) {
      attempts++;
      const errorDetails = {
        message: error instanceof Error ? error.message : "Unknown error",
        response: error instanceof Error && "response" in error ? (error as any).response?.data : undefined,
        status: error instanceof Error && "response" in error ? (error as any).response?.status : undefined,
      };
      console.error("getTestsApi error:", errorDetails);
      if (attempts >= maxRetries) {
        throw new Error(error instanceof Error ? `Failed to get tests: ${error.message}` : "Failed to get tests: Unknown error");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed to get tests after retries");
};