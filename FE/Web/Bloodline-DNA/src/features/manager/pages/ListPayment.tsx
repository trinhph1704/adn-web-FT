import {
  CalendarOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DollarOutlined,
  InfoCircleOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { message, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Loading } from "../../../components";
import { getPaidPayments, type Payment, } from "../api/payment";

const PRIMARY_COLOR = "#1F2B6C";

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    })
    : "Không rõ";

const formatCurrency = (amount?: number) =>
  amount?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  }) ?? "0 ₫";

const getStatusTag = (status?: string) => {
  switch (status) {
    case "Paid":
      return (
        <Tag icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} color="success">
          Đã thanh toán
        </Tag>
      );
    case "Failed":
      return (
        <Tag icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />} color="error">
          Thất bại
        </Tag>
      );
    case "Pending":
    default:
      return (
        <Tag color="warning">
          Chờ xử lý
        </Tag>
      );
  }
};

const getBookingStatusTag = (status?: string) => {
  if (!status) return null;
  const map: Record<string, string> = {
    DeliveringKit: "Đang giao bộ kit",
    SampleReceived: "Đã nhận mẫu",
    Testing: "Đang xét nghiệm",
    Completed: "Hoàn tất",
  };
  return <Tag color="processing">{map[status] ?? status}</Tag>;
};

const ListPayment: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPaidPayments(token);
        setPayments(data);
      } catch (err: any) {
        console.error(err);
        message.error(err.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen p-2 pt-5 overflow-hidden bg-blue-50">
      <h1
        className="my-10 text-xl font-extrabold tracking-tight text-center drop-shadow-md"
        style={{ color: PRIMARY_COLOR }}
      >
        Danh Sách Giao Dịch Thanh Toán
      </h1>

      {loading ? (
        <div className="flex items-center justify-center h-[550px]">
          <Loading message="Đang tải danh sách lịch sử giao dịch..." />
        </div>
      ) : payments.length === 0 ? (
        <p className="mt-16 text-lg text-center text-gray-500">
          Không có giao dịch nào.
        </p>
      ) : (
        <div className="max-h-[90vh] overflow-auto rounded-2xl border border-blue-200 shadow-lg bg-white">
          <div className="min-w-[1200px] overflow-x-auto">
            <table className="w-full text-sm divide-y divide-gray-200">
              <thead className="bg-[#dfe9f8] text-[#1F2B6C] text-xs font-semibold uppercase sticky top-0 z-10">
                <tr>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Mã đơn</th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Khách hàng </th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Email</th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Dịch vụ</th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Ngày hẹn</th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Tiền cọc</th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Còn lại</th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Tổng tiền</th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Lấy mẫu</th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Trạng thái</th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center ">Lịch hẹn</th>
                  <th style={{ fontSize: "11px" }} className="py-3 text-center "></th>
                </tr>
              </thead>
              <tbody className="text-xs text-gray-700 divide-y divide-gray-100">
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    className="transition duration-150 ease-in-out hover:bg-blue-100/40"
                  >
                    <td className="px-4 py-3 font-medium text-[#1F2B6C]">{p.orderCode}</td>
                    <td className="flex items-center gap-2 px-4 py-3">
                      <UserOutlined style={{ color: PRIMARY_COLOR }} />
                      {p.user?.fullName ?? "Không rõ"}
                    </td>
                    <td className="px-4 py-3">
                      <MailOutlined className="mr-1" style={{ color: PRIMARY_COLOR }} />
                      {p.user?.email ?? "Không rõ"}
                    </td>
                    <td className="px-4 py-3">{p.booking?.testService?.name ?? "Không rõ"}</td>
                    <td className="px-4 py-3">
                      <CalendarOutlined className="mr-1" style={{ color: PRIMARY_COLOR }} />
                      {formatDate(p.booking?.appointmentDate)}
                    </td>
                    <td className="px-4 py-3">{formatCurrency(p.depositAmount)}</td>
                    <td className="px-4 py-3">{formatCurrency(p.remainingAmount)}</td>
                    <td className="px-4 py-3 font-bold text-[#1F2B6C]">
                      <DollarOutlined className="mr-1" />
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-4 py-3">
                      {p.booking?.collectionMethod === "SelfSample"
                        ? "Tại nhà"
                        : p.booking?.collectionMethod === "AtFacility"
                          ? "Tại phòng khám"
                          : "Không rõ"}
                    </td>
                    <td className="">{getStatusTag(p.status)}</td>
                    <td className="py-3 pl-2 text-center">{getBookingStatusTag(p.booking?.status)}</td>
                    <td className="px-3 py-3">
                      <Tooltip title={p.description || "Không có ghi chú"}>
                        <InfoCircleOutlined style={{ color: PRIMARY_COLOR }} />
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPayment;
