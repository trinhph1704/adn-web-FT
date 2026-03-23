import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { Payment, ApiResponse, PaymentStatus } from '@/types';
import { cancelPaymentLink, getPaymentInfo } from '@/lib/payos';

interface RouteContext { params: Promise<{ id: string }>; }

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { id } = await context.params;
    const { data: payment, error } = await supabaseAdmin.from(TABLES.payments).select('*').eq('id', id).single();
    if (error || !payment) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy thanh toán', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client') {
      const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', payment.bookingId).single();
      if (booking) {
        if (booking.clientId !== payload.userId) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
        payment.booking = booking;
      }
    }

    if (payment.status === PaymentStatus.Pending) {
      try {
        const payosInfo = await getPaymentInfo(payment.orderCode);
        if (payosInfo.code === '00' && payosInfo.data) {
          const now = new Date().toISOString();
          if (payosInfo.data.status === 'PAID') {
            await supabaseAdmin.from(TABLES.payments).update({ status: PaymentStatus.Paid, paidAt: now, updatedAt: now }).eq('id', id);
            payment.status = PaymentStatus.Paid;
          } else if (payosInfo.data.status === 'CANCELLED') {
            await supabaseAdmin.from(TABLES.payments).update({ status: PaymentStatus.Cancelled, updatedAt: now }).eq('id', id);
            payment.status = PaymentStatus.Cancelled;
          }
        }
      } catch (e) {
        console.warn('Could not fetch PayOS status:', e);
      }
    }

    return NextResponse.json<ApiResponse<Payment>>({ data: payment as Payment, message: 'Lấy thông tin thanh toán thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get payment error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { id } = await context.params;
    const { data: payment } = await supabaseAdmin.from(TABLES.payments).select('*').eq('id', id).single();
    if (!payment) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy thanh toán', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client') {
      const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('clientId').eq('id', payment.bookingId).single();
      if (booking && booking.clientId !== payload.userId) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền hủy thanh toán này', statusCode: 403 }, { status: 403 });
    }

    if (payment.status !== PaymentStatus.Pending) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Chỉ có thể hủy thanh toán đang chờ', statusCode: 400 }, { status: 400 });

    try {
      await cancelPaymentLink(payment.orderCode, 'User cancelled');
    } catch (e) {
      console.warn('PayOS cancel error:', e);
    }

    await supabaseAdmin.from(TABLES.payments).update({ status: PaymentStatus.Cancelled, updatedAt: new Date().toISOString() }).eq('id', id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Hủy thanh toán thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Cancel payment error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
