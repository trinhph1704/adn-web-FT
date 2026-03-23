import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, BookingStatus } from '@/types';
import { sendBookingStatusEmail } from '@/lib/email';

interface RouteContext { params: Promise<{ id: string }>; }

const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.Pending]: [BookingStatus.DepositPaid, BookingStatus.Cancelled],
  [BookingStatus.DepositPaid]: [BookingStatus.KitDelivering, BookingStatus.Cancelled],
  [BookingStatus.KitDelivering]: [BookingStatus.KitDelivered, BookingStatus.Cancelled],
  [BookingStatus.KitDelivered]: [BookingStatus.SampleCollected, BookingStatus.Cancelled],
  [BookingStatus.SampleCollected]: [BookingStatus.SampleDelivering, BookingStatus.Cancelled],
  [BookingStatus.SampleDelivering]: [BookingStatus.SampleReceived, BookingStatus.Cancelled],
  [BookingStatus.SampleReceived]: [BookingStatus.Testing, BookingStatus.Cancelled],
  [BookingStatus.Testing]: [BookingStatus.ResultReady, BookingStatus.Cancelled],
  [BookingStatus.ResultReady]: [BookingStatus.FullyPaid, BookingStatus.Cancelled],
  [BookingStatus.FullyPaid]: [BookingStatus.Completed],
  [BookingStatus.Completed]: [],
  [BookingStatus.Cancelled]: [],
};

const EMAIL_WORTHY_STATUSES: BookingStatus[] = [
  BookingStatus.DepositPaid,
  BookingStatus.KitDelivering,
  BookingStatus.KitDelivered,
  BookingStatus.SampleReceived,
  BookingStatus.Testing,
  BookingStatus.ResultReady,
  BookingStatus.Completed,
  BookingStatus.Cancelled,
];

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    if (!['Staff', 'Manager', 'Admin'].includes(payload.role)) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền thực hiện', statusCode: 403 }, { status: 403 });
    }

    const { id } = await context.params;
    const body: { status: BookingStatus } = await request.json();
    if (body.status === undefined) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Trạng thái không được để trống', statusCode: 400 }, { status: 400 });

    const { data: booking, error } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', id).single();
    if (error || !booking) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });

    const currentStatus = booking.status as BookingStatus;
    const newStatus = body.status;
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus];
    if (!allowedTransitions?.includes(newStatus)) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: `Không thể chuyển từ trạng thái ${currentStatus} sang ${newStatus}`, statusCode: 400 }, { status: 400 });
    }

    await supabaseAdmin.from(TABLES.testBookings).update({ status: newStatus }).eq('id', id);

    if (EMAIL_WORTHY_STATUSES.includes(newStatus) && booking.clientId) {
      try {
        const { data: client } = await supabaseAdmin.from(TABLES.users).select('email,fullName').eq('id', booking.clientId).single();
        let serviceName = 'Xét nghiệm ADN';
        if (booking.testServiceId) {
          const { data: service } = await supabaseAdmin.from(TABLES.testServices).select('name').eq('id', booking.testServiceId).single();
          if (service) serviceName = service.name;
        }
        if (client?.email) {
          await sendBookingStatusEmail(client.email, client.fullName || booking.clientName || '', id, serviceName, newStatus);
        }
      } catch (emailError) {
        console.error('Failed to send status email:', emailError);
      }
    }

    return NextResponse.json<ApiResponse<{ success: boolean; newStatus: BookingStatus }>>({ data: { success: true, newStatus }, message: 'Cập nhật trạng thái thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Update booking status error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
