import rootApi from "../../../apis/rootApi";
import type { TestRequest, TestResponse, TestUpdateRequest } from "../types/testService";

// GET: Lấy danh sách dịch vụ
export const getTestsApi = async (token: string): Promise<TestResponse[]> => {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await rootApi.get<{ data: TestResponse[] }>("/TestService", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

// POST: Tạo mới dịch vụ
export const createTestApi = async (data: TestRequest, token: string): Promise<TestResponse> => {
  try {
    const response = await rootApi.post("/TestService", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data as TestResponse;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('createTestApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to create test: ${error.message}` : 'Failed to create test: Unknown error');
  }
};

// GET: Lấy chi tiết dịch vụ theo id
export const getTestByIdApi = async (id: string, token: string): Promise<TestResponse> => {
  try {
    const response = await rootApi.get<{ data: TestResponse }>(`/TestService/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }
    return response.data.data;
  } catch (error) {
    console.error("getTestByIdApi error:", error);
    throw error;
  }
};

// PUT: Cập nhật dịch vụ
export const updateTestApi = async (data: TestUpdateRequest, token: string): Promise<TestResponse> => {
  try {
    const response = await rootApi.put("/TestService", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    return response.data as TestResponse;
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined,
      status: error instanceof Error && 'response' in error ? (error as any).response?.status : undefined,
    };
    console.error('updateTestApi error:', errorDetails);
    throw new Error(error instanceof Error ? `Failed to update test: ${error.message}` : 'Failed to update test: Unknown error');
  }
};


// DELETE: Xóa dịch vụ
export const deleteTestApi = async (id: string, token: string): Promise<void> => {
  try {
    await rootApi.delete(`/TestService/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("deleteTestApi error:", error);
    throw error;
  }
};
