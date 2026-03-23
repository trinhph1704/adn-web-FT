import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { TestKit, ApiResponse, BookingStatus } from '@/types';

interface RouteContext { params: Promise<{ id: string }>; }

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { id } = await context.params;
    const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', id).single();
    if (!booking) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });

    if (booking.clientId !== payload.userId) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền thực hiện', statusCode: 403 }, { status: 403 });

    if (booking.status !== BookingStatus.KitDelivered) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Trạng thái đặt lịch không phù hợp để xác nhận thu mẫu', statusCode: 400 }, { status: 400 });
    }

    const { data: kits } = await supabaseAdmin.from(TABLES.testKits).select('*').eq('bookingId', id).limit(1);
    if (!kits || kits.length === 0) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy kit xét nghiệm', statusCode: 404 }, { status: 404 });

    const kit = kits[0] as TestKit;
    const { count } = await supabaseAdmin.from(TABLES.testSamples).select('*', { count: 'exact', head: true }).eq('kitId', kit.id);

    if ((count || 0) < kit.sampleCount) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: `Cần có đủ ${kit.sampleCount} mẫu xét nghiệm trước khi xác nhận thu mẫu`, statusCode: 400 }, { status: 400 });
    }

    await supabaseAdmin.from(TABLES.testBookings).update({ status: BookingStatus.SampleCollected }).eq('id', id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Xác nhận thu mẫu thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Confirm collection error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
