import rootApi from "../../../apis/rootApi";

export type PaymentStatus = 'Paid' | 'Failed' | 'Pending';
export interface Payment {
    id: string;
    orderCode: string | number;
    amount: number;
    depositAmount?: number;
    remainingAmount?: number;
    status: PaymentStatus;
    paidAt?: string | null;
    description?: string;
    bookingId?: string;
    booking?: {
        id: string;
        testServiceId?: string;
        clientId?: string;
        appointmentDate?: string;
        price?: number;
        collectionMethod?: string;
        status?: string;
        note?: string;
        createdAt?: string;
        updatedAt?: string;
        client?: {
            id: string;
            fullName: string;
            email: string;
            role?: string;
            address?: string;
        };
        testService?: {
            id: string;
            name: string;
            description?: string;
            category?: string;
            isActive?: boolean;
            createdAt?: string;
            updatedAt?: string;
            priceServices?: any;
            sampleCount?: number;
        };
        clientName?: string;
        address?: string;
        phone?: string;
    };
    user?: {
        fullName: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export const getPaidPayments = async (token: string): Promise<Payment[]> => {
    try {
        const response = await rootApi.get("/Payment/Get-Payment-Paid", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data as Payment[];
    } catch (error) {
        throw error;
    }
};