import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // TODO: Integrate with backend API
    // For now, simulate sending OTP
    // In production, call actual backend API:
    // const response = await fetch(`${process.env.API_URL}/auth/forgot-password`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // });

    // Simulate success response
    console.log(`Sending OTP to email: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    );
  }
}

