import {
  AlertCircleIcon,
  BuildingIcon,
  CalendarIcon,
  CircleSlash2,
  ClockIcon,
  EditIcon,
  EyeIcon,
  FileTextIcon,
  FilterIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  StarIcon
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer, Header } from "../../../components";
import Loading from "../../../components/Loading";
import { useBookingModal } from "../components/BookingModalContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
// Import booking list API
import {
  formatPrice,
  getBookingListApi,
  type BookingItem
} from "../api/bookingListApi";
// Import statusConfig từ BookingStatusPage để đồng bộ
import { getTestResultsByUserId } from "../api/testResultApi";
import { getUserInfoApi } from "../api/userApi";
import { getStatusConfigByDetailedStatus } from "../components/bookingStatus/StatusConfig";
import { FeedbackModal } from "../components/FeedbackModal";
import { useExistingFeedback } from "../hooks/useExistingFeedback";
import type { DetailedBookingStatus } from "../types/bookingTypes";

interface Booking {
  id: string;
  testServiceId: string; // Add testServiceId field
  testType: string;
  serviceType: 'home' | 'clinic';
  name: string;
  phone: string;
  email: string;
  address?: string;
  preferredDate: string;
  preferredTime: string;
  status: DetailedBookingStatus;
  notes?: string;
  bookingDate: string;
  price: string;
  collectionMethod: string | number; // Support both string and number
}

