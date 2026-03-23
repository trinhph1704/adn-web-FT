import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { createDocument } from '@/lib/supabase/helpers';
import { verifyToken, slugify } from '@/lib/utils';
import { ApiResponse, Tag } from '@/types';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLES.tags)
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json<ApiResponse<Tag[]>>(
      { data: (data || []) as Tag[], message: 'Lấy danh sách tag thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get tags error:', error);
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
    const { name, slug } = body;

    if (!name) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng nhập tên tag', statusCode: 400 },
        { status: 400 }
      );
    }

    const tagData = {
      name,
      slug: slug || slugify(name),
    };

    const id = await createDocument(TABLES.tags, tagData);

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { data: { id }, message: 'Tạo tag thành công', statusCode: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create tag error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
