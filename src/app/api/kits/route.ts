import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { createDocument } from '@/lib/supabase/helpers';
import { TestKit, ApiResponse, SampleCollectionMethod } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    if (!['Staff', 'Manager', 'Admin'].includes(payload.role)) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });
    }

    const { data: kitsData, error } = await supabaseAdmin.from(TABLES.testKits).select('*').order('createdAt', { ascending: false });
    if (error) throw error;

    const kits: TestKit[] = [];
    for (const kitData of kitsData || []) {
      if (kitData.bookingId) {
        const { data: bookingData } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', kitData.bookingId).single();
        if (bookingData) kitData.booking = bookingData;
      }
      kits.push(kitData as TestKit);
    }

    return NextResponse.json<ApiResponse<TestKit[]>>({ data: kits, message: 'Lấy danh sách kit thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get kits error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    if (!['Staff', 'Manager', 'Admin'].includes(payload.role)) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền thực hiện', statusCode: 403 }, { status: 403 });
    }

    const body: { bookingId: string; collectionMethod: SampleCollectionMethod; sampleCount: number } = await request.json();
    const { bookingId, collectionMethod, sampleCount } = body;

    if (!bookingId || collectionMethod === undefined || !sampleCount) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Vui lòng điền đầy đủ thông tin', statusCode: 400 }, { status: 400 });
    }

    const { data: bookingExists } = await supabaseAdmin.from(TABLES.testBookings).select('id').eq('id', bookingId).single();
    if (!bookingExists) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });

    const { data: existingKit } = await supabaseAdmin.from(TABLES.testKits).select('id').eq('bookingId', bookingId).limit(1);
    if (existingKit && existingKit.length > 0) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Kit đã tồn tại cho đặt lịch này', statusCode: 400 }, { status: 400 });
    }

    const kitId = await createDocument(TABLES.testKits, { bookingId, collectionMethod, sampleCount });

    return NextResponse.json<ApiResponse<{ kitId: string }>>({ data: { kitId }, message: 'Tạo kit thành công', statusCode: 201 }, { status: 201 });
  } catch (error) {
    console.error('Create kit error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
