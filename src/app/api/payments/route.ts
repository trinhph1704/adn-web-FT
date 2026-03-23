import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { createDocument } from '@/lib/supabase/helpers';
import { Payment, TestBooking, ApiResponse, PaymentStatus, BookingStatus } from '@/types';
import { createPaymentLink, generateOrderCode, calculateDepositAmount, calculateRemainingAmount, PAYOS_CONFIG } from '@/lib/payos';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    if (payload.role === 'Client') {
      const { data: bookings } = await supabaseAdmin.from(TABLES.testBookings).select('id').eq('clientId', payload.userId);
      const bookingIds = (bookings || []).map((b: { id: string }) => b.id);
      if (bookingIds.length === 0) return NextResponse.json<ApiResponse<Payment[]>>({ data: [], message: 'Không có thanh toán nào', statusCode: 200 }, { status: 200 });

      const { data: paymentsData } = await supabaseAdmin.from(TABLES.payments).select('*').in('bookingId', bookingIds).order('createdAt', { ascending: false });
      const payments: Payment[] = [];
      for (const p of paymentsData || []) {
        if (p.bookingId) {
          const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', p.bookingId).single();
          if (booking) p.booking = booking;
        }
        payments.push(p as Payment);
      }
      return NextResponse.json<ApiResponse<Payment[]>>({ data: payments, message: 'Lấy danh sách thanh toán thành công', statusCode: 200 }, { status: 200 });
    }

    const { data: paymentsData, error } = await supabaseAdmin.from(TABLES.payments).select('*').order('createdAt', { ascending: false });
    if (error) throw error;

    const payments: Payment[] = [];
    for (const p of paymentsData || []) {
      if (p.bookingId) {
        const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', p.bookingId).single();
        if (booking) p.booking = booking;
      }
      payments.push(p as Payment);
    }

    return NextResponse.json<ApiResponse<Payment[]>>({ data: payments, message: 'Lấy danh sách thanh toán thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const body: { bookingId: string; paymentType: 'deposit' | 'remaining' } = await request.json();
    const { bookingId, paymentType } = body;
    if (!bookingId || !paymentType) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Thiếu thông tin bắt buộc', statusCode: 400 }, { status: 400 });

    const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', bookingId).single();
    if (!booking) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client' && booking.clientId !== payload.userId) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền thanh toán đặt lịch này', statusCode: 403 }, { status: 403 });

    if (paymentType === 'deposit' && booking.status !== BookingStatus.Pending) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Đặt lịch không ở trạng thái chờ đặt cọc', statusCode: 400 }, { status: 400 });
    if (paymentType === 'remaining' && booking.status !== BookingStatus.ResultReady) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Đặt lịch chưa có kết quả để thanh toán còn lại', statusCode: 400 }, { status: 400 });

    const totalPrice = booking.price;
    const depositAmount = calculateDepositAmount(totalPrice);
    const remainingAmount = calculateRemainingAmount(totalPrice);
    const paymentAmount = paymentType === 'deposit' ? depositAmount : remainingAmount;
    const orderCode = generateOrderCode();
    const description = paymentType === 'deposit'
      ? `Dat coc don ${bookingId.slice(-6)}`
      : `Thanh toan con lai don ${bookingId.slice(-6)}`;

    const payosResponse = await createPaymentLink({
      orderCode,
      amount: paymentAmount,
      description,
      buyerName: booking.clientName,
      buyerPhone: booking.phone,
      returnUrl: `${PAYOS_CONFIG.returnUrl}?bookingId=${bookingId}&type=${paymentType}`,
      cancelUrl: `${PAYOS_CONFIG.cancelUrl}?bookingId=${bookingId}`,
      items: [{ name: paymentType === 'deposit' ? 'Đặt cọc xét nghiệm ADN' : 'Thanh toán còn lại', quantity: 1, price: paymentAmount }],
    });

    if (payosResponse.code !== '00') return NextResponse.json<ApiResponse<null>>({ data: null, message: `Lỗi tạo thanh toán: ${payosResponse.desc}`, statusCode: 400 }, { status: 400 });

    const paymentData = {
      orderCode,
      amount: paymentAmount,
      depositAmount: paymentType === 'deposit' ? paymentAmount : undefined,
      remainingAmount: paymentType === 'remaining' ? paymentAmount : undefined,
      status: PaymentStatus.Pending,
      description,
      bookingId,
    };
    const paymentId = await createDocument(TABLES.payments, paymentData);

    return NextResponse.json<ApiResponse<{ paymentId: string; checkoutUrl: string; qrCode: string; orderCode: number; amount: number }>>({
      data: {
        paymentId,
        checkoutUrl: payosResponse.data?.checkoutUrl || '',
        qrCode: payosResponse.data?.qrCode || '',
        orderCode,
        amount: paymentAmount,
      },
      message: 'Tạo thanh toán thành công', statusCode: 201,
    }, { status: 201 });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
