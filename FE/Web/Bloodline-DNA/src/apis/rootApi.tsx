import axios from 'axios';

// Function để lấy auth token từ các storage locations
const getAuthToken = (): string | null => {
  return localStorage.getItem('token') ||
         localStorage.getItem('accessToken') ||
         localStorage.getItem('authToken') ||
         sessionStorage.getItem('token') ||
         sessionStorage.getItem('accessToken') ||
         null;
};

// Function để clear auth data và redirect về login
const clearAuthAndRedirect = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('accessToken');

  // Redirect về login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

const rootApi = axios.create({
  baseURL: 'https://api.adntester.duckdns.org/api',
});

// Request interceptor để tự động thêm Authorization header
rootApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để handle 401 errors
rootApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🔒 401 Unauthorized - Clearing auth and redirecting to login');
      clearAuthAndRedirect();
    }
    return Promise.reject(error);
  }
);

export default rootApi;
export { clearAuthAndRedirect, getAuthToken };

export const BASE_URL = "https://api.adntester.duckdns.org/api";

export const STAFF_BASE_URL = "https://api.adntester.duckdns.org";