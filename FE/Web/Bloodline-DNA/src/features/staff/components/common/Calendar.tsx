import { type DateSelectArg } from '@fullcalendar/core';
import viLocale from '@fullcalendar/core/locales/vi';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { TestBookingResponse } from '../../types/testBooking';
import BookingListPanel from '../booking/common/BookingListPanel';
import BookingTable from '../booking/common/BookingTable';
import { STATUS_MAPPING, type StatusOption } from '../booking/constants/statusMapping';
import { getValidDate, renderCollectionMethod } from '../booking/utils/statusUtils';

interface CalendarComponentProps {
  bookingsByDate?: Record<string, number>;
  events: TestBookingResponse[];
  onUpdateStatus?: (updatedBooking: TestBookingResponse) => void;
  refetchBookings: () => Promise<void>; // Callback to refetch bookings after status update
}

function formatToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const Calendar: React.FC<CalendarComponentProps> = ({
  events,
  bookingsByDate,
  // onUpdateStatus,
  refetchBookings
}) => {
  const today = formatToYYYYMMDD(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(today);
  const [localEvents, setLocalEvents] = useState<TestBookingResponse[]>([]);
  const [statusOptions] = useState<StatusOption[]>(STATUS_MAPPING);
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, string>>({});
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    setLocalEvents(events);
    setSelectedDay(today);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(new Date());
    }
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = formatToYYYYMMDD(new Date());
      if (now !== selectedDay) {
        setSelectedDay(now);
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.gotoDate(new Date());
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedDay]);

  const calendarEvents = useMemo(() => {
    return localEvents.map((booking) => ({
      id: booking.id,
      start: new Date(formatToYYYYMMDD(new Date(booking.appointmentDate)) + 'T00:00:00'),
      title: booking.clientName || 'Không có',
      extendedProps: {
        status: booking.status,
        collectionMethod: booking.collectionMethod,
      },
    }));
  }, [localEvents]);

  const filteredBookings = useMemo(() => {
    return localEvents.filter((booking) => {
      const appointmentDate = getValidDate(booking.appointmentDate);
      const formattedBookingDate = formatToYYYYMMDD(appointmentDate);
      return formattedBookingDate === selectedDay;
    });
  }, [localEvents, selectedDay]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDate = formatToYYYYMMDD(selectInfo.start);
    setSelectedDay(selectedDate);
  };

  return (
    <div className="relative flex items-start justify-start w-full h-full px-2 py-2 bg-blue-50">
      <ToastContainer />
      <div className="flex flex-col w-2/3 h-full p-5 mr-2 text-xs bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <FullCalendar
            ref={calendarRef}
            height={400}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            initialDate={new Date()}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateSelect}
            events={calendarEvents}
            locale={viLocale}
            eventContent={(eventInfo) => (
              <div className="custom-event h-fit w-fit">
                <div className="font-semibold text-blue-600 truncate event-title">
                  {eventInfo.event.title}
                </div>
                <div className="text-xs event-time">
                  {renderCollectionMethod(eventInfo.event.extendedProps.collectionMethod)}
                </div>
              </div>
            )}
            dayCellContent={(dayInfo) => {
              const formattedDate = formatToYYYYMMDD(dayInfo.date);
              const bookingCount = bookingsByDate ? bookingsByDate[formattedDate] || 0 : 0;
              return (
                <div className="relative">
                  <div>{dayInfo.dayNumberText}</div>
                  {bookingCount > 0 && (
                    <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-blue-600 rounded-full">
                      {bookingCount}
                    </div>
                  )}
                </div>
              );
            }}
            dayCellClassNames={({ date }) => {
              const formattedDate = formatToYYYYMMDD(date);
              if (formattedDate === today) return 'bg-blue-200';
              if (formattedDate === selectedDay) return 'bg-orange-200 text-orange-400';
              return localEvents.some((booking) => {
                const appointmentDate = getValidDate(booking.appointmentDate);
                return formatToYYYYMMDD(appointmentDate) === formattedDate;
              })
                ? 'bg-blue-50 text-blue-700'
                : '';
            }}
          />
        </div>
        <BookingTable
          selectedDay={selectedDay}
          filteredBookings={filteredBookings}
          selectedStatuses={selectedStatuses}
          statusOptions={statusOptions}
          setSelectedStatuses={setSelectedStatuses}
          setFilteredBookings={setLocalEvents}
          refetchBookings={refetchBookings}
        />

      </div>
      <div className="flex flex-col w-1/3 h-full bg-white rounded-lg shadow-lg">
        <BookingListPanel
          selectedDay={selectedDay}
          bookings={filteredBookings}
          statusOptions={statusOptions.map((option) => option.label)}
        />
      </div>
    </div>
  );
};

export default Calendar;
