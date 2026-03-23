import type { AxiosError } from "axios";
import axios from "axios";

// Cập nhật URL API mới
const API_BASE_URL = "https://api.adntester.duckdns.org/api";

// Interface cho Update Booking request body theo yêu cầu mới
export interface UpdateBookingRequest {
  id: string;
  appointmentDate: string; // ISO date string
  status: number; // Status as number (0, 1, 2, 3, etc.)
  note: string;
  clientName: string;
  address: string;
  phone: string;
}

// Interface cho Update Booking response
export interface UpdateBookingResponse {
  success: boolean;
  data?: any;
  message: string;
  statusCode?: number;
}

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

// Status mapping - convert UI status to API status number
export const statusToNumber: Record<string, number> = {
  Pending: 0,
  PreparingKit: 1,
  DeliveringKit: 2,
  KitDelivered: 3,
  WaitingForSample: 4,
  ReturningSample: 5,
  SampleReceived: 6,
  Testing: 7,
  Completed: 8,
  Cancelled: 9,
  StaffGettingSample: 10,
  CheckIn: 11,
};

// Status mapping - convert API status number to UI status
export const numberToStatus: Record<number, string> = {
  0: "Pending",
  1: "PreparingKit",
  2: "DeliveringKit",
  3: "KitDelivered",
  4: "WaitingForSample",
  5: "ReturningSample",
  6: "SampleReceived",
  7: "Testing",
  8: "Completed",
  9: "Cancelled",
  10: "StaffGettingSample",
  11: "CheckIn",
};

// Function để update booking
export const updateBookingApi = async (
  bookingData: UpdateBookingRequest
): Promise<UpdateBookingResponse> => {
  try {
    const token = getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No authentication token found");
      throw new Error(
        "Authentication required. Please login to update booking."
      );
    }

    console.log("🔄 Updating booking with ID:", bookingData.id);
    console.log("📤 Request data:", bookingData);

    const response = await fetch(`${API_BASE_URL}/TestBooking`, {
      method: "PUT",
      headers,
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      let errorData;
      let detailedMessage = "";

      try {
        const responseText = await response.text();
        console.log("Raw error response:", responseText);

        // Try to parse as JSON
        errorData = JSON.parse(responseText);

        // Extract detailed error info
        if (errorData.message) {
          detailedMessage = errorData.message;
        } else if (errorData.errors) {
          // Handle validation errors
          const errorMessages = Object.values(errorData.errors).flat();
          detailedMessage = errorMessages.join(", ");
        }

        console.log("Parsed error data:", errorData);
      } catch (parseError) {
        // If not JSON, use raw text
        detailedMessage = errorData || "Unknown error";
        console.log("Error parsing response as JSON:", parseError);
      }

      // Specific error handling
      if (response.status === 401) {
        throw new Error("Unauthorized: Please login to continue.");
      } else if (response.status === 403) {
        throw new Error(
          "Access denied: You do not have permission to update this booking."
        );
      } else if (response.status === 404) {
        throw new Error(
          "Booking not found: The booking you are trying to update does not exist."
        );
      } else if (response.status === 400) {
        throw new Error(
          `Invalid data: ${
            detailedMessage || "Please check your input and try again."
          }`
        );
      }

      throw new Error(
        `HTTP error! status: ${response.status}, message: ${detailedMessage}`
      );
    }

    const result = await response.json();
    console.log("✅ Booking updated successfully:", result);

    return {
      success: true,
      data: result.data || result,
      message: result.message || "Booking updated successfully",
      statusCode: result.statusCode || 200,
    };
  } catch (error) {
    console.error("❌ Error updating booking:", error);
    throw error;
  }
};

