import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { TestBooking, TestService, User, TestKit, UpdateTestBookingDto, ApiResponse, BookingStatus } from '@/types';

interface RouteContext { params: Promise<{ id: string }>; }

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { id } = await context.params;
    const { data: booking, error } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', id).single();
    if (error || !booking) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client' && booking.clientId !== payload.userId) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
    }

    if (booking.clientId) {
      const { data: client } = await supabaseAdmin.from(TABLES.users).select('id,fullName,email,phone,address,role,isActive,createdAt').eq('id', booking.clientId).single();
      if (client) booking.client = client;
    }
    if (booking.testServiceId) {
      const { data: service } = await supabaseAdmin.from(TABLES.testServices).select('*').eq('id', booking.testServiceId).single();
      if (service) booking.testService = service;
    }
    const { data: kits } = await supabaseAdmin.from(TABLES.testKits).select('*').eq('bookingId', id).limit(1);
    if (kits && kits.length > 0) booking.kit = kits[0];

    return NextResponse.json<ApiResponse<TestBooking>>({ data: booking as TestBooking, message: 'Lấy thông tin đặt lịch thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { id } = await context.params;
    const body: UpdateTestBookingDto = await request.json();

    const { data: booking, error } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', id).single();
    if (error || !booking) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client' && booking.clientId !== payload.userId) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.appointmentDate !== undefined) updateData.appointmentDate = new Date(body.appointmentDate).toISOString();
    if (body.note !== undefined) updateData.note = body.note;
    if (body.status !== undefined && payload.role !== 'Client') updateData.status = body.status;

    await supabaseAdmin.from(TABLES.testBookings).update(updateData).eq('id', id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Cập nhật đặt lịch thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const { id } = await context.params;
    const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', id).single();
    if (!booking) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });

    if (payload.role === 'Client' && booking.clientId !== payload.userId) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
    }

    if (booking.status !== BookingStatus.Pending) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Chỉ có thể xóa đặt lịch ở trạng thái chờ xử lý', statusCode: 400 }, { status: 400 });
    }

    await supabaseAdmin.from(TABLES.testBookings).update({ kitId: null }).eq('id', id);
    await supabaseAdmin.from(TABLES.testKits).delete().eq('bookingId', id);
    await supabaseAdmin.from(TABLES.testBookings).delete().eq('id', id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true }, message: 'Xóa đặt lịch thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
