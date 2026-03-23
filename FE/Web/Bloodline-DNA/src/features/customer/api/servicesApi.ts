import axios from "axios";
import { BASE_URL } from "../../../apis/rootApi";

// ===== INTERFACES =====
// API Response interfaces matching the backend structure
export interface TestService {
  id: string;
  serviceId: string;
  price: number;
  collectionMethod: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  testServiceInfor: {
    id: string;
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    priceServices: string[];
  };
}

// Service Detail Response interface
export interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  price: number; // Add price at the top level
  turnaroundTime?: string; // Optional: e.g., "3-5 business days"
  faqs?: { question: string; answer: string }[]; // Optional: for service-specific FAQs
  priceServices: {
    id: string;
    serviceId: string;
    price: number;
    collectionMethod: number;
    currency: string | null;
    effectiveFrom: string;
    effectiveTo: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    testServiceInfor: {
      id: string;
      name: string;
      description: string;
      category: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      priceServices: any;
      sampleCount: number;
    };
  }[];
  sampleCount: number;
}

export const servicesApi = async () => {
  try {
    // Try multiple token sources
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    // Prepare headers - only include Authorization if token exists
    const headers: any = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(`${BASE_URL}/ServicePrice/latest`, {
      headers,
      timeout: 10000, // 10 second timeout
    });

    // console.log('✅ API Response received');
    // console.log('📊 Response status:', response.status);
    // console.log('📦 Raw API Response:', response.data);
    // console.log('📝 Response type:', typeof response.data);
    // console.log('🔍 Is array?:', Array.isArray(response.data));

    // Handle responses with $values for circular references
    if (response.data && response.data.$values) {
      return response.data.$values;
    }

    // Handle standard array responses
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Handle wrapped responses
    if (response.data && typeof response.data === "object") {
      console.log("📦 Object response detected, checking for data property...");
      if (response.data.data) {
        // console.log('🔄 Found data property, extracting...');
        return Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
      }
    }

    return response.data;
  } catch (error) {
    console.error("❌ servicesApi Error Details:");
    console.error("📍 Error type:", error?.constructor?.name);
    console.error("📄 Full error object:", error);

    if (axios.isAxiosError(error)) {
      console.error("🌐 Axios Error Details:");
      console.error("📊 Status Code:", error.response?.status);
      console.error("📝 Status Text:", error.response?.statusText);
      console.error("📦 Response Data:", error.response?.data);
      console.error("🔗 Request URL:", error.config?.url);
      console.error("⚙️ Request Method:", error.config?.method);
      console.error("🔑 Request Headers:", error.config?.headers);
      console.error("⏱️ Error Code:", error.code);
      console.error("💬 Error Message:", error.message);

      // Categorize errors with detailed messages
      if (error.response?.status === 401) {
        throw new Error(
          "API yêu cầu đăng nhập. Đang hiển thị dữ liệu mẫu để bạn có thể xem dịch vụ."
        );
      } else if (error.response?.status === 403) {
        throw new Error(
          "Không có quyền truy cập endpoint này. Đang hiển thị dữ liệu mẫu."
        );
      } else if (error.response?.status === 404) {
        throw new Error(
          "Endpoint API không tồn tại. Đang hiển thị dữ liệu mẫu."
        );
      } else if (error.response?.status && error.response.status >= 500) {
        throw new Error("Lỗi server. Đang hiển thị dữ liệu mẫu.");
      } else if (error.code === "ECONNABORTED") {
        throw new Error(
          "Kết nối API quá chậm (timeout). Đang hiển thị dữ liệu mẫu."
        );
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error")
      ) {
        throw new Error("Lỗi kết nối mạng. Đang hiển thị dữ liệu mẫu.");
      } else {
        // Extract server message with more detail
        const serverMessage =
          error.response?.data?.message ||
          error.response?.data?.title ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          `Lỗi HTTP ${
            error.response?.status ?? "Unknown"
          }: Đang hiển thị dữ liệu mẫu`;
        throw new Error(serverMessage);
      }
    } else {
      // Non-Axios errors
      console.error("🚫 Non-Axios Error Details:");
      console.error("💬 Error Message:", (error as Error)?.message);
      console.error("📚 Error Stack:", (error as Error)?.stack);

      if (error instanceof TypeError) {
        throw new Error(
          "Lỗi cấu hình API hoặc URL không hợp lệ. Vui lòng liên hệ admin."
        );
      } else if (error instanceof SyntaxError) {
        throw new Error(
          "Lỗi phân tích dữ liệu từ server. Vui lòng thử lại sau."
        );
      } else {
        throw new Error(
          `Lỗi không xác định: ${
            (error as Error)?.message || "Unknown error"
          }. Vui lòng thử lại hoặc liên hệ admin.`
        );
      }
    }
  }
};

