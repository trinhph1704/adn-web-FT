import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { createDocument } from '@/lib/supabase/helpers';
import { TestResult, TestBooking, CreateTestResultDto, ApiResponse, BookingStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });
    if (!['Staff', 'Manager', 'Admin'].includes(payload.role)) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });

    const { data: resultsData, error } = await supabaseAdmin.from(TABLES.testResults).select('*').order('createdAt', { ascending: false });
    if (error) throw error;

    const results: TestResult[] = [];
    for (const r of resultsData || []) {
      if (r.testBookingId) {
        const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', r.testBookingId).single();
        if (booking) r.testBooking = booking;
      }
      results.push(r as TestResult);
    }

    return NextResponse.json<ApiResponse<TestResult[]>>({ data: results, message: 'Lấy danh sách kết quả thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get results error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload || !['Staff', 'Manager', 'Admin'].includes(payload.role)) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền thực hiện', statusCode: 403 }, { status: 403 });

    const body: CreateTestResultDto = await request.json();
    const { testBookingId, resultSummary, resultFileUrl } = body;
    if (!testBookingId || !resultSummary || !resultFileUrl) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Vui lòng điền đầy đủ thông tin', statusCode: 400 }, { status: 400 });
    }

    const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', testBookingId).single();
    if (!booking) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });
    if (booking.status !== BookingStatus.Testing) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Đặt lịch chưa ở trạng thái đang xét nghiệm', statusCode: 400 }, { status: 400 });

    const { data: existingResult } = await supabaseAdmin.from(TABLES.testResults).select('id').eq('testBookingId', testBookingId).limit(1);
    if (existingResult && existingResult.length > 0) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Kết quả đã tồn tại cho đặt lịch này', statusCode: 400 }, { status: 400 });

    const resultId = await createDocument(TABLES.testResults, {
      testBookingId,
      resultSummary,
      resultDate: new Date().toISOString(),
      resultFileUrl,
    });

    await supabaseAdmin.from(TABLES.testBookings).update({ status: BookingStatus.ResultReady, updatedAt: new Date().toISOString() }).eq('id', testBookingId);

    return NextResponse.json<ApiResponse<{ resultId: string }>>({ data: { resultId }, message: 'Tạo kết quả thành công', statusCode: 201 }, { status: 201 });
  } catch (error) {
    console.error('Create result error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
