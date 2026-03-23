import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, LogisticsInfo } from '@/types';

export async function GET(
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

    const { data, error } = await supabaseAdmin
      .from(TABLES.logistics)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy logistics', statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<LogisticsInfo>>(
      { data: data as LogisticsInfo, message: 'Lấy thông tin logistics thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get logistics by ID error:', error);
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
      .from(TABLES.logistics)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy logistics', statusCode: 404 },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, address, phone, scheduledAt, note, status } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (scheduledAt !== undefined) updateData.scheduledAt = new Date(scheduledAt).toISOString();
    if (note !== undefined) updateData.note = note;
    if (status !== undefined) updateData.status = status;

    const { error: updateError } = await supabaseAdmin
      .from(TABLES.logistics)
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { data: { id }, message: 'Cập nhật logistics thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update logistics error:', error);
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
      .from(TABLES.logistics)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy logistics', statusCode: 404 },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from(TABLES.logistics)
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Xóa logistics thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete logistics error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
