import { CheckCircle, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer, Header } from "../../../components";
import { getBookingByIdApi } from "../api/bookingListApi";
import { callPaymentCallbackApi } from "../api/checkoutApi";
import { Button } from "../components/ui/Button";

const CheckoutSuccess = () => {
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

  // ✅ Hàm lấy bookingId từ localStorage (giống trang CheckoutError)
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
  const queryStatus = query.get("status")?.toUpperCase();

  setOrderCode(queryOrderCode);
  setAmount(queryAmount);

  const storedBookingId = getBookingIdFromStorage();
  if (storedBookingId) {
    setBookingId(storedBookingId);
  }

  const normalizedStatus = queryStatus === "PAID" ? "PAID" : "CANCELLED";

  // console.log("CheckoutSuccess mounted with:", {
  //   orderCode: queryOrderCode,
  //   amount: queryAmount,
  //   bookingId: storedBookingId,
  //   status: normalizedStatus,
  //   timestamp: new Date().toISOString(),
  // });

  if (queryOrderCode && storedBookingId) {
    handlePaymentCallback(queryOrderCode, normalizedStatus, storedBookingId);
  } else {
    setUpdateStatus({
      isLoading: false,
      isSuccess: false,
      message: "Thiếu thông tin thanh toán để xác nhận.",
    });
  }
}, [location.search]);


  const handlePaymentCallback = async (
  orderCode: string,
  status: string,
  bookingId: string
) => {
  try {
    await callPaymentCallbackApi({
      orderCode,
      status,
      bookingId,
    });

    // 👉 Dù callback trả về lỗi, vẫn kiểm tra lại trạng thái thật từ backend
    const bookingData = await getBookingByIdApi(bookingId);
    const normalizedStatus = (bookingData?.status || "").toUpperCase();
    const isPaid = normalizedStatus === "PAID" || normalizedStatus === "SUCCESS" || normalizedStatus === "PREPARINGKIT" || normalizedStatus === "CANCELLED";

    if (isPaid) {
      setUpdateStatus({
        isLoading: false,
        isSuccess: true,
        message: "Đã xác nhận thanh toán thành công.",
      });
    } else {
      setUpdateStatus({
        isLoading: false,
        isSuccess: false,
        message: "Thanh toán chưa được ghi nhận thành công.",
      });
    }

    localStorage.removeItem("paymentData");
  } catch (err) {
    console.error("❌ Callback exception:", err);
    setUpdateStatus({
      isLoading: false,
      isSuccess: false,
      message: "Lỗi khi xác nhận thanh toán.",
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
        <main className="flex items-center justify-center flex-grow">
          <div className="py-20 text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-t-2 border-b-2 border-teal-600 rounded-full animate-spin"></div>
            <p className="text-lg text-gray-700">Đang xác nhận thanh toán...</p>
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
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white border-none shadow-2xl rounded-2xl">
              <div className="p-6 text-center sm:p-8">
                {updateStatus.isSuccess ? (
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-green-50">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="m-0 text-3xl font-bold text-teal-800">
                      Thanh toán thành công!
                    </h2>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-red-50">
                      <CheckCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="m-0 text-3xl font-bold text-red-800">
                      Xác nhận thanh toán thất bại
                    </h2>
                  </>
                )}
              </div>

              <div className="px-6 pb-8 sm:px-8">
                <div
                  className={`p-4 sm:p-6 mb-6 rounded-xl space-y-4 ${
                    updateStatus.isSuccess ? "bg-green-50/50" : "bg-red-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600">Mã đơn hàng:</p>
                    <p className="font-bold text-slate-800">{orderCode || "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600">Trạng thái:</p>
                    <span
                      className={`${
                        updateStatus.isSuccess
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } text-sm font-semibold px-3 py-1 rounded-full`}
                    >
                      {updateStatus.isSuccess ? "Đã thanh toán" : "Thất bại"}
                    </span>
                  </div>
                  {amount && (
                    <div className="flex items-center justify-between">
                      <p className="text-slate-600">Số tiền:</p>
                      <p
                        className={`font-bold text-lg ${
                          updateStatus.isSuccess ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(amount)}
                      </p>
                    </div>
                  )}
                  {bookingId && (
                    <div className="flex items-center justify-between">
                      <p className="text-slate-600">Mã booking:</p>
                      <p className="font-mono text-sm text-slate-700">{bookingId}</p>
                    </div>
                  )}
                </div>

                {updateStatus.message && (
                  <p
                    className={`text-center text-sm mb-6 ${
                      updateStatus.isSuccess ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {updateStatus.message}
                  </p>
                )}

                <div className="flex justify-center">
                  <Button
                    onClick={() => navigate("/customer/booking-list")}
                    className={`h-11 px-6 text-base rounded-lg ${
                      updateStatus.isSuccess
                        ? "bg-teal-600 hover:bg-teal-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white`}
                  >
                    <Home className="w-4 h-4 mr-2 text-white" />
                    Xem chi tiết
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

export default CheckoutSuccess;