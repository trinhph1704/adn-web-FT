import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { TestResult, TestBooking, ApiResponse } from '@/types';

interface RouteContext { params: Promise<{ id: string }>; }

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { id } = await context.params;
    const { data: result, error } = await supabaseAdmin.from(TABLES.testResults).select('*').eq('id', id).single();
    if (error || !result) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy kết quả', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client') {
      const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('clientId').eq('id', result.testBookingId).single();
      if (!booking || booking.clientId !== payload.userId) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
    }

    if (result.testBookingId) {
      const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', result.testBookingId).single();
      if (booking) result.testBooking = booking;
    }

    return NextResponse.json<ApiResponse<TestResult>>({ data: result as TestResult, message: 'Lấy thông tin kết quả thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get result error:', error);
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
    const body: { resultSummary?: string; resultFileUrl?: string } = await request.json();
    const { data: existing } = await supabaseAdmin.from(TABLES.testResults).select('id').eq('id', id).single();
    if (!existing) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy kết quả', statusCode: 404 }, { status: 404 });

    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (body.resultSummary !== undefined) updateData.resultSummary = body.resultSummary;
    if (body.resultFileUrl !== undefined) updateData.resultFileUrl = body.resultFileUrl;

    await supabaseAdmin.from(TABLES.testResults).update(updateData).eq('id', id);
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Cập nhật kết quả thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Update result error:', error);
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
    const { data: existing } = await supabaseAdmin.from(TABLES.testResults).select('id').eq('id', id).single();
    if (!existing) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy kết quả', statusCode: 404 }, { status: 404 });

    await supabaseAdmin.from(TABLES.testResults).delete().eq('id', id);
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Xóa kết quả thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Delete result error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
