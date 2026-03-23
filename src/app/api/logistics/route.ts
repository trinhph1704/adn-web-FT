import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { createDocument } from '@/lib/supabase/helpers';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, LogisticsInfo, LogisticStatus } from '@/types';

export async function GET(request: NextRequest) {
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

    if (!['Staff', 'Manager', 'Admin'].includes(payload.role)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền truy cập', statusCode: 403 },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from(TABLES.logistics)
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return NextResponse.json<ApiResponse<LogisticsInfo[]>>(
      { data: data as LogisticsInfo[], message: 'Lấy danh sách logistics thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get logistics error:', error);
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
    const { name, address, phone, type, scheduledAt, note } = body;

    if (!name || !address || !phone) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng điền đầy đủ thông tin (name, address, phone)', statusCode: 400 },
        { status: 400 }
      );
    }

    const logisticsData = {
      name,
      address,
      phone,
      type: type ?? 0,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      note: note || '',
      status: LogisticStatus.PreparingKit,
      staffId: null,
      completedAt: null,
      evidenceImageUrl: null,
    };

    const id = await createDocument(TABLES.logistics, logisticsData);

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { data: { id }, message: 'Tạo logistics thành công', statusCode: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create logistics error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
