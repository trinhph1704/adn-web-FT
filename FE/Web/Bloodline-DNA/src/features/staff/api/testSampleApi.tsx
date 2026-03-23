import rootApi from "../../../apis/rootApi";
import type { SampleTestFromStaffRequest, SampleTestRequest, SampleTestResponse, SampleTestUpdateRequest } from "../types/sampleTest";
import type { TestKitResponse } from "../types/testKit";

// GET: Lấy tất cả TestSample
export const getAllTestSampleApi = async (token: string): Promise<SampleTestResponse[]> => {
  try {
    if (!token) {
      throw new Error("Token is required to access this resource.");
    }
    const response = await rootApi.get<{ data: SampleTestResponse[] }>("/TestSample", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data ?? [];
  } catch (error) {
    throw error;
  }
};

export const getKitAllApi = async (token: string): Promise<TestKitResponse[]> => {
  try {
    if (!token) {
      throw new Error("Token is required to access this resource.");
    }
    const response = await rootApi.get<{ data: TestKitResponse[] }>("/TestKit", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.data ?? [];
  } catch (error: any) {
    console.error("❌ Lỗi khi gọi getKitAllApi:", error?.message || error);
    throw error;
  }
};

// POST: Tạo mới TestSample tai nhà
export const createTestSampleApi = async (data: SampleTestRequest, token: string): Promise<SampleTestResponse> => {
  try {
    const response = await rootApi.post<{ data: SampleTestResponse }>("/TestSample/client-create", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// POST: Tạo mới TestSample tai cơ sở
export const createTestSampleFromStaffApi = async (data: SampleTestFromStaffRequest, token: string): Promise<SampleTestResponse> => {
  try {
    const response = await rootApi.post<{ data: SampleTestResponse }>("/TestSample/staff-create", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// PUT: Cập nhật TestSample theo id
export const updateTestSampleApi = async (data: SampleTestUpdateRequest, token: string): Promise<SampleTestResponse> => {
  try {
    const response = await rootApi.put<{ data: SampleTestResponse }>(
      `/TestSample/${data.id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// GET: Lấy TestSample theo id (dành cho user)
export const getTestSampleByIdApi = async (id: string, token: string): Promise<SampleTestResponse> => {
  try {
    const response = await rootApi.get<{ data: SampleTestResponse }>(`/TestSample/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// DELETE: Xóa TestSample theo id (dành cho user)
export const deleteTestSampleByIdApi = async (id: string, token: string): Promise<void> => {
  try {
    await rootApi.delete(`/TestSample/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error;
  }
};

// GET: Lấy TestSample theo kitId
export const getTestSampleByKitIdApi = async (kitId: string, token: string): Promise<SampleTestResponse> => {
  try {
    const response = await rootApi.get<{ data: SampleTestResponse }>(`/TestSample/kit/${kitId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};