// Function để confirm delivery của booking
export const confirmDeliveryApi = async (
  bookingId: string
): Promise<UpdateBookingResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Authentication required. Please login to confirm delivery."
    );
  }

  try {
    console.log("📤 Sending confirm delivery request for booking:", bookingId);
    console.log("📤 Request URL:", `${API_BASE_URL}/TestBooking/${bookingId}/confirm-delivery`);
    console.log("📤 Request headers:", {
      Authorization: `Bearer ${token ? token.substring(0, 20) + '...' : 'null'}`,
      "Content-Type": "application/json",
    });
    
    const res = await axios.put(
      `${API_BASE_URL}/TestBooking/${bookingId}/confirm-delivery`,
      {
        // Thử thêm một số field có thể cần thiết
        bookingId: bookingId,
        status: "KitDelivered" // Có thể server expect status hiện tại
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log raw response từ server
    console.log("📥 Raw server response:", {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      data: res.data
    });

    // Giả sử BE trả { success, data, message, statusCode }
    return res.data as UpdateBookingResponse;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    // ✅ Xử lý 4xx/5xx chi tiết
    if (error.response) {
      const { status, data } = error.response;
      const msg = data?.message || "Unknown error";

      switch (status) {
        case 401:
          throw new Error("Unauthorized: Please login to continue.");
        case 403:
          throw new Error(
            "Access denied: You do not have permission to confirm delivery."
          );
        case 404:
          throw new Error("Booking not found: The booking does not exist.");
        case 400:
          throw new Error(`Invalid request: ${msg}`);
        default:
          throw new Error(`HTTP ${status}: ${msg}`);
      }
    }

    // Lỗi mạng / timeout
    throw new Error(error.message || "Network error");
  }
};

// Function để update booking status
export const updateBookingStatusApi = async (
  bookingId: string,
  newStatus: number
): Promise<UpdateBookingResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Authentication required. Please login to update booking status."
    );
  }

  try {
    console.log(`🔄 Updating booking ${bookingId} status to ${newStatus}`);
    
    const res = await axios.put(
      `${API_BASE_URL}/TestBooking/${bookingId}/status?newStatus=${newStatus}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Status updated successfully for booking ${bookingId}`);
    return res.data as UpdateBookingResponse;
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
          throw new Error(
            "Access denied: You do not have permission to update booking status."
          );
        case 404:
          throw new Error("Booking not found: The booking does not exist.");
        case 400:
          throw new Error(`Invalid request: ${msg}`);
        default:
          throw new Error(`HTTP ${status}: ${msg}`);
      }
    }

    // Network/timeout errors
    console.error(`❌ Error updating booking ${bookingId} status:`, error);
    throw new Error(error.message || "Network error");
  }
};

