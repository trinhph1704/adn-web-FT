import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { User, UserRole, ApiResponse } from '@/types';

const roleNames: Record<UserRole, string> = {
  [UserRole.Admin]: 'Admin',
  [UserRole.Staff]: 'Staff',
  [UserRole.Client]: 'Client',
  [UserRole.Manager]: 'Manager',
};

interface StaffListDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
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

    if (payload.role !== 'Admin' && payload.role !== 'Manager') {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền truy cập', statusCode: 403 },
        { status: 403 }
      );
    }

    const { data: staffData, error } = await supabaseAdmin
      .from(TABLES.users)
      .select('*')
      .eq('role', UserRole.Staff)
      .eq('isActive', true)
      .order('fullName', { ascending: true });

    if (error) throw error;

    const staffList: StaffListDto[] = (staffData || []).map((data: User) => ({
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: roleNames[data.role] || 'Staff',
      isActive: data.isActive,
    }));

    return NextResponse.json<ApiResponse<StaffListDto[]>>(
      { data: staffList, message: 'Lấy danh sách nhân viên thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get active staff error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
