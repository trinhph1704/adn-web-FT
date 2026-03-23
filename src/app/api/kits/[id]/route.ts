import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { TestKit, TestSample, ApiResponse, SampleCollectionMethod } from '@/types';

interface RouteContext { params: Promise<{ id: string }>; }

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { id } = await context.params;
    const { data: kit, error } = await supabaseAdmin.from(TABLES.testKits).select('*').eq('id', id).single();
    if (error || !kit) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy kit', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client') {
      const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('clientId').eq('id', kit.bookingId).single();
      if (!booking || booking.clientId !== payload.userId) {
        return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
      }
    }

    if (kit.bookingId) {
      const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', kit.bookingId).single();
      if (booking) kit.booking = booking;
    }

    const { data: samples } = await supabaseAdmin.from(TABLES.testSamples).select('*').eq('kitId', id);
    kit.samples = (samples || []) as TestSample[];

    return NextResponse.json<ApiResponse<TestKit>>({ data: kit as TestKit, message: 'Lấy thông tin kit thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get kit error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload || !['Staff', 'Manager', 'Admin'].includes(payload.role)) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền thực hiện', statusCode: 403 }, { status: 403 });
    }

    const { id } = await context.params;
    const body: { collectionMethod?: SampleCollectionMethod; sampleCount?: number } = await request.json();
    const { data: existing } = await supabaseAdmin.from(TABLES.testKits).select('id').eq('id', id).single();
    if (!existing) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy kit', statusCode: 404 }, { status: 404 });

    const updateData: Record<string, unknown> = {};
    if (body.collectionMethod !== undefined) updateData.collectionMethod = body.collectionMethod;
    if (body.sampleCount !== undefined) updateData.sampleCount = body.sampleCount;

    await supabaseAdmin.from(TABLES.testKits).update(updateData).eq('id', id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Cập nhật kit thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Update kit error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'Admin') {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền thực hiện', statusCode: 403 }, { status: 403 });
    }

    const { id } = await context.params;
    const { data: existing } = await supabaseAdmin.from(TABLES.testKits).select('id').eq('id', id).single();
    if (!existing) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy kit', statusCode: 404 }, { status: 404 });

    await supabaseAdmin.from(TABLES.testSamples).delete().eq('kitId', id);
    await supabaseAdmin.from(TABLES.testKits).delete().eq('id', id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Xóa kit thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Delete kit error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
