import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { TestResult, TestBooking, ApiResponse } from '@/types';

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

    if (payload.role === 'Client' && booking.clientId !== payload.userId) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
    }

    const { data: results } = await supabaseAdmin.from(TABLES.testResults).select('*').eq('testBookingId', bookingId).limit(1);
    if (!results || results.length === 0) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Chưa có kết quả cho đặt lịch này', statusCode: 404 }, { status: 404 });

    const result = results[0] as TestResult;
    result.testBooking = booking as TestBooking;

    return NextResponse.json<ApiResponse<TestResult>>({ data: result, message: 'Lấy kết quả thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get result by booking error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
