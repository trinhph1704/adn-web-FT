import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyPassword, generateToken, isValidEmail } from '@/lib/utils';
import { User, ApiResponse, LoginResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Email và mật khẩu là bắt buộc', statusCode: 400 },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Email không hợp lệ', statusCode: 400 },
        { status: 400 }
      );
    }

    const { data: users, error } = await supabaseAdmin
      .from(TABLES.users)
      .select('*')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (error) throw error;

    if (!users || users.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Email hoặc mật khẩu không đúng', statusCode: 401 },
        { status: 401 }
      );
    }

    const user = users[0] as User;

    if (!user.isActive) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Tài khoản đã bị vô hiệu hóa', statusCode: 403 },
        { status: 403 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash || '');
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Email hoặc mật khẩu không đúng', statusCode: 401 },
        { status: 401 }
      );
    }

    const roleNames = ['Admin', 'Staff', 'Client', 'Manager'];
    const resolveRoleName = (roleValue: unknown): string => {
      if (typeof roleValue === 'number' && roleNames[roleValue]) {
        return roleNames[roleValue];
      }
      if (typeof roleValue === 'string') {
        const normalized = roleValue.trim().toLowerCase();
        const byName = roleNames.find((name) => name.toLowerCase() === normalized);
        if (byName) return byName;
        const asNumber = Number(roleValue);
        if (!Number.isNaN(asNumber) && roleNames[asNumber]) {
          return roleNames[asNumber];
        }
      }
      return 'Client';
    };

    const roleName = resolveRoleName(user.role);
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: roleName,
      userName: user.fullName,
    });

    const response: LoginResponse = {
      token,
      userName: user.fullName,
      role: roleName,
      userId: user.id,
    };

    return NextResponse.json<ApiResponse<LoginResponse>>(
      { data: response, message: 'Đăng nhập thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
