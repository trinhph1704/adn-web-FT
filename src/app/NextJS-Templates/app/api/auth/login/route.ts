/**
 * API Route: POST /api/auth/login
 * Đăng nhập người dùng với email và password
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { ApiResponse, LoginResponse, User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Email và mật khẩu là bắt buộc',
        },
        { status: 400 }
      );
    }

    // Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get user data from Firestore
    const userDoc = await adminDb.collection('users').doc(firebaseUser.uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Không tìm thấy thông tin người dùng',
        },
        { status: 404 }
      );
    }

    const userData = userDoc.data() as Omit<User, 'id'>;

    // Check if user is active
    if (!userData.isActive) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Tài khoản đã bị vô hiệu hóa',
        },
        { status: 403 }
      );
    }

    // Create custom token for client
    const token = await adminAuth.createCustomToken(firebaseUser.uid, {
      role: userData.role,
    });

    const user: User = {
      id: firebaseUser.uid,
      ...userData,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    return NextResponse.json<ApiResponse<LoginResponse>>(
      {
        success: true,
        data: {
          user,
          token,
        },
        message: 'Đăng nhập thành công',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);

    // Handle specific Firebase Auth errors
    let errorMessage = 'Đã xảy ra lỗi khi đăng nhập';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Email không tồn tại trong hệ thống';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Mật khẩu không chính xác';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email không hợp lệ';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'Tài khoản đã bị vô hiệu hóa';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Quá nhiều lần thử. Vui lòng thử lại sau';
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: errorMessage,
      },
      { status: 401 }
    );
  }
}

