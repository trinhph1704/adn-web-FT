import axios from "axios";
import { BASE_URL } from "../../../apis/rootApi";
import { paymentLogger } from "../utils/paymentLogger";

// ===== INTERFACES =====
export interface CheckoutRequest {
  bookingId: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  paymentUrl?: string;
  orderId?: string;
  amount?: number;
  [key: string]: any;
}

// ===== API FUNCTIONS =====
export const checkoutPaymentApi = async (
  bookingId: string
): Promise<CheckoutResponse> => {
  try {
    // Validate input
    if (!bookingId || bookingId.trim() === "") {
      throw new Error("Booking ID không hợp lệ");
    }

    // Get token from multiple sources
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      // Fallback token for testing
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjI2MDNCN0Q2OUFFMTgxNzAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibGFsYWxhbGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsYTEyQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNsaWVudCIsImp0aSI6IjBkZjM5ZTEwLTRhNTktNDFlMC1hZGIzLTE4OWM1Mjg1Mjg3MCIsImV4cCI6MTc1MDIyNDgwNSwiaXNzIjoieW91cmRvbWFpbi5jb20iLCJhdWQiOiJ5b3VyZG9tYWluLmNvbSJ9.6ucR2Zmu8Ti5hyUUxVmMfytX37uAkfQ86LsKcDtwV-0";

    const startData = {
      bookingId: bookingId,
      bookingIdLength: bookingId.length,
      bookingIdType: typeof bookingId,
      hasToken: !!token,
      tokenPrefix: token ? token.substring(0, 20) + "..." : "no token",
      baseUrl: BASE_URL,
      paymentType: "deposit" as const,
    };

    console.log("🚀 Starting payment checkout for booking:", {
      ...startData,
      timestamp: new Date().toISOString(),
    });

    paymentLogger.logPaymentStart(startData);

    // Try different possible endpoints
    const possibleEndpoints = [
      `${BASE_URL}/Payment/${bookingId}/checkout`,
      `${BASE_URL}/api/Payment/${bookingId}/checkout`,
      `${BASE_URL}/Payment/${bookingId}`,
      `${BASE_URL}/TestBooking/${bookingId}/checkout`,
      `${BASE_URL}/api/TestBooking/${bookingId}/checkout`,
    ];

    let lastError: any = null;

    for (const endpoint of possibleEndpoints) {
      try {
        const apiCallData = {
          url: endpoint,
          method: "POST",
          requestBody: { bookingId },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${
              token ? token.substring(0, 20) + "..." : "no token"
            }`,
            "Content-Type": "application/json",
          },
          bookingId: bookingId,
        };

        console.log("🔄 Trying payment endpoint:", {
          ...apiCallData,
          timestamp: new Date().toISOString(),
        });

        paymentLogger.logPaymentApiCall(endpoint, apiCallData);

        const response = await axios.post(
          endpoint,
          { bookingId }, // Include in body as well
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 15000, // 15 second timeout for payment
          }
        );

        const responseData = {
          url: endpoint,
          status: response.status.toString(),
          statusText: response.statusText,
          bookingId: bookingId,
          responseData: response.data,
        };

        console.log("✅ Payment checkout success at endpoint:", {
          ...responseData,
          timestamp: new Date().toISOString(),
        });
        console.log("📦 Payment response data:", {
          ...response.data,
          timestamp: new Date().toISOString(),
        });

        paymentLogger.logPaymentApiResponse(responseData);

        // Handle different response structures
        if (response.data && typeof response.data === "object") {
          // Ensure we have a proper response structure
          const responseData = response.data;
          const paymentUrl =
            responseData.paymentUrl ||
            responseData.url ||
            responseData.redirectUrl ||
            responseData.checkoutUrl;

          const urlData = {
            paymentUrl: paymentUrl,
            bookingId: bookingId,
            originalResponse: {
              paymentUrl: responseData.paymentUrl,
              url: responseData.url,
              redirectUrl: responseData.redirectUrl,
              checkoutUrl: responseData.checkoutUrl,
            },
          };

          console.log("🔗 Payment URL extracted:", {
            ...urlData,
            timestamp: new Date().toISOString(),
          });

          paymentLogger.logPaymentRedirect(paymentUrl || "no-url", urlData);

          const finalResponse = {
            success: responseData.success !== false, // Default to true unless explicitly false
            message: responseData.message || "Checkout thành công",
            paymentUrl: paymentUrl,
            checkoutUrl: paymentUrl, // Add checkoutUrl for compatibility
            orderId:
              responseData.orderId || responseData.order_id || responseData.id,
            amount: responseData.amount || responseData.totalAmount,
            ...responseData,
          };

          console.log("📤 Final payment response:", {
            ...finalResponse,
            timestamp: new Date().toISOString(),
          });

          return finalResponse;
        }

        // Fallback response if data structure is unexpected
        return {
          success: true,
          message: "Checkout thành công",
          ...response.data,
        };
      } catch (endpointError) {
        console.log("❌ Endpoint failed:", {
          url: endpoint,
          error: endpointError,
          status: (endpointError as any)?.response?.status,
          statusText: (endpointError as any)?.response?.statusText,
          responseData: (endpointError as any)?.response?.data,
          timestamp: new Date().toISOString(),
        });
        lastError = endpointError;
        continue; // Try next endpoint
      }
    }

    // If all endpoints failed, handle the last error
    throw lastError;
  } catch (error) {
    console.error("❌ Payment checkout error:", error);
    console.error("❌ Error details:", {
      message: (error as any)?.message,
      status: (error as any)?.response?.status,
      statusText: (error as any)?.response?.statusText,
      data: (error as any)?.response?.data,
      url: (error as any)?.config?.url,
    });

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      console.log("📊 Detailed Axios error:", {
        status,
        statusText: error.response?.statusText,
        responseData,
        requestUrl: error.config?.url,
        requestData: error.config?.data,
      });

      if (status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (status === 403) {
        throw new Error("Không có quyền thực hiện thanh toán.");
      } else if (status === 404) {
        throw new Error(
          `Không tìm thấy booking ID "${bookingId}" trong hệ thống. Vui lòng kiểm tra lại thông tin đặt lịch.`
        );
      } else if (status === 400) {
        const serverMessage =
          responseData?.message ||
          responseData?.error ||
          responseData?.title ||
          "Thông tin thanh toán không hợp lệ.";
        throw new Error(`Lỗi dữ liệu: ${serverMessage}`);
      } else if (status && status >= 500) {
        throw new Error(
          "Lỗi server thanh toán. Vui lòng thử lại sau hoặc liên hệ hỗ trợ."
        );
      } else if (error.code === "ECONNABORTED") {
        throw new Error(
          "Kết nối thanh toán quá chậm. Vui lòng kiểm tra mạng và thử lại."
        );
      } else {
        const serverMessage =
          responseData?.message ||
          responseData?.error ||
          responseData?.title ||
          `Lỗi ${status}: Không thể thực hiện thanh toán`;
        throw new Error(serverMessage);
      }
    } else {
      throw new Error(
        `Lỗi thanh toán: ${(error as Error)?.message || "Lỗi không xác định"}`
      );
    }
  }
};

export const checkoutRemainingPaymentApi = async (
  bookingId: string
): Promise<CheckoutResponse> => {
  try {
    if (!bookingId || bookingId.trim() === "") {
      throw new Error("Booking ID không hợp lệ");
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      throw new Error("Yêu cầu xác thực. Vui lòng đăng nhập lại.");
    }

    const remainingStartData = {
      bookingId,
      baseUrl: BASE_URL,
      paymentType: "remaining" as const,
    };

    console.log("🚀 Starting REMAINING payment for booking:", {
      ...remainingStartData,
      timestamp: new Date().toISOString(),
    });

    paymentLogger.logPaymentStart(remainingStartData);

    const endpoint = `${BASE_URL}/Payment/${bookingId}/remaining-payment`;

    console.log("🔄 Remaining payment request:", {
      url: endpoint,
      method: "POST",
      requestBody: { bookingId },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${
          token ? token.substring(0, 20) + "..." : "no token"
        }`,
        "Content-Type": "application/json",
      },
      timestamp: new Date().toISOString(),
    });

    const response = await axios.post(
      endpoint,
      { bookingId },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    console.log("✅ Remaining payment success:", {
      status: response.status,
      statusText: response.statusText,
      timestamp: new Date().toISOString(),
    });

    const responseData = response.data;
    const paymentUrl =
      responseData.checkoutUrl ||
      responseData.url ||
      responseData.redirectUrl ||
      responseData.paymentUrl;

    console.log("🔗 Remaining payment URL extracted:", {
      paymentUrl: paymentUrl,
      originalResponse: {
        checkoutUrl: responseData.checkoutUrl,
        url: responseData.url,
        redirectUrl: responseData.redirectUrl,
        paymentUrl: responseData.paymentUrl,
      },
      timestamp: new Date().toISOString(),
    });

    const finalResponse = {
      success: responseData.success !== false,
      message: responseData.message || "Thanh toán thành công",
      paymentUrl: paymentUrl,
      checkoutUrl: paymentUrl, // Add checkoutUrl for compatibility
      ...responseData,
    };

    console.log("📤 Final remaining payment response:", {
      ...finalResponse,
      timestamp: new Date().toISOString(),
    });

    return finalResponse;
  } catch (error) {
    console.error("❌ Remaining payment error:", {
      error: error,
      timestamp: new Date().toISOString(),
      bookingId: bookingId,
    });

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      console.error("📊 Detailed remaining payment error:", {
        status,
        statusText: error.response?.statusText,
        responseData,
        requestUrl: error.config?.url,
        requestData: error.config?.data,
        timestamp: new Date().toISOString(),
      });

      if (status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (status === 404) {
        throw new Error(
          `Không tìm thấy booking ID "${bookingId}" hoặc booking không ở trạng thái chờ thanh toán.`
        );
      } else {
        const serverMessage =
          responseData?.message ||
          `Lỗi ${status}: Không thể thực hiện thanh toán`;
        throw new Error(serverMessage);
      }
    } else {
      throw new Error(
        `Lỗi thanh toán: ${(error as Error)?.message || "Lỗi không xác định"}`
      );
    }
  }
};

// Helper function to format payment amount
export const formatPaymentAmount = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper function to calculate deposit (20%)
export const calculateDeposit = (totalAmount: number): number => {
  return Math.round(totalAmount * 0.2);
};

// API for remaining payment callback
export const callRemainingPaymentCallbackApi = async (payload: {
  orderCode: string;
  status: string;
  bookingId: string;
}): Promise<{
  orderCode: string;
  bookingId: string;
  status: "PAID" | "CANCELLED";
  success: boolean;
  error?: string;
}> => {
  try {
    // Get token from multiple sources
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    // Normalize status: chỉ PAID hoặc CANCELLED
    const normalizedStatus = payload.status === "PAID" ? "PAID" : "CANCELLED";

    console.log("🔄 Calling remaining payment callback:", {
      orderCode: payload.orderCode,
      status: normalizedStatus,
      bookingId: payload.bookingId,
      timestamp: new Date().toISOString(),
    });

    // 🔄 Thử nhiều endpoint có thể có
    const possibleEndpoints = [
      `${BASE_URL}/Payment/remaining-callback`,
      `${BASE_URL}/api/Payment/callback`,
      `${BASE_URL}/Payment/callback`,
      `${BASE_URL}/api/Payment/${payload.bookingId}/remaining-callback`,
      `${BASE_URL}/Payment/${payload.bookingId}/remaining-callback`,
    ];

    let lastError: any = null;

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`🔄 Trying endpoint: ${endpoint}`);

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify({
            orderCode: payload.orderCode,
            status: normalizedStatus,
            bookingId: payload.bookingId,
          }),
        });

        console.log(`📡 Response from ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get("content-type"),
          timestamp: new Date().toISOString(),
        });

        // 🔍 Handle different response scenarios
        if (response.ok) {
          // Try to parse JSON, but handle empty responses
          let responseData = null;
          const contentType = response.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            const text = await response.text();
            if (text.trim()) {
              responseData = JSON.parse(text);
            }
          }

          console.log("✅ Remaining payment callback success:", {
            endpoint,
            orderCode: payload.orderCode,
            bookingId: payload.bookingId,
            status: normalizedStatus,
            responseData,
            timestamp: new Date().toISOString(),
          });

          return {
            orderCode: payload.orderCode,
            bookingId: payload.bookingId,
            status: normalizedStatus,
            success: true,
          };
        } else if (response.status === 404) {
          console.log(
            `❌ 404 Not Found at ${endpoint}, trying next endpoint...`
          );
          lastError = new Error(`404 Not Found: ${endpoint}`);
          continue; // Try next endpoint
        } else {
          // Handle other HTTP errors
          let errorData = null;
          try {
            const text = await response.text();
            if (text.trim()) {
              errorData = JSON.parse(text);
            }
          } catch {
            console.log("Cannot parse error response as JSON");
          }

          console.error(`❌ HTTP Error ${response.status} at ${endpoint}:`, {
            status: response.status,
            statusText: response.statusText,
            errorData,
            timestamp: new Date().toISOString(),
          });

          return {
            orderCode: payload.orderCode,
            bookingId: payload.bookingId,
            status: normalizedStatus,
            success: false,
            error:
              errorData?.error ||
              errorData?.message ||
              `HTTP ${response.status}: ${response.statusText}`,
          };
        }
      } catch (endpointError) {
        console.log(`❌ Endpoint ${endpoint} failed:`, endpointError);
        lastError = endpointError;
        continue; // Try next endpoint
      }
    }

    // 🚫 All endpoints failed
    throw lastError || new Error("All callback endpoints failed");
  } catch (err) {
    console.error("❌ Remaining payment callback exception:", {
      error: err,
      orderCode: payload.orderCode,
      bookingId: payload.bookingId,
      timestamp: new Date().toISOString(),
    });

    return {
      orderCode: payload.orderCode,
      bookingId: payload.bookingId,
      status: payload.status === "PAID" ? "PAID" : "CANCELLED",
      success: false,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
};
