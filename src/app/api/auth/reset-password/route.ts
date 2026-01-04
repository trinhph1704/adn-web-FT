import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, otpCode, newPassword } = await request.json();

    // Validate required fields
    if (!email || !otpCode || !newPassword) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    // Validate password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // TODO: Integrate with backend API
    // In production, call actual backend API:
    // const response = await fetch(`${process.env.API_URL}/auth/reset-password`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, otpCode, newPassword }),
    // });

    // Simulate OTP verification
    // In production, this would be verified by the backend
    console.log(`Resetting password for email: ${email} with OTP: ${otpCode}`);

    // Simulate success response
    return NextResponse.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    );
  }
}

