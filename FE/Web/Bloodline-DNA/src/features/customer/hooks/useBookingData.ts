import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getBookingByIdApi } from "../api/bookingListApi";
import {
  confirmCollectionApi,
  confirmDeliveryApi,
  updateBookingStatusApi,
} from "../api/bookingUpdateApi";
import { callPaymentCallbackApi } from "../api/checkoutApi";
import { submitFeedbackApi } from "../api/feedbackApi";
import {
  callRemainingPaymentCallbackApi,
  checkoutPaymentApi,
  checkoutRemainingPaymentApi,
} from "../api/paymentApi";
import {
  getTestKitByBookingIdApi,
  getTestSampleByKitIdApi,
} from "../api/sampleApi";
import { getUserInfoApi } from "../api/userApi";
import {
  generateProgressData,
  transformApiDataToBookingDetail,
} from "../components/utils/bookingUtils";
import type {
  BookingDetail,
  DetailedBookingStatus,
  TestProgressData,
} from "../types/bookingTypes";
import { useExistingFeedback } from "./useExistingFeedback";

const statusNumberMapping: Record<number, DetailedBookingStatus> = {
  0: "Pending",
  1: "PreparingKit",
  2: "DeliveringKit",
  3: "KitDelivered",
  4: "WaitingForSample",
  5: "ReturningSample",
  6: "SampleReceived",
  7: "Testing",
  8: "Completed",
  9: "Cancelled",
  10: "StaffGettingSample",
  11: "CheckIn",
};

const isDetailedBookingStatus = (
  status: any
): status is DetailedBookingStatus =>
  Object.values(statusNumberMapping).includes(status);

