import { formatDate } from '@fullcalendar/core';
import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Loading } from '../../../components';
import { getTestBookingApi } from '../api/testBookingApi';
import Calendar from '../components/common/Calendar';
import type { TestBookingResponse } from '../types/testBooking';

function TestBooking() {
  const [bookings, setBookings] = useState<TestBookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define fetchBookings outside useEffect
  const fetchBookings = async () => {
    try {
      const response = await getTestBookingApi();
      console.log("fetchBookings 1 12", response)

      if (!Array.isArray(response)) {
        console.error('Dữ liệu không phải mảng:', response);
        throw new Error('Dữ liệu trả về không hợp lệ');
      }

      setBookings(response);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Hàm đếm booking theo ngày, dùng định dạng DD/MM/YYYY để khớp với Calendar
  const countBookingsByDate = (bookings: TestBookingResponse[]) => {
    const counts: Record<string, number> = {};

    bookings.forEach((booking) => {
      try {
        const date = new Date(booking.appointmentDate);
        if (!isNaN(date.getTime())) {
          const dateStr = formatDate(date, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          counts[dateStr] = (counts[dateStr] || 0) + 1;
        }
      } catch {
        console.warn('Invalid booking date:', booking.appointmentDate);
      }
    });

    return counts;
  };

  const bookingsByDate = countBookingsByDate(bookings);

  const handleUpdateStatus = (updatedBooking: TestBookingResponse) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
  };

  return (
    <div className="h-screen bg-blue-50">
      <div className="flex h-[8.4%] items-center justify-between bg-white px-5">
        <li className="text-lg text-[#1F2B6C]">
          Quản lí đơn xét nghiệm
        </li>
        <div className="rounded-full bg-blue-200 p-3 text-base text-[#1F2B6C]">
          <FaBell />
        </div>
      </div>
      <div className="h-[92%]">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
              <Loading message="Đang tải danh sách đơn xét nghiệm..." />
          </div>
        ) : (
          <Calendar
            events={bookings}
            onUpdateStatus={handleUpdateStatus}
            bookingsByDate={bookingsByDate}
            refetchBookings={fetchBookings}
          />
        )}
      </div>
    </div>
  );
}

export default TestBooking;