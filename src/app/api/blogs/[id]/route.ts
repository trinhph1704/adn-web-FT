import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { generateId } from '@/lib/supabase/helpers';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, Blog } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: blog, error } = await supabaseAdmin
      .from(TABLES.blogs)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !blog) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy bài viết', statusCode: 404 },
        { status: 404 }
      );
    }

    if (blog.authorId) {
      const { data: author } = await supabaseAdmin
        .from(TABLES.users)
        .select('id, fullName, email')
        .eq('id', blog.authorId)
        .single();

      if (author) {
        blog.author = author;
      }
    }

    const { data: blogTags } = await supabaseAdmin
      .from(TABLES.blogTags)
      .select('tagId')
      .eq('blogId', id);

    if (blogTags && blogTags.length > 0) {
      const tagIds = blogTags.map((bt: { tagId: string }) => bt.tagId);
      const { data: tags } = await supabaseAdmin
        .from(TABLES.tags)
        .select('*')
        .in('id', tagIds);

      blog.tags = tags || [];
    } else {
      blog.tags = [];
    }

    return NextResponse.json<ApiResponse<Blog>>(
      { data: blog as Blog, message: 'Lấy bài viết thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get blog by ID error:', error);
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

    if (!['Staff', 'Manager', 'Admin'].includes(payload.role)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền thực hiện', statusCode: 403 },
        { status: 403 }
      );
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from(TABLES.blogs)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy bài viết', statusCode: 404 },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, summary, imageUrl, isPublished, tagIds } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (summary !== undefined) updateData.summary = summary;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished && !existing.publishedAt) {
        updateData.publishedAt = new Date().toISOString();
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from(TABLES.blogs)
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;

    if (tagIds !== undefined && Array.isArray(tagIds)) {
      await supabaseAdmin
        .from(TABLES.blogTags)
        .delete()
        .eq('blogId', id);

      if (tagIds.length > 0) {
        const now = new Date().toISOString();
        const blogTagRows = tagIds.map((tagId: string) => ({
          id: generateId(),
          blogId: id,
          tagId,
          createdAt: now,
          updatedAt: now,
        }));

        const { error: tagError } = await supabaseAdmin
          .from(TABLES.blogTags)
          .insert(blogTagRows);

        if (tagError) {
          console.error('Update blog tags error:', tagError);
        }
      }
    }

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { data: { id }, message: 'Cập nhật bài viết thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update blog error:', error);
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
      .from(TABLES.blogs)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy bài viết', statusCode: 404 },
        { status: 404 }
      );
    }

    await supabaseAdmin
      .from(TABLES.blogTags)
      .delete()
      .eq('blogId', id);

    const { error: deleteError } = await supabaseAdmin
      .from(TABLES.blogs)
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Xóa bài viết thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
