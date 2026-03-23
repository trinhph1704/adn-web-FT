import axios from "axios";
import type { TestResultResponse } from "../../staff/types/testResult";

// Lấy tất cả kết quả xét nghiệm của user theo userId
export const getTestResultsByUserId = async (userId: string): Promise<TestResultResponse[]> => {
  try {
    // Lấy token từ localStorage/sessionStorage
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  sessionStorage.getItem('token') ||
                  sessionStorage.getItem('authToken');
    
    if (!token) {
      throw new Error("Không có token xác thực. Vui lòng đăng nhập lại.");
    }
    
    console.log('🔍 Calling TestResult API with userId:', userId);
    console.log('🔑 Using token:', token.substring(0, 20) + '...');
    
    const apiUrl = `https://api.adntester.duckdns.org/api/TestResult/user/${userId}`;
    console.log('📡 API URL:', apiUrl);
    
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    console.log('✅ TestResult API response:', {
      status: response.status,
      statusText: response.statusText,
      dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
      dataLength: Array.isArray(response.data) ? response.data.length : 'not-array',
      data: response.data
    });
    
    if (Array.isArray(response.data)) {
      console.log('📊 Found', response.data.length, 'test results');
      
      // Log chi tiết từng kết quả để debug
      response.data.forEach((result, index) => {
        console.log(`📋 Result ${index + 1}:`, {
          id: result.id,
          testBookingId: result.testBookingId,
          testBookingIdType: typeof result.testBookingId,
          resultSummary: result.resultSummary?.substring(0, 50) + '...',
          resultDate: result.resultDate,
          hasResultFileUrl: !!result.resultFileUrl
        });
      });
      
      return response.data;
    }
    
    console.warn('⚠️ Unexpected response format:', response.data);
    
    // Kiểm tra nếu data được wrap trong object
    if (response.data?.data && Array.isArray(response.data.data)) {
      console.log('📊 Found wrapped data with', response.data.data.length, 'test results');
      return response.data.data;
    }
    
    // Nếu là single object, wrap thành array
    if (response.data && typeof response.data === 'object' && response.data.id) {
      console.log('📊 Found single result, converting to array');
      return [response.data];
    }
    
    return [];
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy kết quả xét nghiệm:", error);
    
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    } else if (error.response?.status === 404) {
      throw new Error("Không tìm thấy kết quả xét nghiệm cho người dùng này.");
    } else if (error.code === 'ECONNABORTED') {
      throw new Error("Kết nối quá chậm. Vui lòng thử lại.");
    } else {
      throw new Error(`Lỗi khi lấy kết quả: ${error.message || 'Không xác định'}`);
    }
  }
}; 