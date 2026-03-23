import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { createDocument } from '@/lib/supabase/helpers';
import {
  ServicePrice,
  TestService,
  CreateServicePriceFullDto,
  ApiResponse,
  SampleCollectionMethod,
} from '@/types';

const collectionMethodLabels: Record<SampleCollectionMethod, string> = {
  [SampleCollectionMethod.SelfSample]: 'SelfSample',
  [SampleCollectionMethod.AtFacility]: 'AtFacility',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    let query = supabaseAdmin.from(TABLES.servicePrices).select('*');

    if (serviceId) {
      query = query.eq('serviceId', serviceId);
    }

    if (activeOnly) {
      query = query.is('effectiveTo', null);
    }

    const { data: prices, error } = await query;
    if (error) throw error;

    const pricesWithService: Array<
      ServicePrice & { testServiceInfor?: TestService; collectionMethodLabel: string }
    > = [];

    for (const priceData of prices || []) {
      const { data: serviceData } = await supabaseAdmin
        .from(TABLES.testServices)
        .select('*')
        .eq('id', priceData.serviceId)
        .single();

      if (activeOnly && serviceData && !serviceData.isActive) continue;

      pricesWithService.push({
        ...priceData,
        testServiceInfor: serviceData as TestService | undefined,
        collectionMethodLabel: collectionMethodLabels[priceData.collectionMethod as SampleCollectionMethod] || 'Unknown',
      });
    }

    pricesWithService.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json<ApiResponse<typeof pricesWithService>>(
      { data: pricesWithService, message: 'Lấy danh sách giá dịch vụ thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get prices error:', error);
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

    const body: CreateServicePriceFullDto = await request.json();
    const { serviceId, price, collectionMethod, effectiveFrom, effectiveTo } = body;

    if (!serviceId || price === undefined || collectionMethod === undefined) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Vui lòng điền đầy đủ thông tin', statusCode: 400 },
        { status: 400 }
      );
    }

    const { data: serviceExists } = await supabaseAdmin
      .from(TABLES.testServices)
      .select('id')
      .eq('id', serviceId)
      .single();

    if (!serviceExists) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy dịch vụ', statusCode: 404 },
        { status: 404 }
      );
    }

    const priceData: Omit<ServicePrice, 'id' | 'createdAt' | 'updatedAt'> = {
      serviceId,
      price,
      collectionMethod,
      effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : new Date(),
      effectiveTo: effectiveTo ? new Date(effectiveTo) : null,
    };

    const priceId = await createDocument(TABLES.servicePrices, priceData);

    return NextResponse.json<ApiResponse<{ priceId: string }>>(
      { data: { priceId }, message: 'Tạo giá dịch vụ thành công', statusCode: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create price error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
