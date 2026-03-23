import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { createDocument } from '@/lib/supabase/helpers';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, SampleTypeInstruction } from '@/types';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLES.sampleInstructions)
      .select('*')
      .order('sampleType', { ascending: true });

    if (error) throw error;

    return NextResponse.json<ApiResponse<SampleTypeInstruction[]>>(
      { data: (data || []) as SampleTypeInstruction[], message: 'Lấy danh sách hướng dẫn thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get sample instructions error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Unauthorized', statusCode: 401 },
        { status: 401 }
      );
    }
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Token không hợp lệ', statusCode: 401 },
        { status: 401 }
      );
    }

    if (!['Manager', 'Admin'].includes(payload.role)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền thực hiện', statusCode: 403 },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { sampleType, title, instructions, videoUrl, imageUrls } = body;

    if (sampleType === undefined || !title || !instructions) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng điền đầy đủ thông tin (sampleType, title, instructions)', statusCode: 400 },
        { status: 400 }
      );
    }

    const instructionData = {
      sampleType,
      title,
      instructions,
      videoUrl: videoUrl || null,
      imageUrls: imageUrls || [],
    };

    const id = await createDocument(TABLES.sampleInstructions, instructionData);

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { data: { id }, message: 'Tạo hướng dẫn thành công', statusCode: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create sample instruction error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
