import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { User, ApiResponse, UserRole } from '@/types';

const roleNames: Record<UserRole, string> = {
  [UserRole.Admin]: 'Admin',
  [UserRole.Staff]: 'Staff',
  [UserRole.Client]: 'Client',
  [UserRole.Manager]: 'Manager',
};

interface UserListDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

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

    if (payload.role !== 'Admin') {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền truy cập', statusCode: 403 },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');
    const isActiveFilter = searchParams.get('isActive');

    let query = supabaseAdmin
      .from(TABLES.users)
      .select('*');

    if (roleFilter !== null) {
      const roleValue = parseInt(roleFilter);
      if (!isNaN(roleValue) && roleValue in UserRole) {
        query = query.eq('role', roleValue);
      }
    }

    if (isActiveFilter !== null) {
      query = query.eq('isActive', isActiveFilter === 'true');
    }

    query = query.order('createdAt', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    const users: UserListDto[] = (data || []).map((userData: User) => ({
      id: userData.id,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      role: roleNames[userData.role] || 'Client',
      isActive: userData.isActive,
      createdAt: userData.createdAt,
    }));

    return NextResponse.json<ApiResponse<UserListDto[]>>(
      { data: users, message: 'Lấy danh sách người dùng thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
