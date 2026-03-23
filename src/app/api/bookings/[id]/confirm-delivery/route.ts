import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, BookingStatus, LogisticStatus } from '@/types';

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

    if (booking.status !== BookingStatus.KitDelivering) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Trạng thái đặt lịch không phù hợp để xác nhận nhận kit', statusCode: 400 }, { status: 400 });
    }

    await supabaseAdmin.from(TABLES.testBookings).update({ status: BookingStatus.KitDelivered }).eq('id', id);

    const { data: kits } = await supabaseAdmin.from(TABLES.testKits).select('deliveryInfoId').eq('bookingId', id).limit(1);
    if (kits && kits.length > 0 && kits[0].deliveryInfoId) {
      await supabaseAdmin
        .from(TABLES.logistics)
        .update({ status: LogisticStatus.KitDelivered, completedAt: new Date().toISOString() })
        .eq('id', kits[0].deliveryInfoId);
    }

    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Xác nhận nhận kit thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Confirm delivery error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
