import api from "./client";

export interface TestService {
  id: string;
  serviceId?: string;
  name: string;
  description: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  price?: number;
  collectionMethod?: number;
  currency?: string;
  effectiveFrom?: string;
  effectiveTo?: string | null;
  testServiceInfor?: TestService;
  priceServices?: unknown[];
}

export interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  price: number;
  turnaroundTime?: string;
  faqs?: { question: string; answer: string }[];
  priceServices: unknown[];
  sampleCount: number;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export const servicesApi = async (): Promise<TestService[]> => {
  const response = await api.get<ApiResponse<TestService[]>>("/api/services/prices");
  const data = response.data.data;
  if (Array.isArray(data)) return data as TestService[];
  if (data && typeof data === "object" && "data" in data) {
    const inner = (data as { data: unknown }).data;
    return (Array.isArray(inner) ? inner : [inner]) as TestService[];
  }
  return [];
};

export const getServiceById = async (serviceId: string): Promise<ServiceDetail> => {
  const response = await api.get<ApiResponse<ServiceDetail>>(`/api/services/${serviceId}`);
  return response.data.data;
};
