import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, LogisticStatus } from '@/types';

export async function POST(
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

    if (!['Staff', 'Manager', 'Admin'].includes(payload.role)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền thực hiện', statusCode: 403 },
        { status: 403 }
      );
    }

    const { data: logistics, error: logisticsError } = await supabaseAdmin
      .from(TABLES.logistics)
      .select('*')
      .eq('id', id)
      .single();

    if (logisticsError || !logistics) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy logistics', statusCode: 404 },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { note, evidenceImageUrl } = body;

    const now = new Date().toISOString();
    const updateData: Record<string, unknown> = {
      status: LogisticStatus.SampleReceived,
      completedAt: now,
      updatedAt: now,
    };
    if (note !== undefined) updateData.note = note;
    if (evidenceImageUrl !== undefined) updateData.evidenceImageUrl = evidenceImageUrl;

    const { error: updateError } = await supabaseAdmin
      .from(TABLES.logistics)
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { data: { id }, message: 'Hoàn thành logistics thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Complete logistics error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
