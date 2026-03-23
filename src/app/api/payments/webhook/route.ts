import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { Payment, ApiResponse, PaymentStatus, BookingStatus } from '@/types';
import { verifyWebhookSignature, PayOSWebhookData } from '@/lib/payos';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('PayOS Webhook received:', JSON.stringify(body, null, 2));

    const { data, signature } = body as { data: PayOSWebhookData; signature: string };
    if (!data || !signature) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Invalid webhook data', statusCode: 200 }, { status: 200 });

    const isValid = verifyWebhookSignature(data, signature);
    if (!isValid) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Invalid signature', statusCode: 200 }, { status: 200 });

    const { orderCode, code, desc } = data;
    const { data: paymentsData } = await supabaseAdmin.from(TABLES.payments).select('*').eq('orderCode', orderCode).limit(1);
    if (!paymentsData || paymentsData.length === 0) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Payment not found', statusCode: 200 }, { status: 200 });

    const payment = paymentsData[0] as Payment;
    const now = new Date().toISOString();

    if (code === '00') {
      await supabaseAdmin.from(TABLES.payments).update({ status: PaymentStatus.Paid, paidAt: now, updatedAt: now }).eq('id', payment.id);

      if (payment.bookingId) {
        const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('status').eq('id', payment.bookingId).single();
        if (booking) {
          if (booking.status === BookingStatus.Pending && payment.depositAmount) {
            await supabaseAdmin.from(TABLES.testBookings).update({ status: BookingStatus.DepositPaid, updatedAt: now }).eq('id', payment.bookingId);
          }
          if (booking.status === BookingStatus.ResultReady && payment.remainingAmount) {
            await supabaseAdmin.from(TABLES.testBookings).update({ status: BookingStatus.FullyPaid, updatedAt: now }).eq('id', payment.bookingId);
          }
        }
      }
    } else {
      await supabaseAdmin.from(TABLES.payments).update({
        status: PaymentStatus.Failed,
        description: `${payment.description} - Error: ${desc}`,
        updatedAt: now,
      }).eq('id', payment.id);
    }

    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Webhook processed', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: false }, message: 'Webhook error', statusCode: 200 }, { status: 200 });
  }
}
