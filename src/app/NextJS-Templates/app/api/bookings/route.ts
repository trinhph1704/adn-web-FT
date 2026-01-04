/**
 * API Route: /api/bookings
 * GET - Lấy danh sách booking
 * POST - Tạo booking mới
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { ApiResponse, TestBooking, CreateBookingDTO } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

// Helper: Verify token và lấy user
async function verifyAndGetUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) return null;
    
    return {
      uid: decodedToken.uid,
      ...userDoc.data(),
    };
  } catch {
    return null;
  }
}

// ==================== GET: Lấy danh sách booking ====================
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAndGetUser(request);
    
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Vui lòng đăng nhập',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query based on role
    let query: FirebaseFirestore.Query = adminDb.collection('bookings');

    // Customer chỉ thấy booking của mình
    if (user.role === 'customer') {
      query = query.where('clientId', '==', user.uid);
    }

    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('createdAt', 'desc');

    // Get total count
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Pagination
    query = query.limit(limit).offset((page - 1) * limit);

    const bookingsSnapshot = await query.get();
    const bookings: TestBooking[] = [];

    for (const doc of bookingsSnapshot.docs) {
      const data = doc.data();
      
      // Get service info
      let service = null;
      if (data.serviceId) {
        const serviceDoc = await adminDb.collection('testServices').doc(data.serviceId).get();
        if (serviceDoc.exists) {
          service = { id: serviceDoc.id, ...serviceDoc.data() };
        }
      }

      bookings.push({
        id: doc.id,
        clientId: data.clientId,
        serviceId: data.serviceId,
        priceId: data.priceId,
        clientName: data.clientName,
        phone: data.phone,
        address: data.address,
        appointmentDate: data.appointmentDate?.toDate(),
        collectionMethod: data.collectionMethod,
        status: data.status,
        price: data.price,
        note: data.note,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        service: service as any,
      });
    }

    return NextResponse.json<ApiResponse<{
      bookings: TestBooking[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>>(
      {
        success: true,
        data: {
          bookings,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Không thể tải danh sách đặt lịch',
      },
      { status: 500 }
    );
  }
}

// ==================== POST: Tạo booking mới ====================
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAndGetUser(request);
    
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Vui lòng đăng nhập để đặt lịch',
        },
        { status: 401 }
      );
    }

    const body: CreateBookingDTO = await request.json();
    const { serviceId, priceId, clientName, phone, address, appointmentDate, note } = body;

    // Validate
    if (!serviceId || !priceId || !clientName || !phone || !address || !appointmentDate) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Vui lòng điền đầy đủ thông tin',
        },
        { status: 400 }
      );
    }

    // Validate phone
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

    // Validate appointment date (must be in future)
    const appointmentDateObj = new Date(appointmentDate);
    if (appointmentDateObj <= new Date()) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Ngày hẹn phải là ngày trong tương lai',
        },
        { status: 400 }
      );
    }

    // Get service and price info
    const serviceDoc = await adminDb.collection('testServices').doc(serviceId).get();
    if (!serviceDoc.exists) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Dịch vụ không tồn tại',
        },
        { status: 404 }
      );
    }

    const priceDoc = await adminDb.collection('servicePrices').doc(priceId).get();
    if (!priceDoc.exists) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Gói giá không tồn tại',
        },
        { status: 404 }
      );
    }

    const priceData = priceDoc.data()!;

    // Create booking
    const now = Timestamp.now();
    const bookingRef = await adminDb.collection('bookings').add({
      clientId: user.uid,
      serviceId,
      priceId,
      clientName,
      phone: phone.replace(/\s/g, ''),
      address,
      appointmentDate: Timestamp.fromDate(appointmentDateObj),
      collectionMethod: priceData.collectionMethod,
      status: 'pending',
      price: priceData.price,
      note: note || '',
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json<ApiResponse<{ id: string; bookingCode: string }>>(
      {
        success: true,
        data: {
          id: bookingRef.id,
          bookingCode: `BK-${bookingRef.id.substring(0, 8).toUpperCase()}`,
        },
        message: 'Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Không thể tạo đặt lịch. Vui lòng thử lại.',
      },
      { status: 500 }
    );
  }
}

