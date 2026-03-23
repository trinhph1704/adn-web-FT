// Interface cho Booking object từ API response
export interface BookingItem {
  id: string;
  testServiceId: string;
  clientId: string;
  email: string;
  appointmentDate: string; // ISO date string
  price: number;
  collectionMethod: string;
  status: string;
  note: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  clientName: string;
  address: string;
  phone: string;
}

// Interface cho API response wrapper (nếu có)
export interface BookingListResponse {
  success?: boolean;
  data?: BookingItem[];
  message?: string;
  statusCode?: number;
}

// Base API URL
const API_BASE_URL = "https://api.adntester.duckdns.org/api";

// Function để lấy auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || 
         localStorage.getItem('token') || 
         localStorage.getItem('accessToken') ||
         sessionStorage.getItem('authToken') ||
         sessionStorage.getItem('token') ||
         null;
};

import { getUserInfoApi } from './userApi';

// Function để lấy userId từ API thay vì decode token
export const getUserIdFromToken = async (): Promise<string | null> => {
  try {
    
    // Ưu tiên lấy từ API
    const userData = await getUserInfoApi();
    if (userData?.id) {
      // Cache userId vào localStorage để sử dụng sau
      localStorage.setItem('userId', userData.id);
      return userData.id;
    }
    
    console.warn('⚠️ No userId found in API response');
    return null;
  } catch (error) {
    console.error('❌ Error getting userId from API:', error);
    
    // Fallback: thử decode token như cũ
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        console.warn('⚠️ Invalid token format');
        return null;
      }
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const decodedToken = JSON.parse(jsonPayload);
      console.log('🔍 Decoded token payload:', decodedToken);
      
      // Thử các field có thể chứa userId
      const userId = decodedToken.userId || 
                     decodedToken.id || 
                     decodedToken.sub || 
                     decodedToken.user_id ||
                     decodedToken.nameid || // Common in ASP.NET tokens
                     decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || // Standard claim
                     null;
      
      if (userId) {
        console.log('✅ Found userId in token:', userId);
        // Cache userId vào localStorage
        localStorage.setItem('userId', userId);
        return userId;
      } else {
        console.warn('⚠️ No userId field found in token. Available fields:', Object.keys(decodedToken));
      }
      
      return null;
    } catch (tokenError) {
      console.error('❌ Error decoding token:', tokenError);
      
      // Final fallback: lấy từ localStorage
      const fallbackUserId = localStorage.getItem('userId') || 
                            localStorage.getItem('user_id') || 
                            sessionStorage.getItem('userId') ||
                            sessionStorage.getItem('user_id') ||
                            null;
      
      if (fallbackUserId) {
        console.log('✅ Found userId in localStorage/sessionStorage:', fallbackUserId);
      }
      
      return fallbackUserId;
    }
  }
};

// Function để lấy danh sách booking theo userId
export const getBookingListApi = async (): Promise<BookingItem[]> => {
  try {
    const token = getAuthToken();
    const userId = await getUserIdFromToken(); // Thay đổi thành async call
    
    if (!userId) {
      console.warn('⚠️ No userId found');
      throw new Error('User ID not found. Please login again.');
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No authentication token found');
      throw new Error('Authentication required. Please login to view bookings.');
    }
        
    const response = await fetch(`${API_BASE_URL}/TestBooking/user/${userId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      let errorData;
      let detailedMessage = '';
      
      try {
        const responseText = await response.text();
        console.log('Raw error response:', responseText);
        
        // Try to parse as JSON
        errorData = JSON.parse(responseText);
        
        // Extract detailed error info
        if (errorData.message) {
          detailedMessage = errorData.message;
        }
        
      } catch (parseError) {
        // If not JSON, use raw text
        detailedMessage = errorData || 'Unknown error';
        console.log('Error parsing response as JSON:', parseError);
      }
      
      // Specific error handling
      if (response.status === 401) {
        throw new Error('Unauthorized: Please login to continue.');
      } else if (response.status === 403) {
        throw new Error('Access denied: You do not have permission to view bookings.');
      } else if (response.status === 404) {
        throw new Error('No bookings found for this user.');
      }
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${detailedMessage}`);
    }

    const result = await response.json();
    
    // Handle different response structures
    if (Array.isArray(result)) {
      // Direct array response
      return result;
    } else if (result.data && Array.isArray(result.data)) {
      // Wrapped response with data property
      return result.data;
    } else if (result.success && result.data && Array.isArray(result.data)) {
      // Standard API wrapper response
      return result.data;
    } else {
      console.warn('Unexpected response structure:', result);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching booking list:', error);
    throw error;
  }
};

