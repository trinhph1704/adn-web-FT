/**
 * API Route: POST /api/auth/register
 * Đăng ký người dùng mới
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { ApiResponse, User, RegisterRequest } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { fullName, email, phone, password, confirmPassword } = body;

    // Validate input
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Vui lòng điền đầy đủ thông tin',
        },
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Mật khẩu xác nhận không khớp',
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Mật khẩu phải có ít nhất 6 ký tự',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Email không hợp lệ',
        },
        { status: 400 }
      );
    }

    // Validate phone format (Vietnam)
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Số điện thoại không hợp lệ',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    try {
      await adminAuth.getUserByEmail(email);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Email đã được sử dụng',
        },
        { status: 409 }
      );
    } catch (error: any) {
      // User not found - good, we can proceed
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: fullName,
      phoneNumber: phone.startsWith('+') ? phone : `+84${phone.slice(1)}`,
    });

    // Create user document in Firestore
    const now = Timestamp.now();
    const userData: Omit<User, 'id'> = {
      fullName,
      email,
      phone,
      address: '',
      role: 'customer', // Default role
      isActive: true,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };

    await adminDb.collection('users').doc(userRecord.uid).set({
      ...userData,
      createdAt: now,
      updatedAt: now,
    });

    // Create custom token
    const token = await adminAuth.createCustomToken(userRecord.uid, {
      role: 'customer',
    });

    const user: User = {
      id: userRecord.uid,
      ...userData,
    };

    return NextResponse.json<ApiResponse<{ user: User; token: string }>>(
      {
        success: true,
        data: {
          user,
          token,
        },
        message: 'Đăng ký thành công',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error:', error);

    let errorMessage = 'Đã xảy ra lỗi khi đăng ký';

    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email đã được sử dụng';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email không hợp lệ';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Mật khẩu quá yếu';
    } else if (error.code === 'auth/phone-number-already-exists') {
      errorMessage = 'Số điện thoại đã được sử dụng';
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

