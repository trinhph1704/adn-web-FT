export interface PriceServiceRequest {
  id?: string; 
  price: number;
  collectionMethod: number;
  effectiveFrom: string;
  effectiveTo: string;
  currency?: string;
  isActive: boolean;
}

// Dùng cho tạo mới (POST)
export interface TestRequest {
  name: string;
  description: string;
  isActive: boolean;
  priceServices: PriceServiceRequest[];
  sampleCount: number; // Số lượng mẫu mặc định
}

// Dùng cho cập nhật (PUT)
export interface TestUpdateRequest {
  id: string;
  name: string;
  description: string;
  category: string; 
  isActive: boolean;
  priceServices: PriceServiceRequest[];
}

export interface PriceServiceResponse {
  id: string;
  serviceId: string;
  price: number;
  collectionMethod: number;
  collectionMethodLabel?: string; // thêm nếu bạn muốn lưu label tiếng Việt tại đây
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  testServiceInfor: TestServiceInfor;
}

export interface TestServiceInfor {
  id: string;
  name: string;
  description: string;  
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  priceServices: PriceServiceResponse[];
  sampleCount: number;
}

export interface TestResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  priceServices: PriceServiceResponse[];
  sampleCount: number;
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case "civil":
      return "Dân sự";
    case "legal":
      return "Pháp lý";
    default:
      return category;
  }
}

export function getCollectionMethodLabel(method: number): string {
  switch (method) {
    case 0:
      return "Tự lấy mẫu";
    case 1:
      return "Lấy mẫu tại cơ sở";
    default:
      return "Không xác định";
  }
}
