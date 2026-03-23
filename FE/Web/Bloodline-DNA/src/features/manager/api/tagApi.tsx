import rootApi from "../../../apis/rootApi";
import type { TagRequest, TagResponse, TagUpdateRequest } from "../types/tags";

// GET: Lấy danh sách tag
export const getTagsApi = async (): Promise<TagResponse[]> => {
  const response = await rootApi.get("/Tag");
  // Nếu là mảng trực tiếp thì dùng response.data luôn
  return Array.isArray(response.data) ? response.data : response.data.data || [];
};

// POST: Tạo tag mới
export const createTagApi = async (data: TagRequest): Promise<TagResponse> => {
  try {
    const response = await rootApi.post("/Tag", data, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }
    return response.data as TagResponse;
  } catch (error) {
    throw error;
  }
};

// GET: Lấy tag theo id
export const getTagByIdApi = async (id: string): Promise<TagResponse> => {
  try {
    const response = await rootApi.get<{ data: TagResponse }>(`/Tag/${id}`);
    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// PUT: Cập nhật tag theo id
export const updateTagApi = async (data: TagUpdateRequest): Promise<void> => {
  try {
    await rootApi.put(`/Tag/${data.id}`, { id: data.id, name: data.name }, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    throw error;
  }
};


// DELETE: Xóa tag theo id
export const deleteTagApi = async (id: string): Promise<void> => {
  try {
    await rootApi.delete(`/Tag/${id}`);
  } catch (error) {
    throw error;
  }
};

// GET: Lấy tag theo tên
export const getTagByNameApi = async (name: string): Promise<TagResponse> => {
  try {
    const response = await rootApi.get<{ data: TagResponse }>(`/Tag/name/${encodeURIComponent(name)}`);
    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// GET: Lấy danh sách blog theo tagId
export const getBlogsByTagApi = async (tagId: string): Promise<any[]> => {
  try {
    const response = await rootApi.get<{ data: any[] }>(`/Tag/blog/${tagId}`);
    if (!response.data?.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};