import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, Feedback } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from(TABLES.feedback)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy feedback', statusCode: 404 },
        { status: 404 }
      );
    }

    if (data.userId) {
      const { data: user } = await supabaseAdmin
        .from(TABLES.users)
        .select('id, fullName, email')
        .eq('id', data.userId)
        .single();

      if (user) {
        data.user = user;
      }
    }

    return NextResponse.json<ApiResponse<Feedback>>(
      { data: data as Feedback, message: 'Lấy feedback thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get feedback by ID error:', error);
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

    if (payload.role !== 'Admin') {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Chỉ Admin mới có quyền cập nhật', statusCode: 403 },
        { status: 403 }
      );
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from(TABLES.feedback)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy feedback', statusCode: 404 },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from(TABLES.feedback)
      .update({
        isPublished: !existing.isPublished,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json<ApiResponse<{ id: string; isPublished: boolean }>>(
      {
        data: { id, isPublished: !existing.isPublished },
        message: `Feedback đã ${!existing.isPublished ? 'được công khai' : 'bị ẩn'}`,
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update feedback error:', error);
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

    if (payload.role !== 'Admin') {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Chỉ Admin mới có quyền xóa', statusCode: 403 },
        { status: 403 }
      );
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from(TABLES.feedback)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy feedback', statusCode: 404 },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from(TABLES.feedback)
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Xóa feedback thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete feedback error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
