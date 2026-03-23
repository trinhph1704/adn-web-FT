import rootApi from "../../../apis/rootApi";
import type { SampleInsResponse, SampleInsUpdateRequest } from "../types/sample-ins";

// GET: Lấy tất cả SampleIns
export const getSampleInsListApi = async (): Promise<SampleInsResponse[]> => {
  const response = await rootApi.get("/sample-instruction");
  return Array.isArray(response.data) ? response.data : response.data.data || [];
};

// GET: Lấy SampleIns theo id
export const getSampleInsByIdApi = async (id: string): Promise<SampleInsResponse> => {
  const response = await rootApi.get<{ data: SampleInsResponse }>(`/sample-instruction/${id}`);
  if (!response.data?.data) {
    throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
  }
  return response.data.data;
};

// PUT: Cập nhật SampleIns theo id
export const updateSampleInsApi = async (
  data: SampleInsUpdateRequest
): Promise<SampleInsResponse> => {
  if (!data.id) {
    throw new Error("Invalid request: Missing id");
  }

  const response = await rootApi.put(`/sample-instruction`, data, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.data) {
    throw new Error(`Invalid response: ${JSON.stringify(response.data)}`);
  }
  return response.data as SampleInsResponse;
};


// DELETE: Xóa SampleIns theo id
export const deleteSampleInsApi = async (id: string): Promise<void> => {
  await rootApi.delete(`/sample-instruction/${id}`);
};