import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@/lib/supabase/server';
import { ApiResponse, SampleTypeInstruction } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sampleType: string }> }
) {
  try {
    const { sampleType } = await params;
    const sampleTypeNum = parseInt(sampleType, 10);

    if (isNaN(sampleTypeNum)) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, message: 'sampleType không hợp lệ', statusCode: 400 },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from(TABLES.sampleInstructions)
      .select('*')
      .eq('sampleType', sampleTypeNum);

    if (error) throw error;

    return NextResponse.json<ApiResponse<SampleTypeInstruction[]>>(
      { data: (data || []) as SampleTypeInstruction[], message: 'Lấy hướng dẫn theo loại mẫu thành công', statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get instructions by sample type error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, message: 'Lỗi máy chủ', statusCode: 500 },
      { status: 500 }
    );
  }
}