// Function để lấy booking theo ID
export const getBookingByIdApi = async (bookingId: string): Promise<BookingItem | null> => {
  try {
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Authentication required. Please login to view booking details.');
    }
    
    console.log(`🔍 Fetching booking details for ID: ${bookingId}`);
    
    const response = await fetch(`${API_BASE_URL}/TestBooking/${bookingId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please login to continue.');
      } else if (response.status === 404) {
        throw new Error('Booking not found.');
      }
      
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Booking details fetched successfully:', result);

    // ✅ Ưu tiên trả về result.data nếu có
    if (result?.data) {
      return result.data;
    }

    // Nếu không có .data, mà result là object đúng kiểu BookingDetail
    if (result?.id && result?.status) {
      return result;
    }

    console.warn("⚠️ Unexpected booking response structure:", result);
    return null;
  } catch (error) {
    console.error('❌ Error fetching booking details:', error);
    throw error;
  }
};


// Function để filter booking theo status
export const getBookingsByStatusApi = async (status: string): Promise<BookingItem[]> => {
  try {
    const allBookings = await getBookingListApi();
    
    // Filter bookings by status
    const filteredBookings = allBookings.filter(booking => 
      booking.status.toLowerCase() === status.toLowerCase()
    );
    
    console.log(`✅ Filtered ${filteredBookings.length} bookings with status: ${status}`);
    return filteredBookings;
  } catch (error) {
    console.error('❌ Error filtering bookings by status:', error);
    throw error;
  }
};

// Function để format date cho display
export const formatBookingDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Function để format currency
export const formatPrice = (price: number): string => {
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${price}đ`;
  }
};

// Status mapping cho display
export const statusMapping: Record<string, { label: string; color: string }> = {
  'pending': { label: 'Chờ xử lý', color: 'text-yellow-600 bg-yellow-100' },
  'confirmed': { label: 'Đã xác nhận', color: 'text-blue-600 bg-blue-100' },
  'in_progress': { label: 'Đang thực hiện', color: 'text-purple-600 bg-purple-100' },
  'completed': { label: 'Hoàn thành', color: 'text-green-600 bg-green-100' },
  'cancelled': { label: 'Đã hủy', color: 'text-red-600 bg-red-100' },
};

// Function để get status display info
export const getStatusDisplay = (status: string) => {
  return statusMapping[status.toLowerCase()] || { 
    label: status, 
    color: 'text-gray-600 bg-gray-100' 
  };
}; 

// Function để test userId và endpoint
export const testBookingApi = async (): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const token = getAuthToken();
    const userId = await getUserIdFromToken(); // Thay đổi thành async call
    
    console.log('🧪 Testing Booking API...');
    console.log('Token exists:', !!token);
    console.log('UserId:', userId);
    
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }
    
    if (!userId) {
      return { success: false, message: 'No userId found in token or storage' };
    }
    
    // Test API endpoint
    const endpoint = `${API_BASE_URL}/TestBooking/user/${userId}`;
    console.log('Testing endpoint:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const result = await response.json();
    
    return {
      success: response.ok,
      message: response.ok ? 'API test successful' : `API test failed: ${response.status}`,
      data: {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        userId,
        response: result
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: { error }
    };
  }
}; 

// Function để test toàn bộ flow
export const testCompleteBookingFlow = async (): Promise<{ success: boolean; message: string; data?: any }> => {
  console.log('🧪 === TESTING COMPLETE BOOKING FLOW ===');
  
  try {
    // Step 1: Test token existence
    console.log('🔍 Step 1: Checking authentication token...');
    const token = getAuthToken();
    if (!token) {
      return { success: false, message: 'Step 1 Failed: No authentication token found' };
    }
    console.log('✅ Step 1 Passed: Token exists');
    
    // Step 2: Test getUserInfoApi
    console.log('🔍 Step 2: Getting user info from API...');
    const userData = await getUserInfoApi();
    if (!userData || !userData.id) {
      return { success: false, message: 'Step 2 Failed: Unable to get user info or userId from API', data: userData };
    }
    console.log('✅ Step 2 Passed: User info retrieved', userData);
    
    // Step 3: Test getUserIdFromToken
    console.log('🔍 Step 3: Testing getUserIdFromToken function...');
    const userId = await getUserIdFromToken();
    if (!userId) {
      return { success: false, message: 'Step 3 Failed: getUserIdFromToken returned null' };
    }
    console.log('✅ Step 3 Passed: UserId obtained:', userId);
    
    // Step 4: Test booking API endpoint
    console.log('🔍 Step 4: Testing booking API endpoint...');
    const endpoint = `${API_BASE_URL}/TestBooking/user/${userId}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return { 
        success: false, 
        message: `Step 4 Failed: API returned ${response.status}`, 
        data: { 
          endpoint, 
          status: response.status, 
          statusText: response.statusText 
        } 
      };
    }
    
    const result = await response.json();
    console.log('✅ Step 4 Passed: API call successful');
    
    // Step 5: Test complete getBookingListApi function
    console.log('🔍 Step 5: Testing complete getBookingListApi function...');
    const bookings = await getBookingListApi();
    console.log('✅ Step 5 Passed: Complete function works');
    
    return {
      success: true,
      message: 'All tests passed! Booking API is working correctly.',
      data: {
        userId,
        endpoint,
        userInfo: userData,
        bookingsCount: Array.isArray(bookings) ? bookings.length : 0,
        bookings: Array.isArray(bookings) ? bookings.slice(0, 2) : bookings // Chỉ show 2 booking đầu để không spam log
      }
    };
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: { error: error instanceof Error ? error.message : error }
    };
  }
}; 