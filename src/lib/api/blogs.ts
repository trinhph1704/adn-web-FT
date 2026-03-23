import api from "./client";

export interface BlogPost {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  imageUrl?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  authorId?: string;
  tags?: unknown[];
}

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export const getBlogsApi = async (): Promise<BlogPost[]> => {
  const response = await api.get<ApiResponse<BlogPost[]>>("/api/blogs");
  const data = response.data.data;
  if (Array.isArray(data)) return data;
  return [];
};

export const getBlogById = async (id: string): Promise<BlogPost> => {
  const response = await api.get<ApiResponse<BlogPost>>(`/api/blogs/${id}`);
  return response.data.data;
};
