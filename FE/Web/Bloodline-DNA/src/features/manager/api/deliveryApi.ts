import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../../apis/rootApi";
import type {
  ActiveStaff,
  DeliveryLogistic,
  DeliveryOrder,
  DeliveryStatus,
} from "../types/delivery";

const validStatuses: DeliveryStatus[] = [
  "PreparingKit",
  "DeliveringKit",
  "KitDelivered",
  "WaitingForPickup",
  "PickingUpSample",
  "SampleReceived",
  "Cancelled",
];

const isValidStatus = (status: string): status is DeliveryStatus =>
  validStatuses.includes(status as DeliveryStatus);

export const getDeliveryLogistics = async (): Promise<DeliveryOrder[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/Logistic`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.data.success && Array.isArray(response.data.data)) {
    return response.data.data.map((item: DeliveryLogistic) => {
      const status = isValidStatus(item.status) ? item.status : "Cancelled";

      return {
        id: item.id,
        name: item.name,
        staff: item.staff?.fullName || "Chưa phân công",
        address: item.address,
        phone: item.phone,
        scheduleAt: item.scheduledAt,
        completeAt: item.completedAt,
        note: item.note,
        imageUrl: item.imageUrl,
        status,
      };
    });
  } else {
    throw new Error("Dữ liệu không hợp lệ từ server.");
  }
};

export const getDeliveryLogisticById = async (
  id: string
): Promise<DeliveryOrder> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/Logistic/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.data.success && response.data.data) {
    const item: DeliveryLogistic = response.data.data;
    const status = isValidStatus(item.status) ? item.status : "Cancelled";

    return {
      id: item.id,
      staff: item.staff?.fullName || "Chưa phân công",
      name: item.name,
      address: item.address,
      phone: item.phone,
      scheduleAt: item.scheduledAt,
      completeAt: item.completedAt,
      imageUrl: item.imageUrl,
      note: item.note,
      status,
    };
  } else {
    throw new Error("Không tìm thấy đơn logistic với ID này.");
  }
};

export const getActiveStaff = async (token: string): Promise<ActiveStaff[]> => {
  try {
    const response = await axios.get<{
      success: boolean;
      data: ActiveStaff[];
    }>(`${BASE_URL}/admin/active-staff`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }

    throw new Error("Unknown error occurred");
  }
};

export const assignDeliveryStaff = async (
  logisticsInfoId: string,
  staffId: string,
  token: string
): Promise<void> => {
  try {
    await axios.put(
      `${BASE_URL}/Logistic/assign/${logisticsInfoId}?staffId=${staffId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Lỗi phân công nhân viên"
    );
  }
};
