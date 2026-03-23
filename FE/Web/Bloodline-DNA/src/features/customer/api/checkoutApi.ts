const BASE_URL = 'https://api.adntester.duckdns.org';

export const callPaymentCallbackApi = async (payload: {
  orderCode: string;
  status: string;
  bookingId: string;
}): Promise<{
  orderCode: string;
  bookingId: string;
  status: 'PAID' | 'CANCELLED';
  success: boolean;
  error?: string;
}> => {
  try {
    // Normalize status: chỉ PAID hoặc CANCELLED
    const normalizedStatus = payload.status === 'PAID' ? 'PAID' : 'CANCELLED';

    const response = await fetch(`${BASE_URL}/api/Payment/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({
        orderCode: payload.orderCode,
        status: normalizedStatus,
        bookingId: payload.bookingId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        orderCode: payload.orderCode,
        bookingId: payload.bookingId,
        status: normalizedStatus,
        success: false,
        error: errorData?.error || 'Unknown server error',
      };
    }

    return {
      orderCode: payload.orderCode,
      bookingId: payload.bookingId,
      status: normalizedStatus,
      success: true,
    };
  } catch (err) {
    return {
      orderCode: payload.orderCode,
      bookingId: payload.bookingId,
      status: payload.status === 'PAID' ? 'PAID' : 'CANCELLED',
      success: false,
      error: err instanceof Error ? err.message : 'Unexpected error',
    };
  }
};
