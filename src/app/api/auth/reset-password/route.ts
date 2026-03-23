import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { hashPassword, verifyOTP, isValidEmail } from '@/lib/utils';
import { User, OtpCode, OtpPurpose, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { email, otpCode, newPassword } = await request.json();

    if (!email || !otpCode || !newPassword) {
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

    if (newPassword.length < 6) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Mật khẩu phải có ít nhất 6 ký tự', statusCode: 400 },
        { status: 400 }
      );
    }

    const { data: users } = await supabaseAdmin
      .from(TABLES.users)
      .select('*')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (!users || users.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy tài khoản', statusCode: 404 },
        { status: 404 }
      );
    }

    const user = users[0] as User;

    const { data: otpRecords } = await supabaseAdmin
      .from(TABLES.otpCodes)
      .select('*')
      .eq('userId', user.id)
      .eq('purpose', OtpPurpose.ResetPassword)
      .eq('isUsed', false)
      .order('createdAt', { ascending: false })
      .limit(1);

    if (!otpRecords || otpRecords.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Mã OTP không hợp lệ hoặc đã hết hạn', statusCode: 400 },
        { status: 400 }
      );
    }

    const otpData = otpRecords[0] as OtpCode;
    const expiresAt = new Date(otpData.expiresAt);

    if (expiresAt < new Date()) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Mã OTP đã hết hạn', statusCode: 400 },
        { status: 400 }
      );
    }

    if (!verifyOTP(otpCode, otpData.hashedCode)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Mã OTP không chính xác', statusCode: 400 },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await supabaseAdmin
      .from(TABLES.users)
      .update({ passwordHash })
      .eq('id', user.id);

    await supabaseAdmin
      .from(TABLES.otpCodes)
      .update({ isUsed: true })
      .eq('id', otpData.id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>(
      { data: { success: true }, message: 'Đặt lại mật khẩu thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
