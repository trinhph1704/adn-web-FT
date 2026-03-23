import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { TestSample, UpdateTestSampleDto, ApiResponse } from '@/types';

interface RouteContext { params: Promise<{ id: string }>; }

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { id } = await context.params;
    const { data: sample, error } = await supabaseAdmin.from(TABLES.testSamples).select('*').eq('id', id).single();
    if (error || !sample) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy mẫu', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client' && sample.kitId) {
      const { data: kit } = await supabaseAdmin.from(TABLES.testKits).select('*').eq('id', sample.kitId).single();
      if (kit) {
        const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('clientId').eq('id', kit.bookingId).single();
        if (!booking || booking.clientId !== payload.userId) {
          return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
        }
        sample.kit = kit;
      }
    }

    return NextResponse.json<ApiResponse<TestSample>>({ data: sample as TestSample, message: 'Lấy thông tin mẫu thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get sample error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload || !['Staff', 'Manager', 'Admin'].includes(payload.role)) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền thực hiện', statusCode: 403 }, { status: 403 });

    const { id } = await context.params;
    const body: UpdateTestSampleDto = await request.json();
    const { data: existing } = await supabaseAdmin.from(TABLES.testSamples).select('id').eq('id', id).single();
    if (!existing) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy mẫu', statusCode: 404 }, { status: 404 });

    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (body.sampleType !== undefined) updateData.sampleType = body.sampleType;
    if (body.collectedAt !== undefined) updateData.collectedAt = new Date(body.collectedAt).toISOString();

    await supabaseAdmin.from(TABLES.testSamples).update(updateData).eq('id', id);
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Cập nhật mẫu thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Update sample error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload || payload.role !== 'Admin') return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền thực hiện', statusCode: 403 }, { status: 403 });

    const { id } = await context.params;
    const { data: existing } = await supabaseAdmin.from(TABLES.testSamples).select('id').eq('id', id).single();
    if (!existing) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy mẫu', statusCode: 404 }, { status: 404 });

    await supabaseAdmin.from(TABLES.testSamples).delete().eq('id', id);
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Xóa mẫu thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Delete sample error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
