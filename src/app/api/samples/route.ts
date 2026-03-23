import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken, generateSampleCode } from '@/lib/utils';
import { createDocument } from '@/lib/supabase/helpers';
import { TestSample, CreateTestSampleDto, ApiResponse, SampleCollectionMethod } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });
    if (!['Staff', 'Manager', 'Admin'].includes(payload.role)) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền truy cập', statusCode: 403 }, { status: 403 });

    const { data, error } = await supabaseAdmin.from(TABLES.testSamples).select('*').order('createdAt', { ascending: false });
    if (error) throw error;

    return NextResponse.json<ApiResponse<TestSample[]>>({ data: (data || []) as TestSample[], message: 'Lấy danh sách mẫu thành công', statusCode: 200 }, { status: 200 });
  } catch (error) {
    console.error('Get samples error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });

    const body: CreateTestSampleDto = await request.json();
    const { kitId, donorName, relationshipToSubject, sampleType } = body;
    if (!kitId || !donorName || relationshipToSubject === undefined || sampleType === undefined) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Vui lòng điền đầy đủ thông tin', statusCode: 400 }, { status: 400 });
    }

    const { data: kit } = await supabaseAdmin.from(TABLES.testKits).select('*').eq('id', kitId).single();
    if (!kit) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy kit', statusCode: 404 }, { status: 404 });

    const { data: booking } = await supabaseAdmin.from(TABLES.testBookings).select('*').eq('id', kit.bookingId).single();
    if (!booking) return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không tìm thấy đặt lịch', statusCode: 404 }, { status: 404 });

    if (kit.collectionMethod === SampleCollectionMethod.SelfSample) {
      if (payload.role === 'Client' && booking.clientId !== payload.userId) {
        return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Không có quyền tạo mẫu cho đặt lịch này', statusCode: 403 }, { status: 403 });
      }
    } else {
      if (!['Staff', 'Manager', 'Admin'].includes(payload.role)) {
        return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Chỉ nhân viên mới có thể tạo mẫu cho lấy mẫu tại cơ sở', statusCode: 403 }, { status: 403 });
      }
    }

    const { count } = await supabaseAdmin.from(TABLES.testSamples).select('*', { count: 'exact', head: true }).eq('kitId', kitId);
    if ((count || 0) >= kit.sampleCount) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: `Kit này chỉ cho phép ${kit.sampleCount} mẫu`, statusCode: 400 }, { status: 400 });
    }

    const sampleCode = generateSampleCode();
    const sampleData = {
      kitId,
      sampleCode,
      donorName,
      relationshipToSubject,
      sampleType,
      collectedById: ['Staff', 'Manager', 'Admin'].includes(payload.role) ? payload.userId : undefined,
      collectedAt: new Date().toISOString(),
    };
    const sampleId = await createDocument(TABLES.testSamples, sampleData);

    return NextResponse.json<ApiResponse<{ sampleId: string; sampleCode: string }>>({ data: { sampleId, sampleCode }, message: 'Tạo mẫu thành công', statusCode: 201 }, { status: 201 });
  } catch (error) {
    console.error('Create sample error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
