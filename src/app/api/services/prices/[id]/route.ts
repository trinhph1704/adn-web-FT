import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/utils';
import { ServicePrice, UpdateServicePriceDto, ApiResponse } from '@/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const { data: price, error } = await supabaseAdmin
      .from(TABLES.servicePrices)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !price) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy giá dịch vụ', statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<ServicePrice>>(
      { data: price as ServicePrice, message: 'Lấy thông tin giá thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get price error:', error);
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
    if (!payload || (payload.role !== 'Admin' && payload.role !== 'Manager')) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền truy cập', statusCode: 403 },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body: UpdateServicePriceDto = await request.json();

    const { data: existing } = await supabaseAdmin
      .from(TABLES.servicePrices)
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy giá dịch vụ', statusCode: 404 },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (body.price !== undefined) updateData.price = body.price;
    if (body.collectionMethod !== undefined) updateData.collectionMethod = body.collectionMethod;
    if (body.effectiveTo !== undefined) updateData.effectiveTo = new Date(body.effectiveTo).toISOString();

    await supabaseAdmin.from(TABLES.servicePrices).update(updateData).eq('id', id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>(
      { data: { success: true }, message: 'Cập nhật giá thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update price error:', error);
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
    if (!payload || (payload.role !== 'Admin' && payload.role !== 'Manager')) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không có quyền truy cập', statusCode: 403 },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const { data: existing } = await supabaseAdmin
      .from(TABLES.servicePrices)
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'Không tìm thấy giá dịch vụ', statusCode: 404 },
        { status: 404 }
      );
    }

    await supabaseAdmin.from(TABLES.servicePrices).delete().eq('id', id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>(
      { data: { success: true }, message: 'Xóa giá thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete price error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
