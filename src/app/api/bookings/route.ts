import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { createDocument, generateId } from '@/lib/supabase/helpers';
import { TestBooking, TestKit, CreateTestBookingDto, ApiResponse, BookingStatus, ServicePrice, TestService } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });
    }

    let query = supabaseAdmin.from(TABLES.testBookings).select('*').order('createdAt', { ascending: false });

    if (payload.role === 'Client') {
      query = query.eq('clientId', payload.userId);
    }

    const { data: bookingsData, error } = await query;
    if (error) throw error;

    const bookings: TestBooking[] = [];
    for (const bookingData of bookingsData || []) {
      if (bookingData.testServiceId) {
        const { data: serviceData } = await supabaseAdmin
          .from(TABLES.testServices)
          .select('*')
          .eq('id', bookingData.testServiceId)
          .single();
        if (serviceData) {
          bookingData.testService = serviceData as TestService;
        }
      }
      bookings.push(bookingData as TestBooking);
    }

    return NextResponse.json<ApiResponse<TestBooking[]>>(
      { data: bookings, message: 'Lấy danh sách đặt lịch thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Unauthorized', statusCode: 401 }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Token không hợp lệ', statusCode: 401 }, { status: 401 });
    }

    const body: CreateTestBookingDto = await request.json();
    const { testServiceId, priceServiceId, collectionMethod, appointmentDate, note, clientName, address, phone } = body;

    if (!testServiceId || !appointmentDate || !clientName || !phone) {
      return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Vui lòng điền đầy đủ thông tin', statusCode: 400 }, { status: 400 });
    }

    let priceData: ServicePrice | null = null;
    if (priceServiceId) {
      const { data } = await supabaseAdmin.from(TABLES.servicePrices).select('*').eq('id', priceServiceId).single();
      if (data) priceData = data as ServicePrice;
    }

    let serviceData: TestService | null = null;
    const { data: svc } = await supabaseAdmin.from(TABLES.testServices).select('*').eq('id', testServiceId).single();
    if (svc) serviceData = svc as TestService;

    const sampleCount = serviceData?.sampleCount || 2;
    const price = priceData?.price || 3500000;

    const bookingId = generateId();

    const kitData = {
      bookingId,
      collectionMethod,
      sampleCount,
    };
    const kitId = await createDocument(TABLES.testKits, kitData);

    const now = new Date().toISOString();
    const { error: bookingError } = await supabaseAdmin.from(TABLES.testBookings).insert({
      id: bookingId,
      clientId: payload.userId,
      testServiceId,
      price,
      collectionMethod,
      status: BookingStatus.Pending,
      appointmentDate: new Date(appointmentDate).toISOString(),
      note: note || '',
      clientName,
      address: address || '',
      phone,
      kitId,
      createdAt: now,
      updatedAt: now,
    });

    if (bookingError) throw bookingError;

    await supabaseAdmin.from(TABLES.testKits).update({ bookingId }).eq('id', kitId);

    return NextResponse.json<ApiResponse<{ bookingId: string }>>(
      { data: { bookingId }, message: 'Tạo đặt lịch thành công', statusCode: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json<ApiResponse<null>>({ data: null, message: 'Lỗi máy chủ', statusCode: 500 }, { status: 500 });
  }
}
