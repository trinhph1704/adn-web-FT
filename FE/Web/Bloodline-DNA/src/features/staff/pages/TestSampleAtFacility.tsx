import { Button } from "antd";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loading } from "../../../components";
import { getTestBookingApi } from "../api/testBookingApi";
import { STATUS_COLOR_AtFacility, STATUS_LABEL_MAP } from "../components/booking/utils/statusmapping";
import { statusToNumber } from "../components/booking/utils/statusUtils";
import { Card, CardContent } from "../components/sample/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/sample/ui/table";
import TestSampleModal from "../components/testSample/TestSampleModal";

export default function TestSampleAtFacility() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [createdSamplesCount, setCreatedSamplesCount] = useState(0);
  const [maxSamplesReached, setMaxSamplesReached] = useState(false);
  const [existingDonorNames, setExistingDonorNames] = useState<string[]>([]);
  const token = localStorage.getItem("token") || "";

  const fetchData = useCallback(async () => {
    if (!token) {
      toast.error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn!");
      return;
    }
    setLoading(true);
    try {
      const res = await getTestBookingApi();
      const filtered = res.filter((b: any) =>
        b.collectionMethod === "AtFacility" &&
        (b.status === "CheckIn" || b.status === "StaffGettingSample")
      );
      setBookings(filtered);

      // Lấy danh sách tên người cho mẫu đã tồn tại
      const donorNames = filtered.flatMap((b: any) =>
        b.samples?.map((s: any) => s.donorName) || []
      );
      setExistingDonorNames(donorNames.filter(Boolean));
    } catch {
      toast.error("Không thể tải dữ liệu booking");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSampleCreated = () => {
    const newCount = createdSamplesCount + 1;
    setCreatedSamplesCount(newCount);
    if (newCount >= 2) {
      setMaxSamplesReached(true);
      toast.warning("Bạn đã tạo đủ 2 mẫu, không thể tạo thêm");
    }
    fetchData(); // Refresh data để cập nhật danh sách tên
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-blue-50">
      <TestSampleModal
        open={open}
        onClose={() => setOpen(false)}
        bookingId={selectedBookingId}
        onSampleCreated={handleSampleCreated}
        existingDonorNames={existingDonorNames}
      />

      <div className="flex items-center justify-between flex-shrink-0">
        <li className="text-lg w-full bg-white p-5 text-[#1F2B6C]">
          Quản lý booking lấy mẫu tại Cơ sở
        </li>
      </div>

      <div className="flex-1 p-2 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        <Card className="flex flex-col h-full shadow-lg">
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                  <TableRow className="[&_th]:font-bold [&_th]:py-3">
                    <TableHead className="text-center">Mã Booking #</TableHead>
                    <TableHead className="text-center">Khách hàng</TableHead>
                    <TableHead className="text-center">Số điện thoại</TableHead>
                    <TableHead className="text-center">Địa chỉ</TableHead>
                    <TableHead className="text-center">Ngày hẹn</TableHead>
                    <TableHead className="text-center">Giá</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Ghi chú</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-6 text-center text-blue-500">
                        <div className="flex items-center justify-center h-[550px]">
                          <Loading message="Đang tải danh sách booking..." />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-6 text-center text-gray-400">
                        Không có booking nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="text-xs text-center">{item.id}</TableCell>
                        <TableCell className="text-xs text-center">{item.clientName}</TableCell>
                        <TableCell className="text-xs text-center">{item.phone || "-"}</TableCell>
                        <TableCell className="text-xs text-center">{item.address || "-"}</TableCell>
                        <TableCell className="text-xs text-center">{format(new Date(item.appointmentDate), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-xs text-center">{item.price?.toLocaleString("vi-VN")}</TableCell>
                        <TableCell className="text-xs text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium inline-block 
                              ${STATUS_COLOR_AtFacility[item.status] || "bg-gray-100 text-gray-700"}`}
                          >
                            {STATUS_LABEL_MAP[statusToNumber(item.status)] || item.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-center">{item.note || "-"}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            style={{ fontSize: "12px", padding: "2px 8px" }}
                            size="small"
                            className="text-[10px] text-white bg-blue-600 hover:bg-blue-800"
                            onClick={() => {
                              if (maxSamplesReached) {
                                toast.error("Bạn đã tạo đủ 2 mẫu, không thể tạo thêm");
                                return;
                              }
                              setSelectedBookingId(item.id);
                              setOpen(true);
                            }}
                            disabled={maxSamplesReached}
                          >
                            Thêm mẫu +
                            {maxSamplesReached && " (Đạt giới hạn)"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}