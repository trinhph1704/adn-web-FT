import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, SampleTypeInstruction } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from(TABLES.sampleInstructions)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy hướng dẫn', statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<SampleTypeInstruction>>(
      { data: data as SampleTypeInstruction, message: 'Lấy hướng dẫn thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get sample instruction by ID error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from(TABLES.sampleInstructions)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy hướng dẫn', statusCode: 404 },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { sampleType, title, instructions, videoUrl, imageUrls } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (sampleType !== undefined) updateData.sampleType = sampleType;
    if (title !== undefined) updateData.title = title;
    if (instructions !== undefined) updateData.instructions = instructions;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (imageUrls !== undefined) updateData.imageUrls = imageUrls;

    const { error: updateError } = await supabaseAdmin
      .from(TABLES.sampleInstructions)
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { data: { id }, message: 'Cập nhật hướng dẫn thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update sample instruction error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from(TABLES.sampleInstructions)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy hướng dẫn', statusCode: 404 },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from(TABLES.sampleInstructions)
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Xóa hướng dẫn thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete sample instruction error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
