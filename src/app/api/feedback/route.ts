import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { createDocument } from '@/lib/supabase/helpers';
import { verifyToken } from '@/lib/utils';
import { ApiResponse, Feedback } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    let payload = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      payload = verifyToken(token);
    }

    const isAdmin = payload && payload.role === 'Admin';

    let query = supabaseAdmin
      .from(TABLES.feedback)
      .select('*')
      .order('createdAt', { ascending: false });

    if (!isAdmin) {
      query = query.eq('isPublished', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    const feedbackList: Feedback[] = [];
    for (const item of data || []) {
      if (item.userId) {
        const { data: user } = await supabaseAdmin
          .from(TABLES.users)
          .select('id, fullName, email')
          .eq('id', item.userId)
          .single();

        if (user) {
          item.user = user;
        }
      }
      feedbackList.push(item as Feedback);
    }

    return NextResponse.json<ApiResponse<Feedback[]>>(
      { data: feedbackList, message: 'Lấy danh sách feedback thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get feedback error:', error);
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

    if (payload.role !== 'Client') {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Chỉ khách hàng mới có thể gửi đánh giá', statusCode: 403 },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { bookingId, rating, comment } = body;

    if (!rating || !comment) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng điền đánh giá và nhận xét', statusCode: 400 },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Đánh giá phải từ 1 đến 5', statusCode: 400 },
        { status: 400 }
      );
    }

    const feedbackData = {
      userId: payload.userId,
      bookingId: bookingId || null,
      rating,
      comment,
      isPublished: false,
    };

    const id = await createDocument(TABLES.feedback, feedbackData);

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { data: { id }, message: 'Gửi đánh giá thành công', statusCode: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create feedback error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
