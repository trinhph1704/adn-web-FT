import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { TestService, ServicePrice, UpdateTestServiceDto, ApiResponse } from '@/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const { data: service, error } = await supabaseAdmin
      .from(TABLES.testServices)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !service) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy dịch vụ', statusCode: 404 },
        { status: 404 }
      );
    }

    const { data: prices } = await supabaseAdmin
      .from(TABLES.servicePrices)
      .select('*')
      .eq('serviceId', id)
      .is('effectiveTo', null);

    return NextResponse.json<ApiResponse<TestService & { prices: ServicePrice[] }>>(
      {
        data: { ...service, prices: (prices || []) as ServicePrice[] },
        message: 'Lấy thông tin dịch vụ thành công',
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get service error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;
    const body: UpdateTestServiceDto = await request.json();

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from(TABLES.testServices)
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy dịch vụ', statusCode: 404 },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.sampleCount !== undefined) updateData.sampleCount = body.sampleCount;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl.trim() || null;
    if (body.features !== undefined) {
      updateData.features = body.features.map((f) => f.trim()).filter((f) => f.length > 0);
    }

    await supabaseAdmin.from(TABLES.testServices).update(updateData).eq('id', id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>(
      { data: { success: true }, message: 'Cập nhật dịch vụ thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;

    const { data: existing } = await supabaseAdmin
      .from(TABLES.testServices)
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy dịch vụ', statusCode: 404 },
        { status: 404 }
      );
    }

    // CASCADE delete handles prices automatically
    await supabaseAdmin.from(TABLES.testServices).delete().eq('id', id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>(
      { data: { success: true }, message: 'Xóa dịch vụ thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
