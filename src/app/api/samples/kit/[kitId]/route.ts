import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { TestSample, TestKit, ApiResponse } from '@/types';

interface RouteContext { params: Promise<{ kitId: string }>; }

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { kitId } = await context.params;
    const { data: kit } = await supabaseAdmin.from(TABLES.testKits).select('*').eq('id', kitId).single();
    if (!kit) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy kit', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client') {
      const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('clientId').eq('id', kit.bookingId).single();
      if (!booking || booking.clientId !== payload.userId) {
        return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
      }
    }

    const { data: samples } = await supabaseAdmin.from(TABLES.testSamples).select('*').eq('kitId', kitId).order('createdAt', { ascending: true });

    return NextResponse.json<ApiResponse<{ samples: TestSample[]; kit: TestKit }>>({
      data: { samples: (samples || []) as TestSample[], kit: kit as TestKit },
      message: 'Lấy danh sách mẫu thành công', statusCode: 200,
    }, { status: 200 });
  } catch (error) {
    console.error('Get samples by kit error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
