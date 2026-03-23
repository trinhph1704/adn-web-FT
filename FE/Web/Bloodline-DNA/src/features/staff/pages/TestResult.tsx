import { useEffect, useState } from "react";
import { Loading } from "../../../components";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../staff/components/sample/ui/card";
import { getTestBookingApi } from "../api/testBookingApi";
import {
  createTestResultApi,
  getAllTestResultApi
} from "../api/testResultApi";
import { Button } from "../components/sample/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/sample/ui/table";
import ModalTestResult from "../components/testResult/ModalTestResult";
import ModalTestResultDetail from "../components/testResult/ModalTestResultDetail";
import type { TestBookingResponse } from "../types/testBooking";
import type {
  TestResultRequest,
  TestResultResponse,
} from "../types/testResult";

interface BookingOption {
  id: string;
  clientName: string;
  email: string;
  appointmentDate: string;
  status: string;
}
interface FormState {
  TestBookingId: string;
  ResultSummary: string;
  ResultDate: string;
  ResultFile: File | null;
}

function TestResultPage() {
  const [results, setResults] = useState<TestResultResponse[]>([]);
  const [selectedResult, setSelectedResult] = useState<TestResultResponse | null>(null);
  const [bookings, setBookings] = useState<BookingOption[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [form, setForm] = useState<FormState>({
    TestBookingId: "",
    ResultSummary: "",
    ResultDate: "",
    ResultFile: null,
  });

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchResults = async () => {
      if (!token) return;
      setIsLoadingResults(true);
      try {
        const data = await getAllTestResultApi(token);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsLoadingResults(false);
      }
    };
    fetchResults();
  }, [token]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      setIsLoadingBookings(true);
      try {
        const bookingData = await getTestBookingApi();
        const bookingOptions: BookingOption[] = bookingData.map(
          (booking: TestBookingResponse) => ({
            id: booking.id,
            clientName: booking.clientName,
            email: booking.email,
            appointmentDate: booking.appointmentDate,
            status: booking.status,
          })
        );
        setBookings(bookingOptions);
      } catch {
        setBookings([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [token]);

  const openCreateModal = () => {
    setForm({
      TestBookingId: "",
      ResultSummary: "",
      ResultDate: "",
      ResultFile: null,
    });
    setShowModal(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (file: File | null) => {
    setForm({ ...form, ResultFile: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setNotification({ type: "error", message: "Không tìm thấy token xác thực!" });
      return;
    }

    if (!form.ResultFile) {
      setNotification({ type: "error", message: "Vui lòng chọn file kết quả!" });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (form.ResultFile.size > maxSize) {
      setNotification({ type: "error", message: "File quá lớn! Vui lòng chọn file dưới 10MB." });
      return;
    }

    const req: TestResultRequest = {
      TestBookingId: form.TestBookingId,
      ResultSummary: form.ResultSummary,
      ResultDate: new Date(form.ResultDate),
      ResultFile: form.ResultFile,
    };

    setIsSubmitting(true);
    try {
      await createTestResultApi(req, token);
      const updatedResults = await getAllTestResultApi(token);
      setResults(updatedResults);
      setShowModal(false);
      setForm({
        TestBookingId: "",
        ResultSummary: "",
        ResultDate: "",
        ResultFile: null,
      });
      setNotification({ type: "success", message: "Tạo kết quả thành công!" });
    } catch (error) {
      console.error("Lỗi tạo kết quả:", error);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi tạo kết quả!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-between">
        <div className="w-full h-17 px-5 bg-white flex items-center text-lg text-[#1F2B6C] before:content-['•'] before:mr-4">
          Quản lý kết quả xét nghiệm
        </div>
      </div>
      <div className="p-2 mx-auto max-w-7xl">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <div className="flex flex-row justify-between">
            <div className="w-full">
              <CardHeader>
                <CardTitle className="text-[#1F2B6C]">
                  Danh sách kết quả xét nghiệm
                </CardTitle>
              </CardHeader>
            </div>
            <div className="pr-6 cursor-pointer">
              <Button
                className="flex items-center gap-2 text-white bg-green-300 cursor-pointer hover:bg-green-400"
                onClick={openCreateModal}
              >
                <span className="text-sm text-green-950">+ Thêm kết quả</span>
              </Button>
            </div>
          </div>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Mã đặt xét nghiệm</TableHead>
                  <TableHead className="text-center">Tóm tắt kết quả</TableHead>
                  <TableHead className="text-center">Ngày trả</TableHead>
                  <TableHead className="text-center">File kết quả</TableHead>
                  <TableHead className="text-center">Khách hàng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingResults ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="flex items-center justify-center py-10">
                        <Loading message="Đang tải danh sách kết quả xét nghiệm..." />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="text-gray-500">Chưa có kết quả nào</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((result, idx) => (
                    <TableRow
                      key={result.id || idx}
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => setSelectedResult(result)}
                    >
                      <TableCell className="font-mono text-xs text-center">
                        <span className="px-2 py-1 text-green-700 bg-green-100 rounded">
                          {result.testBookingId}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs text-left truncate">
                        {result.resultSummary}
                      </TableCell>
                      <TableCell className="text-sm text-center">
                        {result.resultDate
                          ? new Date(result.resultDate).toLocaleDateString("vi-VN")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.resultFileUrl ? (
                          <a
                            href={result.resultFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 underline hover:text-blue-800"
                          >
                            Xem file
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Chưa có file</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-center">
                        {result.client?.fullName || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ModalTestResult
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleChange}
        onFileChange={handleFileChange}
        bookingOptions={bookings}
        isLoadingBookings={isLoadingBookings}
        isSubmitting={isSubmitting}
      />

      <ModalTestResultDetail
        show={!!selectedResult}
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />

      {/* ✅ Notification Modal */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
            <h2
              className={`text-lg font-semibold mb-4 ${notification.type === "success" ? "text-green-700" : "text-red-700"
                }`}
            >
              {notification.type === "success" ? "Thành công" : "Lỗi"}
            </h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {notification.message}
            </p>
            <div className="flex justify-end mt-6">
              <button
                style={{ color: "white" }}
                onClick={() => setNotification(null)}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestResultPage;
