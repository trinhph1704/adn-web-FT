// components/BookingTable.tsx
import React, { useState } from "react";
import { BsCalendarXFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { updateTestBookingStatusApi } from "../../../api/testBookingApi";
import type { TestBookingResponse } from "../../../types/testBooking";
import { STATUS_MAPPING, type StatusOption } from "../constants/statusMapping";
import { getStatusLabel, renderCollectionMethod } from "../utils/statusUtils";
import StatusSelect from "./StatusSelect";

interface BookingTableProps {
  selectedDay: string;
  filteredBookings: TestBookingResponse[];
  selectedStatuses: Record<string, string>;
  statusOptions: StatusOption[];
  setSelectedStatuses: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  setFilteredBookings: React.Dispatch<
    React.SetStateAction<TestBookingResponse[]>
  >;
  refetchBookings: () => Promise<void>;
}

const BookingTable: React.FC<BookingTableProps> = ({
  selectedDay,
  filteredBookings,
  selectedStatuses,
  statusOptions,
  setSelectedStatuses,
  refetchBookings,
}) => {
  const [loadingBookings, setLoadingBookings] = useState<Set<string>>(
    new Set()
  );

  const handleClickUpdate = async (bookingId: string) => {
    const newStatusLabel = selectedStatuses[bookingId];
    const statusOption = statusOptions.find((s) => s.label === newStatusLabel);
    if (!statusOption) {
      toast.error("Trạng thái không hợp lệ");
      return;
    }

    setLoadingBookings((prev) => new Set(prev).add(bookingId));
    try {
      await updateTestBookingStatusApi(
        { bookingId, status: statusOption.value }
      );
      await refetchBookings();

      setSelectedStatuses((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });

      toast.success(`Đã cập nhật trạng thái thành: ${newStatusLabel}`);
    } catch {
      toast.error("Cập nhật trạng thái thất bại");
    } finally {
      setLoadingBookings((prev) => {
        const next = new Set(prev);
        next.delete(bookingId);
        return next;
      });
    }
  };

  const getAvailableStatusOptions = (
    collectionMethod: string
  ): (StatusOption & { disabled?: boolean })[] => {
    if (collectionMethod === "SelfSample") {
      return STATUS_MAPPING.map((option) => ({
        ...option,
        disabled: option.value !== 2 && option.value !== 3,
      }));
    }

    if (collectionMethod === "AtFacility") {
      // Chỉ cho phép 3 status cho phương thức "Tại cơ sở":
      // 11: Đã check-in
      // 7: Đang xét nghiệm
      // 8: Hoàn tất
      const allowedStatuses = [11, 7, 8];
      return STATUS_MAPPING.map((option) => ({
        ...option,
        disabled: !allowedStatuses.includes(option.value),
      }));
    }

    // default: không disable gì cả
    return STATUS_MAPPING.map((option) => ({
      ...option,
      disabled: false,
    }));
  };

  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="pb-1 mb-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">
        Lịch hẹn trong ngày {selectedDay}
      </div>
      {sortedBookings.length === 0 ? (
        <div className="flex flex-col items-center py-8 italic text-center">
          <BsCalendarXFill className="mb-4 text-6xl text-gray-200" />
          <div className="mt-2 text-gray-400">Không có lịch hẹn</div>
        </div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-blue-700 bg-blue-50">
              <th className="px-2 py-2 text-left">Khách hàng</th>
              <th className="px-2 py-2 text-left">Giờ</th>
              <th className="px-2 py-2 text-left">Phương thức</th>
              <th className="px-2 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((booking) => {
              const currentStatusLabel = getStatusLabel(booking.status);
              const isLoading = loadingBookings.has(booking.id);
              const collectionMethod = booking.collectionMethod;
              const options = getAvailableStatusOptions(collectionMethod);

              if (!selectedStatuses[booking.id]) {
                setSelectedStatuses((prev) => ({
                  ...prev,
                  [booking.id]: currentStatusLabel,
                }));
              }

              return (
                <tr key={booking.id} className="border-b">
                  <td className="px-2 py-1">
                    {booking.clientName || "Không có tên"}
                  </td>
                  <td className="px-2 py-1">
                    {new Date(booking.appointmentDate).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-2 py-1">
                    {renderCollectionMethod(collectionMethod)}
                  </td>
                  <td className="flex items-center gap-2 px-2 py-1">
                    <StatusSelect
                      style={{ minWidth: 100, fontSize: 12 }}
                      value={selectedStatuses[booking.id] || currentStatusLabel}
                      options={options}
                      onChange={(value) =>
                        setSelectedStatuses((prev) => ({
                          ...prev,
                          [booking.id]: value,
                        }))
                      }
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => handleClickUpdate(booking.id)}
                      disabled={
                        isLoading ||
                        !selectedStatuses[booking.id] ||
                        selectedStatuses[booking.id] === currentStatusLabel
                      }
                      className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 shadow-md
                      ${
                        isLoading ||
                        !selectedStatuses[booking.id] ||
                        selectedStatuses[booking.id] === currentStatusLabel
                          ? "bg-gray-400 text-gray-500 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600 active:bg-green-700"
                      }`}
                      title="Cập nhật trạng thái"
                    >
                      {isLoading ? (
                        <svg
                          className="w-4 h-4 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      ) : (
                        <FaCheck className="w-3 h-3 text-white" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingTable;
