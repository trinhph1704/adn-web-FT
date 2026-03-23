import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { hashPassword, verifyToken, isValidEmail, isValidPhone } from '@/lib/utils';
import { createDocument } from '@/lib/supabase/helpers';
import { User, UserRole, CreateStaffRequest, ApiResponse } from '@/types';

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
        { data: null, message: 'Không có quyền truy cập', statusCode: 403 },
        { status: 403 }
      );
    }

    const body: CreateStaffRequest = await request.json();
    const { fullName, email, phone, password, address, role } = body;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng điền đầy đủ thông tin', statusCode: 400 },
        { status: 400 }
      );
    }

    if (role !== UserRole.Staff && role !== UserRole.Manager) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Role không hợp lệ. Chỉ có thể tạo Staff hoặc Manager', statusCode: 400 },
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

    const { data: existingEmail } = await supabaseAdmin
      .from(TABLES.users)
      .select('id')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (existingEmail && existingEmail.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Email đã tồn tại', statusCode: 400 },
        { status: 400 }
      );
    }

    const { data: existingPhone } = await supabaseAdmin
      .from(TABLES.users)
      .select('id')
      .eq('phone', phone)
      .limit(1);

    if (existingPhone && existingPhone.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Số điện thoại đã tồn tại', statusCode: 400 },
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
      role,
      isActive: true,
    };

    const userId = await createDocument(TABLES.users, userData);

    const roleLabels: Record<UserRole, string> = {
      [UserRole.Admin]: 'Admin',
      [UserRole.Staff]: 'Nhân viên',
      [UserRole.Client]: 'Khách hàng',
      [UserRole.Manager]: 'Quản lý',
    };

    return NextResponse.json<ApiResponse<{ userId: string; role: string }>>(
      {
        data: { userId, role: roleLabels[role] },
        message: `Tạo tài khoản ${roleLabels[role]} thành công`,
        statusCode: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create staff error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
