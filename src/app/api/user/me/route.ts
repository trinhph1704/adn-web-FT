import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken, isValidPhone } from '@/lib/utils';
import { User, UserProfileResponse, UpdateProfileRequest, ApiResponse, UserRole } from '@/types';

const roleNames: Record<UserRole, string> = {
  [UserRole.Admin]: 'Admin',
  [UserRole.Staff]: 'Staff',
  [UserRole.Client]: 'Client',
  [UserRole.Manager]: 'Manager',
};

function extractToken(request: NextRequest): { userId: string; role: string } | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  return { userId: payload.userId, role: payload.role };
}

export async function GET(request: NextRequest) {
  try {
    const auth = extractToken(request);
    if (!auth) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Unauthorized', statusCode: 401 },
        { status: 401 }
      );
    }

    const { data: userData, error } = await supabaseAdmin
      .from(TABLES.users)
      .select('*')
      .eq('id', auth.userId)
      .single();

    if (error?.code === 'PGRST116' || !userData) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy người dùng', statusCode: 404 },
        { status: 404 }
      );
    }

    if (error) throw error;

    const user = userData as User;

    const profile: UserProfileResponse = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: roleNames[user.role] || 'Client',
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    return NextResponse.json<ApiResponse<UserProfileResponse>>(
      { data: profile, message: 'Lấy thông tin thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = extractToken(request);
    if (!auth) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Unauthorized', statusCode: 401 },
        { status: 401 }
      );
    }

    const body: UpdateProfileRequest = await request.json();
    const { fullName, phone, address } = body;

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Số điện thoại không hợp lệ', statusCode: 400 },
        { status: 400 }
      );
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from(TABLES.users)
      .select('id')
      .eq('id', auth.userId)
      .single();

    if (fetchError?.code === 'PGRST116' || !existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy người dùng', statusCode: 404 },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (fullName !== undefined) {
      updateData.fullName = fullName.trim();
    }
    if (phone !== undefined) {
      updateData.phone = phone.trim();
    }
    if (address !== undefined) {
      updateData.address = address.trim();
    }

    const { error: updateError } = await supabaseAdmin
      .from(TABLES.users)
      .update(updateData)
      .eq('id', auth.userId);

    if (updateError) throw updateError;

    return NextResponse.json<ApiResponse<{ success: boolean }>>(
      { data: { success: true }, message: 'Cập nhật thông tin thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
