import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { hashPassword, isValidEmail, isValidPhone } from '@/lib/utils';
import { createDocument } from '@/lib/supabase/helpers';
import { User, UserRole, RegisterRequest, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { fullName, email, phone, password, address } = body;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng điền đầy đủ thông tin', statusCode: 400 },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Email không hợp lệ', statusCode: 400 },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Số điện thoại không hợp lệ', statusCode: 400 },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Mật khẩu phải có ít nhất 6 ký tự', statusCode: 400 },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from(TABLES.users)
      .select('id')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Email đã tồn tại', statusCode: 400 },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address?.trim() || '',
      passwordHash,
      role: UserRole.Client,
      isActive: true,
    };

    const userId = await createDocument(TABLES.users, userData);

    return NextResponse.json<ApiResponse<{ userId: string }>>(
      { data: { userId }, message: 'Đăng ký thành công', statusCode: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