// Get service detail by ID
export const getServiceById = async (
  serviceId: string
): Promise<ServiceDetail> => {
  try {
    // Try multiple token sources
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    // Try multiple possible endpoints
    const possibleEndpoints = [
      `${BASE_URL}/TestService/${serviceId}`,
      `${BASE_URL}/TestServiceInfor/${serviceId}`,
      `${BASE_URL}/ServicePrice/${serviceId}`,
      `${BASE_URL}/api/TestService/${serviceId}`,
      `${BASE_URL}/api/services/${serviceId}`,
    ];

    let lastError: any = null;

    for (const endpoint of possibleEndpoints) {
      try {
        // Prepare headers - only include Authorization if token exists
        const headers: any = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await axios.get(endpoint, {
          headers,
          timeout: 10000, // 10 second timeout
        });

        // console.log("📦 Raw Service Detail Response:", response.data);
        // console.log("📦 Response data keys:", Object.keys(response.data || {}));

        // Handle different response structures
        let rawData: any;

        if (response.data?.data) {
          // Response has data wrapper
          rawData = response.data.data;
        } else if (response.data) {
          // Direct response
          rawData = response.data;
        } else {
          throw new Error("Không tìm thấy dữ liệu dịch vụ");
        }

        // console.log("🔍 Raw data:", rawData);
        // console.log("🔍 Raw data keys:", Object.keys(rawData || {}));
        // console.log("🔍 Raw data.name:", rawData?.name);
        // console.log("🔍 Raw data.testServiceInfor:", rawData?.testServiceInfor);

        // --- Data Transformation Logic ---
        const transformToServiceDetail = (data: any): ServiceDetail => {
          const firstPriceService = data.priceServices?.[0];

          return {
            id: data.id,
            name: data.name,
            description: data.description,
            category: data.category,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            price: firstPriceService?.price || 0, // Extract price
            turnaroundTime: data.turnaroundTime || "3-5 ngày", // Add default
            faqs: data.faqs || [], // Add default
            priceServices: data.priceServices || [],
            sampleCount: data.sampleCount || 0,
          };
        };

        return transformToServiceDetail(rawData);
      } catch (endpointError) {
        console.warn(
          "Endpoint failed:",
          endpoint,
          (endpointError as Error).message
        );
        lastError = endpointError;

        // If this is the special case where testServiceInfor is null,
        // immediately go to fallback instead of trying more endpoints
        if ((endpointError as Error)?.message === "testServiceInfor_is_null") {
          console.log(
            "🔄 testServiceInfor is null, going to fallback immediately"
          );
          break;
        }

        continue; // Try next endpoint
      }
    }

    try {
      const allServices = await servicesApi();
      const matchedService = allServices.find(
        (service: TestService) =>
          service.id === serviceId || service.serviceId === serviceId
      );

      if (matchedService) {
        console.log("✅ Found service in list, creating detail object");
        console.log("🔍 MatchedService:", matchedService);
        console.log("🔍 TestServiceInfor:", matchedService.testServiceInfor);

        // Check if testServiceInfor exists and has the name
        if (matchedService.testServiceInfor) {
          console.log(
            "🔍 TestServiceInfor.name:",
            matchedService.testServiceInfor.name
          );
          console.log(
            "🔍 TestServiceInfor keys:",
            Object.keys(matchedService.testServiceInfor)
          );

          // Create a ServiceDetail object from TestService
          const serviceDetail: ServiceDetail = {
            id: matchedService.testServiceInfor.id,
            name: matchedService.testServiceInfor.name,
            description: matchedService.testServiceInfor.description,
            category: matchedService.testServiceInfor.category,
            isActive: matchedService.testServiceInfor.isActive,
            createdAt: matchedService.testServiceInfor.createdAt,
            updatedAt: matchedService.testServiceInfor.updatedAt,
            price: matchedService.price, // Assuming price is directly available
            turnaroundTime: "3-5 ngày", // Default for fallback
            faqs: [], // Default for fallback
            priceServices: [
              {
                id: matchedService.id,
                serviceId: matchedService.serviceId,
                price: matchedService.price,
                collectionMethod: matchedService.collectionMethod,
                currency: matchedService.currency,
                effectiveFrom: matchedService.effectiveFrom,
                effectiveTo: matchedService.effectiveTo,
                isActive: matchedService.isActive,
                createdAt: matchedService.createdAt,
                updatedAt: matchedService.updatedAt,
                testServiceInfor: {
                  ...matchedService.testServiceInfor,
                  sampleCount: 0,
                },
              },
            ],
            sampleCount: 0,
          };

          return serviceDetail;
        } else {
          // testServiceInfor is null, create a minimal ServiceDetail with defaults
          const serviceDetail: ServiceDetail = {
            id: matchedService.serviceId || matchedService.id,
            name: `Dịch vụ xét nghiệm ADN (ID: ${matchedService.id})`,
            description:
              "Dịch vụ xét nghiệm ADN chính xác, nhanh chóng và bảo mật.",
            category: "Civil", // Default category
            isActive: matchedService.isActive,
            createdAt: matchedService.createdAt,
            updatedAt: matchedService.updatedAt,
            price: matchedService.price, // Assuming price is directly available
            turnaroundTime: "3-5 ngày", // Default for fallback
            faqs: [], // Default for fallback
            priceServices: [
              {
                id: matchedService.id,
                serviceId: matchedService.serviceId,
                price: matchedService.price,
                collectionMethod: matchedService.collectionMethod,
                currency: matchedService.currency,
                effectiveFrom: matchedService.effectiveFrom,
                effectiveTo: matchedService.effectiveTo,
                isActive: matchedService.isActive,
                createdAt: matchedService.createdAt,
                updatedAt: matchedService.updatedAt,
                testServiceInfor: {
                  id: matchedService.serviceId || matchedService.id,
                  name: `Dịch vụ xét nghiệm ADN (ID: ${matchedService.id})`,
                  description:
                    "Dịch vụ xét nghiệm ADN chính xác, nhanh chóng và bảo mật.",
                  category: "Civil",
                  isActive: matchedService.isActive,
                  createdAt: matchedService.createdAt,
                  updatedAt: matchedService.updatedAt,
                  priceServices: null,
                  sampleCount: 0,
                },
              },
            ],
            sampleCount: 0,
          };

          console.log(
            "✅ Created minimal ServiceDetail with name:",
            serviceDetail.name
          );
          return serviceDetail;
        }
      }
    } catch (fallbackError) {
      console.error("❌ Fallback method also failed:", fallbackError);
    }

    // If everything fails, throw the last error
    throw lastError;
  } catch (error) {
    console.error("❌ Error in getServiceById:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(
          "Không tìm thấy thông tin dịch vụ. Vui lòng kiểm tra lại ID dịch vụ."
        );
      } else if (error.response?.status === 401) {
        throw new Error(
          "API yêu cầu đăng nhập để xem chi tiết dịch vụ. Vui lòng đăng nhập để xem thông tin đầy đủ."
        );
      } else if (error.code === "ECONNABORTED") {
        throw new Error("Kết nối quá chậm. Vui lòng thử lại sau.");
      } else {
        const serverMessage =
          error.response?.data?.message ||
          error.response?.data?.title ||
          `Lỗi ${error.response?.status}: Không thể tải thông tin dịch vụ`;
        throw new Error(serverMessage);
      }
    } else {
      throw new Error("Lỗi không xác định khi tải thông tin dịch vụ");
    }
  }
};
