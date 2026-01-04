// GET /api/bookings - Get all bookings (filtered by role)
// POST /api/bookings - Create new booking

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { verifyToken } from '@/lib/utils';
import { createDocument, generateId } from '@/lib/firebase/firestore';
import { 
  TestBooking, 
  TestKit,
  CreateTestBookingDto, 
  ApiResponse,
  BookingStatus,
  ServicePrice,
  TestService
} from '@/types';

// GET - Get all bookings
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
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

    let query: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.testBookings);

    // Filter by user role
    if (payload.role === 'Client') {
      // Clients can only see their own bookings
      query = query.where('clientId', '==', payload.userId);
    }
    // Admin, Manager, Staff can see all bookings

    query = query.orderBy('createdAt', 'desc');

    const bookingsSnapshot = await query.get();
    const bookings: TestBooking[] = [];

    for (const doc of bookingsSnapshot.docs) {
      const bookingData = doc.data() as TestBooking;
      
      // Get service info
      if (bookingData.testServiceId) {
        const serviceDoc = await adminDb
          .collection(COLLECTIONS.testServices)
          .doc(bookingData.testServiceId)
          .get();
        
        if (serviceDoc.exists) {
          bookingData.testService = serviceDoc.data() as TestService;
        }
      }

      bookings.push(bookingData);
    }

    return NextResponse.json<ApiResponse<TestBooking[]>>(
      { 
        data: bookings, 
        message: 'Lấy danh sách đặt lịch thành công', 
        statusCode: 200 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}

// POST - Create new booking with test kit
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
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

    const body: CreateTestBookingDto = await request.json();
    const { 
      testServiceId, 
      priceServiceId, 
      collectionMethod, 
      appointmentDate, 
      note, 
      clientName, 
      address, 
      phone 
    } = body;

    // Validate required fields
    if (!testServiceId || !priceServiceId || !appointmentDate || !clientName || !phone) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng điền đầy đủ thông tin', statusCode: 400 },
        { status: 400 }
      );
    }

    // Get service price info
    const priceDoc = await adminDb
      .collection(COLLECTIONS.servicePrices)
      .doc(priceServiceId)
      .get();

    if (!priceDoc.exists) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy thông tin giá dịch vụ', statusCode: 404 },
        { status: 404 }
      );
    }

    const priceData = priceDoc.data() as ServicePrice;

    // Get service info for sample count
    const serviceDoc = await adminDb
      .collection(COLLECTIONS.testServices)
      .doc(testServiceId)
      .get();

    if (!serviceDoc.exists) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy dịch vụ', statusCode: 404 },
        { status: 404 }
      );
    }

    const serviceData = serviceDoc.data() as TestService;

    // Create booking ID
    const bookingId = generateId();

    // Create test kit
    const kitData: Omit<TestKit, 'id' | 'createdAt' | 'updatedAt'> = {
      bookingId,
      collectionMethod,
      sampleCount: serviceData.sampleCount,
      samples: []
    };

    const kitId = await createDocument(COLLECTIONS.testKits, kitData);

    // Create booking
    const bookingData: Omit<TestBooking, 'id' | 'createdAt' | 'updatedAt'> = {
      clientId: payload.userId,
      testServiceId,
      price: priceData.price,
      collectionMethod,
      status: BookingStatus.Pending,
      appointmentDate: new Date(appointmentDate),
      note: note || '',
      clientName,
      address: address || '',
      phone
    };

    // Save booking with the pre-generated ID
    await adminDb.collection(COLLECTIONS.testBookings).doc(bookingId).set({
      ...bookingData,
      id: bookingId,
      kitId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update kit with booking reference
    await adminDb.collection(COLLECTIONS.testKits).doc(kitId).update({
      bookingId
    });

    return NextResponse.json<ApiResponse<{ bookingId: string }>>(
      { 
        data: { bookingId }, 
        message: 'Tạo đặt lịch thành công', 
        statusCode: 201 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}

