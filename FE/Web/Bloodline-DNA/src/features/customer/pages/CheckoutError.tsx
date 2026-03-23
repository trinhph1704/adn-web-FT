import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { XCircle, Home } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Header, Footer } from "../../../components";
import { callPaymentCallbackApi } from "../api/checkoutApi";
import { getBookingByIdApi } from "../api/bookingListApi";

const CheckoutError = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<{
    message: string;
    isSuccess: boolean;
    isLoading: boolean;
  }>({
    message: "",
    isSuccess: false,
    isLoading: true,
  });

  const getBookingIdFromStorage = (): string | null => {
    const paymentDataStr = localStorage.getItem("paymentData");
    if (!paymentDataStr) return null;
    try {
      const paymentData = JSON.parse(paymentDataStr);
      return paymentData.bookingId || null;
    } catch (error) {
      console.error("Error parsing paymentData:", error);
      return null;
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryOrderCode = query.get("orderCode");
    const queryAmount = query.get("amount");

    setOrderCode(queryOrderCode);
    setAmount(queryAmount);

    const storedBookingId = getBookingIdFromStorage();
    if (storedBookingId) {
      setBookingId(storedBookingId);
    }

    if (queryOrderCode && storedBookingId) {
      handlePaymentCallback(queryOrderCode, "FAILED", storedBookingId);
    } else {
      setUpdateStatus({
        isLoading: false,
        isSuccess: false,
        message: "Thiếu thông tin thanh toán để xử lý.",
      });
    }
  }, [location.search]);

  const handlePaymentCallback = async (
    orderCode: string,
    status: string,
    bookingId: string
  ) => {
    try {
      const response = await callPaymentCallbackApi({
        orderCode,
        status,
        bookingId,
      });

      if (response.success) {
        console.log("❌ Callback handled for FAILED status");

        // Optional: xác minh trạng thái thật sự (nếu muốn)
        const bookingData = await getBookingByIdApi(bookingId);
        const normalizedStatus = (bookingData?.status || "").toUpperCase();
        const isFailed = normalizedStatus === "FAILED" || normalizedStatus === "CANCELLED";

        if (isFailed) {
          setUpdateStatus({
            isLoading: false,
            isSuccess: false,
            message: "Đã ghi nhận thanh toán thất bại.",
          });
        } else {
          setUpdateStatus({
            isLoading: false,
            isSuccess: false,
            message: "Thanh toán thất bại chưa được ghi nhận đúng.",
          });
        }

        localStorage.removeItem("paymentData");
      } else {
        setUpdateStatus({
          isLoading: false,
          isSuccess: false,
          message: "Lỗi callback: " + response.error,
        });
      }
    } catch (error) {
      console.error("❌ Callback exception:", error);
      setUpdateStatus({
        isLoading: false,
        isSuccess: false,
        message: "Có lỗi xảy ra khi xác nhận thanh toán.",
      });
    }
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return "N/A";
    const numberValue = parseInt(value, 10);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numberValue);
  };

  if (updateStatus.isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Đang xử lý thanh toán thất bại...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="w-full min-h-[60vh] py-10 px-4 flex items-center justify-center bg-blue-50">
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-2xl border-none">
              <div className="p-6 sm:p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-red-50 inline-flex items-center justify-center mb-4">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-red-800 m-0">
                  Xác nhận thanh toán thất bại
                </h2>
              </div>

              <div className="px-6 sm:px-8 pb-8">
                <div className="p-4 sm:p-6 mb-6 rounded-xl space-y-4 bg-red-50/50">
                  <div className="flex justify-between items-center">
                    <p className="text-slate-600">Mã đơn hàng:</p>
                    <p className="font-bold text-slate-800">{orderCode || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-600">Trạng thái:</p>
                    <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                      Thất bại
                    </span>
                  </div>
                  {amount && (
                    <div className="flex justify-between items-center">
                      <p className="text-slate-600">Số tiền:</p>
                      <p className="font-bold text-lg text-red-600">
                        {formatCurrency(amount)}
                      </p>
                    </div>
                  )}
                  {bookingId && (
                    <div className="flex justify-between items-center">
                      <p className="text-slate-600">Mã booking:</p>
                      <p className="font-mono text-sm text-slate-700">{bookingId}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => navigate("/")}
                    className="h-11 px-6 text-base rounded-lg bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Về trang chủ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutError;
