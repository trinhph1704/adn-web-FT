/**
 * API Route: /api/services
 * GET - Lấy danh sách dịch vụ xét nghiệm ADN
 * POST - Tạo dịch vụ mới (chỉ manager/admin)
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { ApiResponse, TestService, ServicePrice } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

// ==================== GET: Lấy danh sách dịch vụ ====================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'civil' | 'legal' | null
    const activeOnly = searchParams.get('active') !== 'false';

    // Build query
    let query: FirebaseFirestore.Query = adminDb.collection('testServices');

    if (type) {
      query = query.where('type', '==', type);
    }

    if (activeOnly) {
      query = query.where('isActive', '==', true);
    }

    query = query.orderBy('createdAt', 'desc');

    const servicesSnapshot = await query.get();
    const services: TestService[] = [];

    for (const doc of servicesSnapshot.docs) {
      const data = doc.data();
      services.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        type: data.type,
        sampleCount: data.sampleCount,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    }

    // Get prices for each service
    const servicesWithPrices = await Promise.all(
      services.map(async (service) => {
        const pricesSnapshot = await adminDb
          .collection('servicePrices')
          .where('serviceId', '==', service.id)
          .where('isActive', '==', true)
          .get();

        const prices: ServicePrice[] = pricesSnapshot.docs.map((priceDoc) => {
          const priceData = priceDoc.data();
          return {
            id: priceDoc.id,
            serviceId: priceData.serviceId,
            price: priceData.price,
            collectionMethod: priceData.collectionMethod,
            currency: priceData.currency || 'VND',
            effectiveFrom: priceData.effectiveFrom?.toDate(),
            effectiveTo: priceData.effectiveTo?.toDate(),
            isActive: priceData.isActive,
            createdAt: priceData.createdAt?.toDate(),
            updatedAt: priceData.updatedAt?.toDate(),
          };
        });

        return {
          ...service,
          prices,
        };
      })
    );

    return NextResponse.json<ApiResponse<typeof servicesWithPrices>>(
      {
        success: true,
        data: servicesWithPrices,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Không thể tải danh sách dịch vụ',
      },
      { status: 500 }
    );
  }
}

// ==================== POST: Tạo dịch vụ mới ====================
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Không có quyền truy cập',
        },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Check role
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (!userData || !['manager', 'admin'].includes(userData.role)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Bạn không có quyền thực hiện hành động này',
        },
        { status: 403 }
      );
    }

    // Parse body
    const body = await request.json();
    const { name, description, type, sampleCount, prices } = body;

    // Validate
    if (!name || !description || !type) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Vui lòng điền đầy đủ thông tin',
        },
        { status: 400 }
      );
    }

    // Create service
    const now = Timestamp.now();
    const serviceRef = await adminDb.collection('testServices').add({
      name,
      description,
      type,
      sampleCount: sampleCount || 2,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Create prices if provided
    if (prices && Array.isArray(prices)) {
      const batch = adminDb.batch();

      prices.forEach((price: { price: number; collectionMethod: string }) => {
        const priceRef = adminDb.collection('servicePrices').doc();
        batch.set(priceRef, {
          serviceId: serviceRef.id,
          price: price.price,
          collectionMethod: price.collectionMethod,
          currency: 'VND',
          effectiveFrom: now,
          effectiveTo: Timestamp.fromDate(
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
          ),
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });
      });

      await batch.commit();
    }

    return NextResponse.json<ApiResponse<{ id: string }>>(
      {
        success: true,
        data: { id: serviceRef.id },
        message: 'Tạo dịch vụ thành công',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Không thể tạo dịch vụ',
      },
      { status: 500 }
    );
  }
}

