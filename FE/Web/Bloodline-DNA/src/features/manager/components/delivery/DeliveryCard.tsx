import { Spin } from "antd";
import type { DeliveryOrder, DeliveryStatus } from "../../types/delivery";

interface Props {
  delivery: DeliveryOrder;
  onClick: (id: string) => void;
  loadingId?: string | null;
}

const DeliveryCard = ({ delivery, onClick, loadingId }: Props) => {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStatusColor = (status: DeliveryStatus) => {
    const map: Record<DeliveryStatus, string> = {
      PreparingKit: "bg-orange-100 text-orange-800",
      DeliveringKit: "bg-blue-100 text-blue-800",
      KitDelivered: "bg-green-100 text-green-800",
      WaitingForPickup: "bg-yellow-100 text-yellow-800",
      PickingUpSample: "bg-purple-100 text-purple-800",
      SampleReceived: "bg-emerald-100 text-emerald-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: DeliveryStatus) => {
    const map: Record<DeliveryStatus, string> = {
      PreparingKit: "Đang chuẩn bị bộ Kit",
      DeliveringKit: "Đang giao bộ Kit",
      KitDelivered: "Đã nhận Kit",
      WaitingForPickup: "Đợi đến lấy mẫu",
      PickingUpSample: "Đang lấy mẫu",
      SampleReceived: "Đã nhận mẫu",
      Cancelled: "Huỷ giao hoặc lấy mẫu",
    };
    return map[status] || "Không xác định";
  };

  return (
    <div
      className="relative transition-shadow duration-300 cursor-pointer group"
      onClick={() => onClick(delivery.id)}
    >
      {/* Overlay khi loading */}
      {loadingId === delivery.id ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm">
          <Spin size="small" />
        </div>
      ) : (
        <div className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 rounded-lg opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-xs">
          <p className="text-lg font-semibold text-blue-800 drop-shadow">
            Xem chi tiết và phân công nhiệm vụ
          </p>
        </div>
      )}

      {/* Nội dung chính */}
      <div className="relative z-0 p-6 bg-white rounded-lg shadow-md group-hover:shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              Đơn: #{delivery.id} – Khách hàng: {delivery.name || "Không rõ"}
            </h3>
            {delivery.status === "PreparingKit" && (
              <p className="text-sm text-gray-600">Nhân viên: {delivery.staff}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              delivery.status
            )}`}
          >
            {getStatusText(delivery.status)}
          </span>
        </div>

        <div className="flex flex-wrap items-start mb-4 gap-x-60 gap-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-600">
              Thời gian tạo đơn:
            </span>
            <p className="text-sm text-gray-800">
              {formatDateTime(delivery.scheduleAt)}
            </p>
          </div>
        </div>

        {delivery.note && (
          <div className="pt-4 border-t">
            <h4 className="mb-2 font-medium text-gray-700">Ghi chú</h4>
            <p className="p-3 text-sm text-gray-600 rounded-md bg-gray-50">
              {delivery.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryCard;
