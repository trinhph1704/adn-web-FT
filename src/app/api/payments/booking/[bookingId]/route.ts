import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { Payment, TestBooking, ApiResponse, PaymentStatus } from '@/types';

interface RouteContext { params: Promise<{ bookingId: string }>; }

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { bookingId } = await context.params;
    const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', bookingId).single();
    if (!booking) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client' && booking.clientId !== payload.userId) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });

    const { data: paymentsData } = await supabaseAdmin.from(TABLES.payments).select('*').eq('bookingId', bookingId).order('createdAt', { ascending: true });
    const payments = ((paymentsData || []) as Payment[]).map(p => ({ ...p, booking: booking as TestBooking }));

    const totalPaid = payments.filter(p => p.status === PaymentStatus.Paid).reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments.filter(p => p.status === PaymentStatus.Pending).reduce((sum, p) => sum + p.amount, 0);
    const remainingToPay = booking.price - totalPaid;

    return NextResponse.json<ApiResponse<{ payments: Payment[]; summary: { totalPrice: number; totalPaid: number; totalPending: number; remainingToPay: number } }>>({
      data: {
        payments,
        summary: { totalPrice: booking.price, totalPaid, totalPending, remainingToPay },
      },
      message: 'Lấy danh sách thanh toán thành công', statusCode: 200,
    }, { status: 200 });
  } catch (error) {
    console.error('Get payments by booking error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
