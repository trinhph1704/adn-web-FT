import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { generateOTP, hashOTP, isValidEmail } from '@/lib/utils';
import { createDocument } from '@/lib/supabase/helpers';
import { User, OtpPurpose, OtpDeliveryMethod, ApiResponse } from '@/types';

const OTP_VALIDITY_MINUTES = 5;
const OTP_COOLDOWN_SECONDS = 60;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Email là bắt buộc', statusCode: 400 },
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
        { data: null, message: 'Không tìm thấy tài khoản với email này', statusCode: 404 },
        { status: 404 }
      );
    }

    const user = users[0] as User;

    const cooldownTime = new Date(Date.now() - OTP_COOLDOWN_SECONDS * 1000).toISOString();
    const { data: recentOtp } = await supabaseAdmin
      .from(TABLES.otpCodes)
      .select('id')
      .eq('userId', user.id)
      .eq('purpose', OtpPurpose.ResetPassword)
      .eq('isUsed', false)
      .gt('createdAt', cooldownTime)
      .limit(1);

    if (recentOtp && recentOtp.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng đợi 60 giây trước khi yêu cầu mã OTP mới', statusCode: 429 },
        { status: 429 }
      );
    }

    const otpCode = generateOTP(6);
    const hashedCode = hashOTP(otpCode);
    const expiresAt = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000).toISOString();

    await createDocument(TABLES.otpCodes, {
      userId: user.id,
      hashedCode,
      deliveryMethod: OtpDeliveryMethod.Email,
      purpose: OtpPurpose.ResetPassword,
      expiresAt,
      isUsed: false,
      sentTo: email.toLowerCase(),
    });

    console.log(`[OTP] Sending OTP ${otpCode} to email: ${email}`);

    const isDev = process.env.NODE_ENV === 'development';

    return NextResponse.json<ApiResponse<{ otpSent: boolean; expiresIn: number; devOtp?: string }>>(
      {
        data: {
          otpSent: true,
          expiresIn: OTP_VALIDITY_MINUTES * 60,
          ...(isDev && { devOtp: otpCode }),
        },
        message: 'Mã OTP đã được gửi đến email của bạn',
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