export const BookingList = (): React.JSX.Element => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [collectionMethodFilter, setCollectionMethodFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState<Booking | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [loadingResult, setLoadingResult] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [preloadedFeedbacks, setPreloadedFeedbacks] = useState<Set<string>>(new Set());

  // Use existing feedback hook
  const {
    checkExistingFeedback,
    getExistingFeedback,
    isCheckingFeedbackFor,
  } = useExistingFeedback();

  const { openBookingModal } = useBookingModal();
  const navigate = useNavigate();

  // Debouncing refs
  const hoverTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Ref to store checkExistingFeedback function to avoid dependency issues
  const checkExistingFeedbackRef = useRef(checkExistingFeedback);

  // Update ref when function changes
  useEffect(() => {
    checkExistingFeedbackRef.current = checkExistingFeedback;
  }, [checkExistingFeedback]);
  
  // Debounced feedback check function
  const debouncedCheckFeedback = useCallback((bookingId: string, userId: string, testServiceId: string, delay = 300) => {
    // Clear existing timeout for this booking
    if (hoverTimeoutRef.current[bookingId]) {
      clearTimeout(hoverTimeoutRef.current[bookingId]);
    }
    
    // Set new timeout
    hoverTimeoutRef.current[bookingId] = setTimeout(() => {
      const feedbackKey = `${userId}_${testServiceId}`;
      const existingFeedback = getExistingFeedback(userId, testServiceId);
      const isAlreadyChecking = isCheckingFeedbackFor(userId, testServiceId);
      
      // Only check if we haven't checked yet and not currently checking
      if (!existingFeedback && !isAlreadyChecking && !preloadedFeedbacks.has(feedbackKey)) {
        checkExistingFeedback(userId, testServiceId);
        setPreloadedFeedbacks(prev => new Set(prev).add(feedbackKey));
      }
      
      // Clean up timeout reference
      delete hoverTimeoutRef.current[bookingId];
    }, delay);
  }, [checkExistingFeedback, getExistingFeedback, isCheckingFeedbackFor, preloadedFeedbacks]);

  // Helper function to transform API data to Booking interface
  const transformApiDataToBooking = (item: BookingItem): Booking => {
    // Parse appointmentDate to get date and time
    const appointmentDate = new Date(item.appointmentDate);
    const preferredDate = appointmentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const preferredTime = appointmentDate.toTimeString().substring(0, 5); // HH:MM
    
    // Parse createdAt for bookingDate
    const createdAt = new Date(item.createdAt);
    const bookingDate = createdAt.toISOString().split('T')[0];
    
    // Map collectionMethod to serviceType - FIX: sử dụng logic đúng 0/1
    const serviceType: 'home' | 'clinic' = (() => {
      // Kiểm tra nếu collectionMethod là number
      if (typeof item.collectionMethod === 'number') {
        return item.collectionMethod === 0 ? 'home' : 'clinic';
      }
      
      // Kiểm tra nếu collectionMethod là string number
      const methodNum = parseInt(item.collectionMethod);
      if (!isNaN(methodNum)) {
        return methodNum === 0 ? 'home' : 'clinic';
      }
      
      // Fallback: nếu là string, kiểm tra nội dung
      const methodStr = item.collectionMethod?.toLowerCase() || '';
      return methodStr.includes('home') || methodStr.includes('nhà') || methodStr.includes('0') ? 'home' : 'clinic';
    })();
    
    // Normalize status to match DetailedBookingStatus - FIX: sử dụng PascalCase  
    const normalizeStatus = (status: string): DetailedBookingStatus => {
      const statusLower = status.toLowerCase();
      
      // Map theo DetailedBookingStatus (PascalCase)
      if (statusLower.includes('pending') || statusLower.includes('chờ')) return 'Pending';
      if (statusLower.includes('confirmed') || statusLower.includes('xác nhận')) return 'PreparingKit'; // Assume confirmed moves to preparing
      if (statusLower.includes('preparing') || statusLower.includes('chuẩn bị')) return 'PreparingKit';
      if (statusLower.includes('delivering') || statusLower.includes('giao')) return 'DeliveringKit';
      if (statusLower.includes('delivered') || statusLower.includes('nhận kit')) return 'KitDelivered';
      if (statusLower.includes('waiting') || statusLower.includes('chờ mẫu')) return 'WaitingForSample';
      if (statusLower.includes('returning') || statusLower.includes('vận chuyển')) return 'ReturningSample';
      if (statusLower.includes('received') || statusLower.includes('nhận mẫu')) return 'SampleReceived';
      if (statusLower.includes('testing') || statusLower.includes('phân tích')) return 'Testing';
      if (statusLower.includes('payment') || statusLower.includes('thanh toán')) return 'Completed'; // Map payment to completed for now
      if (statusLower.includes('completed') || statusLower.includes('hoàn thành')) return 'Completed';
      if (statusLower.includes('cancelled') || statusLower.includes('hủy')) return 'Cancelled';
      
      return 'Pending'; // Default fallback
    };
    
    return {
      id: item.id,
      testServiceId: item.testServiceId, // Add testServiceId from API
      testType: `Xét nghiệm ADN`, // Default since API doesn't have testType
      serviceType,
      name: item.clientName,
      phone: item.phone,
      email: item.email,
      address: item.address || '',
      preferredDate,
      preferredTime,
      status: normalizeStatus(item.status),
      notes: item.note || '',
      bookingDate,
      price: formatPrice(item.price),
      collectionMethod: item.collectionMethod
    };
  };

  useEffect(() => {
    // Fetch user info and bookings
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user info first
        const userData = await getUserInfoApi().catch(() => null);
        if (userData?.id) {
          setUserId(userData.id);
        }

        const apiData = await getBookingListApi();
        const formattedBookings = apiData.map(transformApiDataToBooking);

        // Sort bookings by createdAt descending (newest first)
        const sortedBookings = formattedBookings.sort((a, b) => {
          const dateA = new Date(a.bookingDate);
          const dateB = new Date(b.bookingDate);
          return dateB.getTime() - dateA.getTime();
        });

        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);

        // Preload feedback for first 3 completed bookings to improve UX
        if (userData?.id) {
          const completedBookings = sortedBookings
            .filter(booking => booking.status === 'Completed')
            .slice(0, 3); // Only first 3 to avoid performance issues

          if (completedBookings.length > 0) {

            // Add small delays to avoid hitting API too hard
            completedBookings.forEach((booking, index) => {
              if (booking.testServiceId) {
                setTimeout(() => {
                  const feedbackKey = `${userData.id}_${booking.testServiceId}`;
                  checkExistingFeedbackRef.current(userData.id, booking.testServiceId);
                  setPreloadedFeedbacks(prev => new Set(prev).add(feedbackKey));
                }, index * 100); // 100ms delay between each call
              }
            });
          }
        }
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        // Use empty array as fallback
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Remove checkExistingFeedback dependency to prevent infinite loop

  useEffect(() => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by collectionMethod
    if (collectionMethodFilter !== "all") {
      filtered = filtered.filter(booking => {
        const method = booking.collectionMethod;
        if (collectionMethodFilter === "home") {
          // Home: collectionMethod = 0 hoặc SelfSample
          if (typeof method === 'number') {
            return method === 0;
          } else if (typeof method === 'string') {
            const methodStr = method.toLowerCase();
            return methodStr === "0" || 
                   methodStr.includes("selfsample") || 
                   methodStr.includes("home") || 
                   methodStr.includes("nhà");
          }
          return false;
        } else if (collectionMethodFilter === "facility") {
          // Facility: collectionMethod = 1 hoặc AtFacility
          if (typeof method === 'number') {
            return method === 1;
          } else if (typeof method === 'string') {
            const methodStr = method.toLowerCase();
            return methodStr === "1" || 
                   methodStr.includes("atfacility") || 
                   methodStr.includes("facility") || 
                   methodStr.includes("cơ sở");
          }
          return false;
        }
        return true;
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, collectionMethodFilter]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(hoverTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFeedbackClick = (booking: Booking) => {

    // Only check for existing feedback if we haven't checked yet
    if (userId && booking.testServiceId) {
      const feedbackKey = `${userId}_${booking.testServiceId}`;
      const existingFeedback = getExistingFeedback(userId, booking.testServiceId);
      const isAlreadyChecking = isCheckingFeedbackFor(userId, booking.testServiceId);
      const hasPreloaded = preloadedFeedbacks.has(feedbackKey);

      // Only refresh if we haven't preloaded and not currently checking
      if (!hasPreloaded && !existingFeedback && !isAlreadyChecking) {
        checkExistingFeedback(userId, booking.testServiceId);
        setPreloadedFeedbacks(prev => new Set(prev).add(feedbackKey));
      }
    }

    setSelectedBookingForFeedback(booking);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackModalClose = () => {
    setFeedbackModalOpen(false);
    setSelectedBookingForFeedback(null);
  };

  // Hàm xử lý xem kết quả xét nghiệm
  const handleViewResult = async (bookingId: string) => {
    setLoadingResult(true);
    setResultError(null);
    setResultData(null);
    try {
      if (!userId) {
        throw new Error("Không tìm thấy userId. Vui lòng đăng nhập lại.");
      }
      
      console.log('🔍 Debug info for BookingList ViewResult:', {
        userId: userId,
        bookingId: bookingId,
        bookingIdType: typeof bookingId,
        bookingIdLength: bookingId?.length
      });
      
      const results = await getTestResultsByUserId(userId);
      
      console.log('📊 All results from API:', {
        totalResults: results.length,
        results: results.map(r => ({
          id: r.id,
          testBookingId: r.testBookingId,
          testBookingIdType: typeof r.testBookingId,
          resultSummary: r.resultSummary?.substring(0, 50) + '...'
        }))
      });
      
      // Chuẩn hóa để so sánh chính xác - chỉ trim, không toLowerCase để tránh lỗi so sánh ID
      const normalize = (val: any) => {
        if (val === null || val === undefined) return '';
        return String(val).trim();
      };
      const normBookingId = normalize(bookingId);
      
      console.log('🎯 Looking for exact testBookingId match:', {
        originalBookingId: bookingId,
        normalizedBookingId: normBookingId,
        bookingIdLength: normBookingId.length
      });
      
      // Tìm kết quả khớp chính xác với testBookingId
      let matched = results.find(r => {
        const normalizedTestBookingId = normalize(r.testBookingId);
        const isExactMatch = normalizedTestBookingId === normBookingId;
        console.log('🔍 Comparing BookingList:', {
          targetBookingId: normBookingId,
          testBookingId: r.testBookingId,
          normalizedTestBookingId,
          isExactMatch,
          lengthMatch: normalizedTestBookingId.length === normBookingId.length
        });
        return isExactMatch;
      });
      
      if (!matched) {
        console.warn('⚠️ No exact match found for bookingId. Details:', {
          searchedBookingId: normBookingId,
          totalResultsAvailable: results.length,
          availableTestBookingIds: results.map(r => ({
            original: r.testBookingId,
            normalized: normalize(r.testBookingId),
            type: typeof r.testBookingId
          })),
          recommendedAction: 'Check if testBookingId in database matches the booking ID exactly'
        });
        throw new Error(`Không tìm thấy kết quả cho booking "${bookingId}". Vui lòng kiểm tra lại mã booking hoặc liên hệ hỗ trợ.`);
      }
      
      console.log('✅ Found exact matching result in BookingList:', {
        resultId: matched.id,
        testBookingId: matched.testBookingId,
        resultSummary: matched.resultSummary?.substring(0, 100),
        resultDate: matched.resultDate,
        matchConfirmed: normalize(matched.testBookingId) === normBookingId
      });
      
      setResultData(matched);
      setShowResultModal(true);
    } catch (e: any) {
      console.error('❌ Error in handleViewResult:', e);
      setResultError(e.message || "Lỗi khi lấy kết quả");
    } finally {
      setLoadingResult(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full py-20 overflow-hidden md:py-28 bg-blue-50">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af"/></svg>
          </div>
          <div className="container relative z-10 px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">Trang Chủ</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><span className="font-semibold text-blue-900">Danh Sách Đặt Lịch</span></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">Danh Sách Đặt Lịch
              <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
                Quản lý lịch hẹn xét nghiệm
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">Theo dõi và quản lý tất cả các lịch hẹn xét nghiệm của bạn một cách dễ dàng và tiện lợi.</p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo mã, loại xét nghiệm, tên..."
                  className="py-3 pl-10 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <FilterIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="Pending">Chờ xác nhận</option>
                  <option value="PreparingKit">Đang chuẩn bị Kit</option>
                  <option value="DeliveringKit">Đang giao Kit</option>
                  <option value="KitDelivered">Đã nhận Kit</option>
                  <option value="WaitingForSample">Chờ nhận mẫu</option>
                  <option value="ReturningSample">Đang vận chuyển mẫu</option>
                  <option value="SampleReceived">Đã nhận mẫu</option>
                  <option value="Testing">Đang phân tích</option>
                  <option value="Completed">Hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
                
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">Phương thức:</span>
                </div>
                <select
                  value={collectionMethodFilter}
                  onChange={(e) => setCollectionMethodFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="home">Tại nhà</option>
                  <option value="facility">Tại cơ sở</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings List */}
        <section className="py-16 bg-white md:py-20">
          <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-8">
              <p className="text-lg text-slate-600">
                Tìm thấy <span className="font-semibold text-blue-900">{filteredBookings.length}</span> lịch hẹn
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loading 
                  size="large" 
                  message="Đang tải danh sách lịch hẹn..." 
                  color="blue" 
                />
              </div>
            ) : error ? (
              <div className="py-16 text-center">
                <CircleSlash2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="mb-4 text-slate-500">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="text-white bg-blue-900 hover:bg-blue-800"
                  style={{color: "white"}}
                >
                  Thử Lại
                </Button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-16 text-center">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-slate-600">Không có lịch hẹn nào</h3>
                <Button onClick={() => openBookingModal()} className="text-white bg-blue-900 hover:bg-blue-800">
                  Đặt Lịch Mới
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredBookings.map((booking) => {
                  const statusInfo = getStatusConfigByDetailedStatus(booking.status);
                  const StatusIcon = statusInfo?.icon || AlertCircleIcon;
                  const ServiceIcon = booking.serviceType === 'home' ? HomeIcon : BuildingIcon;
                  
                  // Handler to check feedback on hover (lazy loading with debouncing)
                  const handleCardHover = () => {
                    if (booking.status === 'Completed' && userId && booking.testServiceId) {
                      debouncedCheckFeedback(booking.id, userId, booking.testServiceId);
                    }
                  };
                  
                  // Handler to cancel hover timeout when mouse leaves
                  const handleCardLeave = () => {
                    if (hoverTimeoutRef.current[booking.id]) {
                      clearTimeout(hoverTimeoutRef.current[booking.id]);
                      delete hoverTimeoutRef.current[booking.id];
                    }
                  };
                  
                  return (
                    <Card 
                      key={booking.id} 
                      className="transition-shadow duration-300 bg-white border-0 shadow-lg hover:shadow-xl"
                      onMouseEnter={handleCardHover}
                      onMouseLeave={handleCardLeave}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-blue-900">#{booking.id}</h3>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                                    <StatusIcon className="w-4 h-4" />
                                    {statusInfo?.label || booking.status}
                                  </span>
                                </div>
                                <p className="mb-1 text-lg font-semibold text-slate-700">{booking.testType}</p>
                                <p className="font-medium text-blue-600">{booking.name}</p>
                              </div>
                              <div className="text-right">
                              <p className="text-sm text-slate-500">Tổng chi phí</p>
                                <p className="text-2xl font-bold text-green-600">{booking.price}</p>
                                
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                              <div className="flex items-center text-slate-600">
                                <ServiceIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {booking.collectionMethod === 'SelfSample' ? 'Khách Hàng Tự Thu Mẫu' : 'Thu mẫu tại cơ sở'}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {formatDate(booking.preferredDate)}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {booking.preferredTime}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <PhoneIcon className="w-4 h-4 mr-2 text-blue-500" />
                                {booking.phone}
                              </div>
                              {booking.address && (
                                <div className="flex items-center text-slate-600 md:col-span-2">
                                  <MapPinIcon className="w-4 h-4 mr-2 text-blue-500" />
                                  {booking.address}
                                </div>
                              )}
                            </div>

                            {booking.notes && (
                              <div className="p-3 mt-4 rounded-lg bg-blue-50">
                                <p className="text-sm text-blue-800">
                                  <strong>Lưu ý:</strong> {booking.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 mt-4">
                            <div className="flex flex-col gap-3 sm:flex-row">
                              {/* Ẩn nút "Xem chi tiết" cho booking có collectionMethod là "AtFacility" (giá trị 1) */}
                              {(() => {
                                // Kiểm tra collectionMethod: 1 = AtFacility, 0 = SelfSample
                                const method = booking.collectionMethod;
                                let isAtFacility = false;
                                
                                if (typeof method === 'number') {
                                  isAtFacility = method === 1;
                                } else if (typeof method === 'string') {
                                  const methodStr = method.toLowerCase();
                                  isAtFacility = methodStr === '1' || 
                                                methodStr.includes('atfacility') ||
                                                methodStr.includes('facility');
                                }
                                
                                return !isAtFacility;
                              })() && (
                                <Button 
                                  variant="outline" 
                                  className="w-full sm:w-auto"
                                  onClick={() => navigate(`/customer/booking-status/${booking.id}`)}
                                >
                                  <EyeIcon className="w-4 h-4 mr-2" />
                                  Xem chi tiết
                                </Button>
                              )}
                              {(booking.status === 'Pending' || booking.status === 'PreparingKit') && (
                                <Button 
                                  className="w-full bg-blue-600 sm:w-auto hover:bg-blue-700"
                                  style={{ color: 'white' }}
                                  onClick={() => navigate(`/customer/edit-booking/${booking.id}`)}
                                >
                                  <EditIcon className="w-4 h-4 mr-2" />
                                  Sửa
                                </Button>
                              )}
                              {booking.status === 'Completed' && (
                                <Button 
                                  className="w-full bg-green-600 sm:w-auto hover:bg-green-700"
                                  style={{ color: 'white' }}
                                  onClick={() => handleViewResult(booking.id)}
                                  disabled={loadingResult}
                                >
                                  <FileTextIcon className="w-4 h-4 mr-2" />
                                  {loadingResult ? "Đang tải..." : "XEM KẾT QUẢ"}
                                </Button>
                              )}
                            </div>
                            {booking.status === 'Completed' && (() => {
                              const existingFeedback = userId && booking.testServiceId ? getExistingFeedback(userId, booking.testServiceId) : null;
                              const isCheckingFeedback = userId && booking.testServiceId ? isCheckingFeedbackFor(userId, booking.testServiceId) : false;
                              const feedbackKey = userId && booking.testServiceId ? `${userId}_${booking.testServiceId}` : '';
                              const hasPreloaded = preloadedFeedbacks.has(feedbackKey);

                              // Strict validation để đảm bảo feedback hợp lệ
                              const hasValidFeedback = existingFeedback && 
                                typeof existingFeedback === 'object' &&
                                existingFeedback.id &&
                                existingFeedback.userId &&
                                existingFeedback.testServiceId &&
                                typeof existingFeedback.rating === 'number' &&
                                existingFeedback.rating >= 1 && 
                                existingFeedback.rating <= 5;

                              // Debug logging for BookingList
                              if (existingFeedback && !hasValidFeedback) {
                                console.warn("🚨 BookingList: Invalid feedback data detected:", {
                                  bookingId: booking.id,
                                  feedbackId: existingFeedback.id,
                                  rating: existingFeedback.rating,
                                  hasUserId: !!existingFeedback.userId,
                                  hasTestServiceId: !!existingFeedback.testServiceId,
                                  ratingType: typeof existingFeedback.rating
                                });
                              }

                              // Show loading if checking feedback or if we're in the preloading phase
                              if (isCheckingFeedback) {
                                return (
                                  <div className="w-full p-3 text-center border border-blue-200 rounded-lg bg-blue-50">
                                    <div className="flex items-center justify-center space-x-2">
                                      <div className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                      <span className="text-sm text-blue-700">Đang kiểm tra đánh giá...</span>
                                    </div>
                                  </div>
                                );
                              }

                              // Chỉ hiển thị feedback khi đã validated đầy đủ
                              if (hasValidFeedback) {
                                return (
                                  <div className="w-full p-3 border border-green-200 rounded-lg bg-green-50">
                                    <div className="text-center">
                                      <div className="flex items-center justify-center mb-2 space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <StarIcon
                                            key={star}
                                            className={`w-4 h-4 ${
                                              existingFeedback!.rating >= star
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600">
                                          ({existingFeedback!.rating}/5)
                                        </span>
                                      </div>
                                      <p className="text-sm font-medium text-green-700">
                                        ✓ Đã đánh giá
                                      </p>
                                      {existingFeedback!.comment && (
                                        <p className="mt-1 text-xs italic text-gray-600">
                                          "{existingFeedback!.comment.length > 50 
                                            ? `${existingFeedback!.comment.substring(0, 50)}...` 
                                            : existingFeedback!.comment}"
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              }

                              // Show evaluate button if checked but no feedback found
                              if (hasPreloaded || userId && booking.testServiceId) {
                                return (
                                  <Button 
                                    className="w-full text-white bg-yellow-500 hover:bg-yellow-600"
                                    onClick={() => handleFeedbackClick(booking)}
                                  >
                                    <StarIcon className="w-4 h-4 mr-2" />
                                    Đánh giá
                                  </Button>
                                );
                              }

                              // Default state - show placeholder that will trigger check on hover
                              return (
                                <div className="w-full p-3 text-center border border-gray-200 rounded-lg bg-gray-50">
                                  <span className="text-sm text-gray-500">Hover để kiểm tra đánh giá</span>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <div className="relative">
          <Footer />
        </div>
      </div>

      {/* Feedback Modal */}
      {selectedBookingForFeedback && (
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={handleFeedbackModalClose}
          bookingId={selectedBookingForFeedback.id}
          testServiceId={selectedBookingForFeedback.testServiceId} // Use correct testServiceId
        />
      )}

      {/* Modal hiển thị kết quả */}
      {showResultModal && resultData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <button className="absolute text-gray-500 top-2 right-2 hover:text-red-600" onClick={() => setShowResultModal(false)}>&times;</button>
            <h2 className="mb-4 text-xl font-bold text-green-700">Kết Quả Xét Nghiệm</h2>
            {resultData.list ? (
              <>
                <div className="mb-2 font-semibold text-blue-700">Chọn kết quả muốn xem:</div>
                <ul className="mb-4 space-y-2">
                  {resultData.list.map((r: any) => (
                    <li key={r.id} className="flex flex-col gap-1 p-2 border rounded">
                      <div><b>Mã booking:</b> {r.testBookingId}</div>
                      <div><b>Kết luận:</b> {r.resultSummary}</div>
                      <div><b>Ngày trả kết quả:</b> {new Date(r.resultDate).toLocaleDateString('vi-VN')}</div>
                      <Button className="mt-1 text-white bg-green-600" onClick={() => { setResultData(r); }}>
                        Xem chi tiết kết quả này
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => setShowResultModal(false)} className="w-full mt-2 text-white bg-gray-600">Đóng</Button>
              </>
            ) : (
              <>
                <div className="mb-2"><b>Mã booking:</b> {resultData.testBookingId}</div>
                <div className="mb-2"><b>Kết luận:</b> {resultData.resultSummary}</div>
                <div className="mb-2"><b>Ngày trả kết quả:</b> {new Date(resultData.resultDate).toLocaleDateString('vi-VN')}</div>
                <div className="mb-2"><b>Khách hàng:</b> {resultData.client?.fullName} ({resultData.client?.email})</div>
                <div className="mb-2"><b>Địa chỉ:</b> {resultData.client?.address}</div>
                <div className="mb-4">
                  <b>File kết quả:</b><br />
                  <img src={resultData.resultFileUrl} alt="Kết quả" className="max-w-full mt-2 border rounded max-h-60" />
                </div>
                <Button onClick={() => setShowResultModal(false)} className="w-full mt-2 text-white bg-green-600">Đóng</Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Modal */}
      {resultError && !showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <button className="absolute text-gray-500 top-2 right-2 hover:text-red-600" onClick={() => setResultError(null)}>&times;</button>
            <h2 className="mb-4 text-xl font-bold text-red-700">Lỗi</h2>
            <p className="mb-4 text-red-600">{resultError}</p>
            {resultError.includes("đăng nhập") && (
              <Button 
                onClick={() => window.location.href = '/auth/login'} 
                className="w-full text-white bg-red-600 hover:bg-red-700"
              >
                Đăng nhập ngay
              </Button>
            )}
            <Button onClick={() => setResultError(null)} className="w-full mt-2 text-white bg-gray-600">Đóng</Button>
          </div>
        </div>
      )}
    </div>
  );
};