export const useBookingData = () => {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [progressData, setProgressData] = useState<TestProgressData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [testServiceId, setTestServiceId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [confirmDeliveryLoading, setConfirmDeliveryLoading] = useState(false);
  const [shouldShowSampleButton, setShouldShowSampleButton] = useState(true);
  const [hasSampleInfo, setHasSampleInfo] = useState<boolean | undefined>(
    undefined
  );
  const [isDeliveryConfirmed, setIsDeliveryConfirmed] = useState(false);
  const [isCollectionConfirmed, setIsCollectionConfirmed] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string>("");
  // Use existing feedback hook
  const { checkExistingFeedback, getExistingFeedback, isCheckingFeedbackFor, clearFeedbackCache } =
    useExistingFeedback();

  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hasProcessedCallback = useRef(false);

  // Clear feedback cache khi bookingId thay đổi để tránh hiển thị feedback sai
  useEffect(() => {
    if (bookingId) {
      console.log(`🧹 Clearing feedback cache for new bookingId: ${bookingId}`);
      clearFeedbackCache();
    }
  }, [bookingId, clearFeedbackCache]);

  const checkSampleInfoStatus = useCallback(async (bookingId: string) => {
    try {

      // First get the TestKit ID
      const testKitResponse = await getTestKitByBookingIdApi(bookingId);
      if (!testKitResponse.success || !testKitResponse.data?.id) {
        setShouldShowSampleButton(true);
        return;
      }

      const kitId = testKitResponse.data.id;

      // Check if TestSample exists for this kit
      const testSamples = await getTestSampleByKitIdApi(kitId);
      if (Array.isArray(testSamples)) {
        const sampleCount = testKitResponse.data.sampleCount || 1;
        
        // Check if we have enough samples (equal to required sample count)
        if (testSamples.length >= sampleCount) {
          setShouldShowSampleButton(false); // Đã điền đủ mẫu
          setHasSampleInfo(true);
        } else {
          setShouldShowSampleButton(true); // Chưa điền đủ mẫu
          setHasSampleInfo(false);
        }
      } else {
        setShouldShowSampleButton(true); // Chưa có mẫu nào
        setHasSampleInfo(false);
      }
    } catch (error) {
      console.error("❌ Error checking sample info status:", error);
      // On error, show the button to be safe
      setShouldShowSampleButton(true);
      setHasSampleInfo(false);
    }
  }, []);

  const fetchBookingData = useCallback(async () => {
    if (!bookingId) {
      setError("Booking ID không hợp lệ");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [apiData, userData] = await Promise.all([
        getBookingByIdApi(bookingId),
        getUserInfoApi().catch(() => null),
      ]);

      if (userData?.id) setUserId(userData.id);
      if (!apiData) throw new Error("Không tìm thấy thông tin booking");

      const formatted = transformApiDataToBookingDetail(
        apiData,
        setTestServiceId
      );
      setBooking(formatted);
      // Generate progress data with sample info status
      setProgressData(generateProgressData(formatted, hasSampleInfo));

      const rawStatus = formatted.status;
      let normalizedStatus: DetailedBookingStatus | null = null;

      if (typeof rawStatus === "number") {
        normalizedStatus = statusNumberMapping[rawStatus];
      } else if (isDetailedBookingStatus(rawStatus)) {
        normalizedStatus = rawStatus;
      }

      if (
        normalizedStatus === "PreparingKit" ||
        normalizedStatus === "Completed"
      ) {
        setPaymentStatus("PAID");
      } else if (normalizedStatus === "Cancelled") {
        setPaymentError("Thanh toán thất bại");
      }

      // Check if delivery has been confirmed for this booking
      const deliveryConfirmKey = `delivery_confirmed_${bookingId}`;
      const isDeliveryConfirmed =
        localStorage.getItem(deliveryConfirmKey) === "true";
      setIsDeliveryConfirmed(isDeliveryConfirmed);

      // Check if collection has been confirmed for this booking
      const collectionConfirmKey = `collection_confirmed_${bookingId}`;
      const isCollectionConfirmed =
        localStorage.getItem(collectionConfirmKey) === "true";
      setIsCollectionConfirmed(isCollectionConfirmed);

      // Check if sample info has been submitted for different statuses
      if (normalizedStatus === "WaitingForSample") {
        await checkSampleInfoStatus(bookingId);
      } else if (["ReturningSample", "SampleReceived", "Testing", "Completed"].includes(normalizedStatus || "")) {
        // For these statuses, we should show view mode (samples should exist)
        setShouldShowSampleButton(false); // Set to false to show view mode
        setHasSampleInfo(true);
      } else {
        setShouldShowSampleButton(true); // Show button for other statuses
        setHasSampleInfo(undefined); // Reset for other statuses
      }

      // Check existing feedback if status is Completed
      // Note: testServiceId will be checked in a separate useEffect after it's set
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Lỗi khi tải thông tin đặt lịch";
      setError(msg);
      setBooking(null);
      if (msg.includes("Không tìm thấy")) {
        setTimeout(() => navigate("/booking-list"), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  // Regenerate progress data when sample info status changes
  useEffect(() => {
    if (booking) {
      setProgressData(generateProgressData(booking, hasSampleInfo));
    }
  }, [booking, hasSampleInfo]);

  // Check existing feedback after testServiceId and userId are set
  useEffect(() => {
    if (booking?.status === "Completed" && userId && testServiceId) {
      console.log("🔄 Checking existing feedback for:", {
        userId,
        testServiceId,
        bookingId,
        bookingStatus: booking?.status
      });
      
      // Validation: Đảm bảo testServiceId thuộc về booking hiện tại
      if (testServiceId && bookingId) {
        checkExistingFeedback(userId, testServiceId);
      } else {
        console.warn("⚠️ Missing testServiceId or bookingId for feedback check");
      }
    }
  }, [booking?.status, userId, testServiceId, bookingId, checkExistingFeedback]);

  const handlePayment = async (payload?: any) => {
    if (!booking?.id) {
      setPaymentError("Không tìm thấy thông tin đặt lịch");
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const isRemaining = payload?.type === "remaining";
      const result = isRemaining
        ? await checkoutRemainingPaymentApi(booking.id)
        : await checkoutPaymentApi(booking.id);

      if (!result.success)
        throw new Error(result.message || "Không thể tạo link thanh toán");

      const paymentData = {
        orderCode: result.orderCode,
        bookingId: booking.id,
        isRemainingPayment: isRemaining,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("paymentData", JSON.stringify(paymentData));
      if (result.paymentUrl || result.checkoutUrl) {
        window.location.href = result.paymentUrl || result.checkoutUrl;
      } else {
        setPaymentStatus("PAID");
      }
    } catch (err) {
      setPaymentError(
        err instanceof Error ? err.message : "Lỗi thanh toán không xác định"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentCallback = useCallback(
    async (orderCode: string, status: string) => {
      try {
        const paymentDataStr = localStorage.getItem("paymentData");
        const paymentData = paymentDataStr ? JSON.parse(paymentDataStr) : null;
        const effectiveBookingId = paymentData?.bookingId || bookingId;
        if (!effectiveBookingId) throw new Error("Không tìm thấy bookingId");

        const normalizedStatus =
          status.toUpperCase() === "PAID" ? "PAID" : "CANCELLED";

        // Check if this is a remaining payment
        const isRemainingPayment = paymentData?.isRemainingPayment || false;

        // console.log("🔄 Processing payment callback:", {
        //   orderCode,
        //   status: normalizedStatus,
        //   bookingId: effectiveBookingId,
        //   isRemainingPayment,
        //   timestamp: new Date().toISOString(),
        // });

        // Use the appropriate callback API based on payment type
        const response = isRemainingPayment
          ? await callRemainingPaymentCallbackApi({
              orderCode,
              status: normalizedStatus,
              bookingId: effectiveBookingId,
            })
          : await callPaymentCallbackApi({
              orderCode,
              status: normalizedStatus,
              bookingId: effectiveBookingId,
            });

        if (response.success && response.status === "PAID") {
          setPaymentStatus("PAID");
          // console.log("✅ Payment callback successful:", {
          //   paymentType: isRemainingPayment ? "remaining" : "deposit",
          //   orderCode,
          //   bookingId: effectiveBookingId,
          //   timestamp: new Date().toISOString(),
          // });
        } else {
          setPaymentStatus("CANCELLED");
          setPaymentError("Thanh toán thất bại hoặc bị hủy");
          // console.log("❌ Payment callback failed:", {
          //   paymentType: isRemainingPayment ? "remaining" : "deposit",
          //   orderCode,
          //   bookingId: effectiveBookingId,
          //   response,
          //   timestamp: new Date().toISOString(),
          // });
        }

        await fetchBookingData();
        localStorage.removeItem("paymentData");
        return true;
      } catch (err) {
        console.error("❌ Callback Error:", err);
        setPaymentError("Lỗi callback thanh toán");
        return false;
      }
    },
    [bookingId, fetchBookingData]
  );

  useEffect(() => {
    const processPaymentReturn = async () => {
      // ❌ Nếu đã xử lý callback, không xử lý lại nữa
      if (hasProcessedCallback.current) return;

      const params = new URLSearchParams(window.location.search);
      const status = params.get("status");
      const orderCode = params.get("orderCode") || params.get("exportCode");
      if (!status || !orderCode) return;

      hasProcessedCallback.current = true; // ✅ đánh dấu là đã xử lý

      const success = await handlePaymentCallback(orderCode, status);
      if (success) {
        params.delete("status");
        params.delete("orderCode");
        params.delete("exportCode");
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    };

    processPaymentReturn();
  }, [handlePaymentCallback]);

  const handleFeedbackSubmit = async () => {
    if (!userId || !testServiceId) {
      setFeedbackError("Thiếu thông tin người dùng hoặc dịch vụ");
      return;
    }
    if (rating === 0) {
      setFeedbackError("Vui lòng chọn số sao đánh giá");
      return;
    }

    setIsSubmittingFeedback(true);
    setFeedbackError(null);

    try {
      const res = await submitFeedbackApi({
        userId,
        testServiceId,
        rating,
        comment,
      });
      if (res.success) {
        setFeedbackSuccess("Gửi đánh giá thành công!");
        setRating(0);
        setComment("");
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      setFeedbackError(
        err instanceof Error ? err.message : "Lỗi khi gửi đánh giá"
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleSampleSubmitSuccess = async () => {
    console.log(
      "✅ Sample info submitted successfully, updating sample status"
    );
    setIsSampleModalOpen(false);
    // Update sample info status immediately
    setShouldShowSampleButton(false);
    setHasSampleInfo(true);
    // Also refresh booking data for any other changes
    await fetchBookingData();
  };

  const handleConfirmDelivery = async (bookingId: string) => {
    if (!bookingId) {
      console.error("Booking ID is required for confirm delivery");
      return;
    }

    setConfirmDeliveryLoading(true);
    try {
      const result = await confirmDeliveryApi(bookingId);

      // // Log chi tiết response từ API
      // console.log("📥 API Response:", {
      //   success: result.success,
      //   message: result.message,
      //   statusCode: result.statusCode,
      //   data: result.data,
      // });

      if (result.success) {

        // Save delivery confirmation status to localStorage
        const deliveryConfirmKey = `delivery_confirmed_${bookingId}`;
        localStorage.setItem(deliveryConfirmKey, "true");

        // Update local state immediately
        setIsDeliveryConfirmed(true);

        // Ngay lập tức gọi updateBookingStatusApi với newStatus=4 (WaitingForSample)
        try {
          console.log("🔄 Updating booking status to WaitingForSample (status 4)...");
          const statusUpdateResult = await updateBookingStatusApi(bookingId, 4);

          if (statusUpdateResult.success) {
            console.log("✅ Booking status updated to WaitingForSample successfully");
            
            // Refresh booking data to get updated status
            await fetchBookingData();
          } else {
            console.warn("⚠️ Failed to update booking status:", statusUpdateResult.message);
            // Vẫn hiển thị thành công cho user vì confirm delivery đã thành công
            // Chỉ log warning để không làm user bối rối
          }
        } catch (statusError) {
          console.error("❌ Error updating booking status:", statusError);
          // Không throw error ở đây vì confirm delivery đã thành công
          // Chỉ log error và tiếp tục
        }
      } else {
        throw new Error(result.message || "Failed to confirm delivery");
      }
    } catch (err) {
      console.error("❌ Error confirming delivery:", err);
      
      // Hiển thị thông báo thân thiện cho user
      let userFriendlyMessage = "Hệ thống chưa được cập nhật, vui lòng thử lại sau ít phút";
      
      // Kiểm tra các loại lỗi cụ thể
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();
        
        // Lỗi 400 Bad Request
        if (errorMessage.includes("400") || errorMessage.includes("bad request")) {
          userFriendlyMessage = "Hệ thống chưa được cập nhật, vui lòng thử lại sau ít phút";
        }
        // Lỗi 401 Unauthorized
        else if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
          userFriendlyMessage = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
        }
        // Lỗi 403 Forbidden
        else if (errorMessage.includes("403") || errorMessage.includes("forbidden")) {
          userFriendlyMessage = "Bạn không có quyền thực hiện thao tác này";
        }
        // Lỗi 404 Not Found
        else if (errorMessage.includes("404") || errorMessage.includes("not found")) {
          userFriendlyMessage = "Không tìm thấy thông tin đơn hàng";
        }
        // Lỗi 500 Server Error
        else if (errorMessage.includes("500") || errorMessage.includes("server error")) {
          userFriendlyMessage = "Hệ thống đang bảo trì, vui lòng thử lại sau";
        }
        // Lỗi network
        else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
          userFriendlyMessage = "Lỗi kết nối mạng, vui lòng kiểm tra internet và thử lại";
        }
      }
      
      // Không set error state chính để tránh trigger error boundary
      // Chỉ set error modal để hiển thị popup
      console.log('🚨 Setting error modal:', userFriendlyMessage);
      setErrorModalMessage(userFriendlyMessage);
      setIsErrorModalOpen(true);
    } finally {
      setConfirmDeliveryLoading(false);
    }
  };

  const handleConfirmCollection = async (dateTime: string) => {
    if (!bookingId) {
      console.error("Booking ID is required for confirm collection");
      return;
    }

    setCollectionLoading(true);
    try {
      // console.log(
      //   "🔄 Confirming collection for booking:",
      //   bookingId,
      //   "at:",
      //   dateTime
      // );
      const result = await confirmCollectionApi(bookingId, dateTime);

      if (result.success) {
        // Save collection confirmation status to localStorage
        const collectionConfirmKey = `collection_confirmed_${bookingId}`;
        localStorage.setItem(collectionConfirmKey, "true");

        // Update local state immediately
        setIsCollectionConfirmed(true);
        setIsCollectionModalOpen(false);

        // Refresh booking data to get updated status
        await fetchBookingData();
      } else {
        throw new Error(result.message || "Failed to confirm collection");
      }
    } catch (err) {
      console.error("❌ Error confirming collection:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi xác nhận lịch lấy mẫu";
      setError(errorMessage);
    } finally {
      setCollectionLoading(false);
    }
  };

  const handleStepAction = (payload: any) => {
    switch (payload?.type) {
      case "deposit":
      case "remaining":
        handlePayment(payload);
        break;
      case "fill_sample_info":
        setIsSampleModalOpen(true);
        break;
      case "confirmKitReceived":
        if (booking?.id) {
          handleConfirmDelivery(booking.id);
        } else {
          console.error("Không tìm thấy booking ID để xác nhận nhận Kit");
        }
        break;
      case "schedule_collection":
        setIsCollectionModalOpen(true);
        break;
      default:
        console.warn("Hành động không được hỗ trợ:", payload?.type);
    }
  };

  return {
    booking,
    progressData,
    isLoading,
    error,
    paymentLoading,
    paymentError,
    paymentStatus,
    userId,
    testServiceId,
    rating,
    setRating,
    comment,
    setComment,
    isSubmittingFeedback,
    feedbackSuccess,
    feedbackError,
    isSampleModalOpen,
    setIsSampleModalOpen,
    confirmDeliveryLoading,
    shouldShowSampleButton,
    isDeliveryConfirmed,
    isCollectionConfirmed,
    isCollectionModalOpen,
    setIsCollectionModalOpen,
    collectionLoading,
    isErrorModalOpen,
    setIsErrorModalOpen,
    errorModalMessage,
    getExistingFeedback,
    isCheckingFeedbackFor,
    handlePayment,
    handleFeedbackSubmit,
    handleSampleSubmitSuccess,
    handlePaymentCallback,
    handleStepAction,
    handleConfirmDelivery,
    handleConfirmCollection,
    navigate,
    refetchBookingData: fetchBookingData,
  };
};
