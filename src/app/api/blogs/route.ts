import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { createDocument, generateId } from '@/lib/supabase/helpers';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, Blog } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    let payload = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      payload = verifyToken(token);
    }

    let query = supabaseAdmin
      .from(TABLES.blogs)
      .select('*')
      .order('createdAt', { ascending: false });

    const isStaffOrAdmin = payload && ['Staff', 'Manager', 'Admin'].includes(payload.role);
    if (!isStaffOrAdmin) {
      query = query.eq('isPublished', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json<ApiResponse<Blog[]>>(
      { data: (data || []) as Blog[], message: 'Lấy danh sách bài viết thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get blogs error:', error);
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

    if (!['Staff', 'Manager', 'Admin'].includes(payload.role)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền thực hiện', statusCode: 403 },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, summary, imageUrl, tagIds } = body;

    if (!title || !content) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng điền tiêu đề và nội dung', statusCode: 400 },
        { status: 400 }
      );
    }

    const blogData = {
      title,
      content,
      summary: summary || '',
      imageUrl: imageUrl || null,
      authorId: payload.userId,
      isPublished: false,
      publishedAt: null,
    };

    const blogId = await createDocument(TABLES.blogs, blogData);

    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      const now = new Date().toISOString();
      const blogTagRows = tagIds.map((tagId: string) => ({
        id: generateId(),
        blogId,
        tagId,
        createdAt: now,
        updatedAt: now,
      }));

      const { error: tagError } = await supabaseAdmin
        .from(TABLES.blogTags)
        .insert(blogTagRows);

      if (tagError) {
        console.error('Insert blog tags error:', tagError);
      }
    }

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { data: { id: blogId }, message: 'Tạo bài viết thành công', statusCode: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
