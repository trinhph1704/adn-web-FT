import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils';
import { sendEmail } from '@/lib/email';
import { ApiResponse } from '@/types';

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

    if (payload.role !== 'Admin') {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Chỉ Admin mới có quyền gửi email test', statusCode: 403 },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { to, subject, content } = body;

    if (!to || !subject || !content) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng điền đầy đủ thông tin (to, subject, content)', statusCode: 400 },
        { status: 400 }
      );
    }

    const result = await sendEmail(to, {
      subject,
      html: content,
      text: content.replace(/<[^>]*>/g, ''),
    });

    if (!result.success) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: result.error || 'Gửi email thất bại', statusCode: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ messageId: string | undefined }>>(
      {
        data: { messageId: result.messageId },
        message: 'Gửi email test thành công',
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send test email error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
