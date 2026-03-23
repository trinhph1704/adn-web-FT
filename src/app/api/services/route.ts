import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { createDocument } from '@/lib/supabase/helpers';
import {
  TestService,
  ServicePrice,
  CreateTestServiceDto,
  ApiResponse,
  SampleCollectionMethod,
  TestServiceType,
} from '@/types';

export async function GET() {
  try {
    const { data: prices, error } = await supabaseAdmin
      .from(TABLES.servicePrices)
      .select('*')
      .is('effectiveTo', null);

    if (error) throw error;

    const servicePrices: Array<ServicePrice & { testServiceInfor?: TestService }> = [];

    for (const priceData of prices || []) {
      const { data: serviceData } = await supabaseAdmin
        .from(TABLES.testServices)
        .select('*')
        .eq('id', priceData.serviceId)
        .single();

      if (serviceData && serviceData.isActive) {
        servicePrices.push({
          ...priceData,
          testServiceInfor: serviceData as TestService,
        });
      }
    }

    servicePrices.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json<ApiResponse<typeof servicePrices>>(
      { data: servicePrices, message: 'Lấy danh sách dịch vụ thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    if (payload.role !== 'Admin' && payload.role !== 'Manager') {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền truy cập', statusCode: 403 },
        { status: 403 }
      );
    }

    const body: CreateTestServiceDto = await request.json();
    const { name, description, sampleCount, type, prices, imageUrl, features } = body;

    if (!name || !description || sampleCount === undefined || type === undefined || !prices?.length) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng điền đầy đủ thông tin', statusCode: 400 },
        { status: 400 }
      );
    }

    if (type === TestServiceType.Legal) {
      const hasSelfSample = prices.some(
        (p) => p.collectionMethod === SampleCollectionMethod.SelfSample
      );
      if (hasSelfSample) {
        return NextResponse.json<ApiResponse<null>>(
          { data: null, message: 'Không thể tạo dịch vụ pháp lý với phương thức tự lấy mẫu', statusCode: 400 },
          { status: 400 }
        );
      }
    }

    const serviceData: Omit<TestService, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      description: description.trim(),
      sampleCount,
      type,
      isActive: true,
      imageUrl: imageUrl?.trim() || undefined,
      features: features?.filter((f) => f.trim().length > 0).map((f) => f.trim()),
    };

    const serviceId = await createDocument(TABLES.testServices, serviceData);

    for (const priceInfo of prices) {
      const priceData: Omit<ServicePrice, 'id' | 'createdAt' | 'updatedAt'> = {
        serviceId,
        price: priceInfo.price,
        collectionMethod: priceInfo.collectionMethod,
        effectiveFrom: new Date(),
        effectiveTo: null,
      };
      await createDocument(TABLES.servicePrices, priceData);
    }

    return NextResponse.json<ApiResponse<{ serviceId: string }>>(
      { data: { serviceId }, message: 'Tạo dịch vụ thành công', statusCode: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
