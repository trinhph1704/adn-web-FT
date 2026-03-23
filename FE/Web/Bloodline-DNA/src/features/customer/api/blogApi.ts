import axios from "axios";
import { BASE_URL } from "../../../apis/rootApi";
import type { BlogPost } from "../types/blogs.types";

export const getBlogsApi = async (): Promise<BlogPost[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/Blog`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!Array.isArray(response.data)) {
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error("Dữ liệu không hợp lệ");
  }
  console.log("getBlogsApi", response);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching blogs:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Không thể tải bài viết");
  }
};

export const getBlogById = async (id: string): Promise<BlogPost> => {
  try {
    const response = await axios.get(`${BASE_URL}/Blog/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error: unknown) {
    console.error("Error fetching blog by ID:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Không thể tải bài viết");
  }
};
