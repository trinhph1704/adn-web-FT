import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { ApiResponse } from '@/types';

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

    if (!['Manager', 'Admin'].includes(payload.role)) {
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
    const { staffId } = body;

    if (!staffId) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng cung cấp staffId', statusCode: 400 },
        { status: 400 }
      );
    }

    const { data: staff, error: staffError } = await supabaseAdmin
      .from(TABLES.users)
      .select('*')
      .eq('id', staffId)
      .single();

    if (staffError || !staff) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy nhân viên', statusCode: 404 },
        { status: 404 }
      );
    }

    if (staff.role !== 1) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Người dùng không phải là nhân viên (Staff)', statusCode: 400 },
        { status: 400 }
      );
    }

    if (!staff.isActive) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Nhân viên đã bị vô hiệu hóa', statusCode: 400 },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from(TABLES.logistics)
      .update({ staffId, updatedAt: new Date().toISOString() })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json<ApiResponse<{ id: string; staffId: string }>>(
      { data: { id, staffId }, message: 'Phân công nhân viên thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Assign logistics error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