// Function để confirm collection với ngày giờ
export const confirmCollectionApi = async (
  bookingId: string,
  collectionDateTime: string
): Promise<UpdateBookingResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Authentication required. Please login to confirm collection."
    );
  }

  try {
    console.log(`🔄 Confirming collection for booking ${bookingId} at ${collectionDateTime}`);
    
    // Bọc collectionDateTime trong dấu ngoặc kép
    const quotedDateTime = `"${collectionDateTime}"`;
    
    const res = await axios.post(
      `${API_BASE_URL}/TestBooking/${bookingId}/confirm-collection`,
      quotedDateTime,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Collection confirmed successfully for booking ${bookingId}`);
    
    // Log raw response từ server
    console.log("📥 Raw server response:", {
      status: res.status,
      statusText: res.statusText,
      data: res.data
    });

    return res.data as UpdateBookingResponse;
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
          throw new Error(
            "Access denied: You do not have permission to confirm collection."
          );
        case 404:
          throw new Error("Booking not found: The booking does not exist.");
        case 400:
          throw new Error(`Invalid request: ${msg}`);
        default:
          throw new Error(`HTTP ${status}: ${msg}`);
      }
    }

    // Network/timeout errors
    console.error(`❌ Error confirming collection for booking ${bookingId}:`, error);
    throw new Error(error.message || "Network error");
  }
};

// Helper function để validate update request data
export const validateUpdateBookingRequest = (
  data: Partial<UpdateBookingRequest>
): string[] => {
  const errors: string[] = [];

  if (!data.id || data.id.trim().length === 0) {
    errors.push("Booking ID is required");
  }

  if (!data.appointmentDate) {
    errors.push("Appointment date is required");
  } else {
    // Validate date format
    const date = new Date(data.appointmentDate);
    if (isNaN(date.getTime())) {
      errors.push("Invalid appointment date format");
    } else if (date <= new Date()) {
      errors.push("Appointment date must be in the future");
    }
  }

  if (data.status === undefined || data.status === null) {
    errors.push("Status is required");
  } else if (!Object.values(statusToNumber).includes(data.status)) {
    errors.push("Invalid status value");
  }

  if (!data.clientName || data.clientName.trim().length < 2) {
    errors.push("Client name must be at least 2 characters");
  }

  if (!data.phone || data.phone.trim().length < 10) {
    errors.push("Phone number must be at least 10 characters");
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.push("Address must be at least 5 characters");
  }

  return errors;
};

// Helper function để map form data to API request
export const mapFormDataToUpdateRequest = (
  bookingId: string,
  formData: any,
  currentStatus?: string
): UpdateBookingRequest => {
  // Validate required fields
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  if (!formData.preferredDate || !formData.preferredTime) {
    throw new Error("Date and time are required");
  }

  // Combine date and time
  const appointmentDateTime = new Date(
    `${formData.preferredDate}T${formData.preferredTime}:00`
  );

  if (isNaN(appointmentDateTime.getTime())) {
    throw new Error("Invalid date/time format");
  }

  // Get status number - đảm bảo luôn là số
  let statusNumber = 0; // Default to Pending
  
  if (formData.status && typeof formData.status === "number") {
    statusNumber = formData.status;
  } else if (formData.status && typeof formData.status === "string") {
    statusNumber = statusToNumber[formData.status] || 0;
  } else if (currentStatus) {
    statusNumber = statusToNumber[currentStatus] || 0;
  }

  // Debug logging
  console.log('🔍 Debug form data:', {
    notes: formData.notes,
    note: formData.note,
    finalNote: (formData.notes || formData.note || "").trim()
  });

  const updateRequest: UpdateBookingRequest = {
    id: bookingId,
    appointmentDate: appointmentDateTime.toISOString(),
    status: statusNumber, // Đảm bảo luôn là số
    note: (formData.notes || formData.note || "").trim(),
    clientName: (formData.name || formData.clientName || "").trim(),
    address: (formData.address || "").trim(),
    phone: (formData.phone || "").replace(/\s/g, ""), // Remove spaces
  };

  // Validate the final request
  const validationErrors = validateUpdateBookingRequest(updateRequest);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
  }

  console.log("📋 Mapped update request:", updateRequest);
  return updateRequest;
};

// Helper function để format date cho display
export const formatDateForInput = (
  dateString: string
): { date: string; time: string } => {
  try {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = date.toTimeString().substring(0, 5); // HH:MM

    return { date: formattedDate, time: formattedTime };
  } catch (error) {
    console.error("Error formatting date:", error);
    return { date: "", time: "" };
  }
};

// Status display mapping for UI
export const getStatusDisplayInfo = (statusNumber: number) => {
  const statusString = numberToStatus[statusNumber] || "pending";

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Chờ xử lý", color: "text-yellow-600 bg-yellow-100" },
    confirmed: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-100" },
    in_progress: {
      label: "Đang thực hiện",
      color: "text-purple-600 bg-purple-100",
    },
    completed: { label: "Hoàn thành", color: "text-green-600 bg-green-100" },
    cancelled: { label: "Đã hủy", color: "text-red-600 bg-red-100" },
  };

  return (
    statusConfig[statusString] || {
      label: statusString,
      color: "text-gray-600 bg-gray-100",
    }
  );
};
