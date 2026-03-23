import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { TestKit, TestBooking, TestSample, ApiResponse } from '@/types';

interface RouteContext { params: Promise<{ bookingId: string }>; }

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { bookingId } = await context.params;
    const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', bookingId).single();
    if (!booking) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client' && booking.clientId !== payload.userId) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
    }

    const { data: kits } = await supabaseAdmin.from(TABLES.testKits).select('*').eq('bookingId', bookingId).limit(1);
    if (!kits || kits.length === 0) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy kit cho đặt lịch này', statusCode: 404 }, { status: 404 });

    const kit = kits[0] as TestKit;
    const { data: samples } = await supabaseAdmin.from(TABLES.testSamples).select('*').eq('kitId', kit.id);
    kit.samples = (samples || []) as TestSample[];
    kit.booking = booking as TestBooking;

    return NextResponse.json<ApiResponse<TestKit>>({ data: kit, message: 'Lấy thông tin kit thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get kit by booking error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
