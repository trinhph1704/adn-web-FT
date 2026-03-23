import rootApi from "../../../apis/rootApi";
import type { TestBookingResponse, TestBookingStatusRequest } from "../types/testBooking";


// Hàm GET: Lấy danh sách đặt lịch xét nghiệm
export const getTestBookingApi = async (): Promise<TestBookingResponse[]> => {
  const maxRetries = 3;
  const timeout = 10000;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      // rootApi sẽ tự động thêm Authorization header thông qua interceptor
      const response = await rootApi.get<{ data: TestBookingResponse[]; statusCode: number; }>(
        "/TestBooking",
        {
          timeout,
        }
      );
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
      console.error("getTestBookingApi error:", errorDetails);
      if (attempts >= maxRetries) {
        throw new Error(error instanceof Error ? `Failed to get test bookings: ${error.message}` : "Failed to get test bookings: Unknown error");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed to get test bookings after retries");
};


// Hàm GET: Lấy chi tiết đặt lịch xét nghiệm theo ID
export const getTestBookingByIdApi = async (id: string): Promise<TestBookingResponse> => {
  try {
    if (!id) throw new Error("Booking ID is required");

    // rootApi sẽ tự động thêm Authorization header thông qua interceptor
    const response = await rootApi.get<{ data: TestBookingResponse }>(`/TestBooking/${id}`);

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Hàm PUT: Cập nhật trạng thái đặt lịch xét nghiệm
// https://api.adntester.duckdns.org/api/TestBooking/31DBB33BABCE4237/status?newStatus=6
export const updateTestBookingStatusApi = async (request: TestBookingStatusRequest): Promise<TestBookingResponse> => {
  try {
    // rootApi sẽ tự động thêm Authorization header thông qua interceptor
    const response = await rootApi.put<{ data: TestBookingResponse }>(
      `/TestBooking/${request.bookingId}/status?newStatus=${request.status}`,
      {} // empty body
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Hàm GET: Lấy danh sách booking theo userId với filtering
export const getBookingsByUserIdApi = async (userId: string, startDate?: string, endDate?: string): Promise<TestBookingResponse[]> => {
  try {
    if (!userId) throw new Error("User ID is required");

    // rootApi sẽ tự động thêm Authorization header thông qua interceptor
    const response = await rootApi.get<TestBookingResponse[]>(`/TestBooking/user/${userId}`);

    let bookings = Array.isArray(response.data) ? response.data : [];

    // Apply date filtering on frontend if dates are provided
    if (startDate || endDate) {
      bookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.appointmentDate || booking.createdAt);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date('2100-12-31');

        return bookingDate >= start && bookingDate <= end;
      });
    }

    return bookings;
  } catch (error) {
    throw error;
  }
};