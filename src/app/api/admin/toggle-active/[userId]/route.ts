import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { User, ApiResponse } from '@/types';

interface RouteContext {
  params: Promise<{ userId: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
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

    if (payload.role !== 'Admin') {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền truy cập', statusCode: 403 },
        { status: 403 }
      );
    }

    const { userId } = await context.params;

    if (userId === payload.userId) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không thể thay đổi trạng thái tài khoản của chính mình', statusCode: 400 },
        { status: 400 }
      );
    }

    const { data: userData, error } = await supabaseAdmin
      .from(TABLES.users)
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !userData) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy người dùng', statusCode: 404 },
        { status: 404 }
      );
    }

    const user = userData as User;
    const newIsActive = !user.isActive;

    await supabaseAdmin
      .from(TABLES.users)
      .update({ isActive: newIsActive })
      .eq('id', userId);

    const message = newIsActive ? 'Tài khoản đã được mở khóa' : 'Tài khoản đã bị khóa';

    return NextResponse.json<ApiResponse<{ isActive: boolean; userId: string }>>(
      { data: { isActive: newIsActive, userId }, message, statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Toggle active error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
