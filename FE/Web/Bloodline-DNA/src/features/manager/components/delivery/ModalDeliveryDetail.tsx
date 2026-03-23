import { Badge, Descriptions, Modal, Select, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { assignDeliveryStaff, getActiveStaff } from "../../api/deliveryApi";
import type {
  ActiveStaff,
  DeliveryOrder,
  DeliveryStatus,
} from "../../types/delivery";

interface Props {
  visible: boolean;
  onClose: () => void;
  delivery: DeliveryOrder | null;
  onRefresh?: () => void;
  canAssignStaff?: boolean;
}

// Định nghĩa trạng thái với text & màu
const statusMap: Record<DeliveryStatus, { text: string; color: string }> = {
  PreparingKit: { text: "Đang chuẩn bị bộ Kit", color: "orange" },
  DeliveringKit: { text: "Đang giao bộ Kit", color: "blue" },
  KitDelivered: { text: "Đã nhận Kit", color: "green" },
  WaitingForPickup: { text: "Đợi đến lấy mẫu", color: "gold" },
  PickingUpSample: { text: "Đang lấy mẫu", color: "purple" },
  SampleReceived: { text: "Đã nhận mẫu", color: "cyan" },
  Cancelled: { text: "Huỷ giao hoặc lấy mẫu", color: "red" },
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DeliveryDetailModal = ({
  visible,
  onClose,
  delivery,
  onRefresh,
  canAssignStaff = false,
}: Props) => {
  const [staffList, setStaffList] = useState<ActiveStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchStaff = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        const staff = await getActiveStaff(token);
        setStaffList(staff);
      } catch (err) {
        message.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchStaff();
    }
  }, [visible]);

  useEffect(() => {
    if (delivery) {
      setSelectedStaff(delivery.staff || undefined);
    }
  }, [delivery]);

  const handleStaffChange = async (value: string | undefined) => {
    if (!delivery) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    if (!value) {
      setSelectedStaff(undefined);
      return;
    }

    try {
      setAssignLoading(true);
      await assignDeliveryStaff(delivery.id, value, token);
      setSelectedStaff(value);

      // Cập nhật delivery object với staff mới
      const updatedDelivery = { ...delivery, staff: value };

      message.success("Phân công nhân viên thành công");

      // Gọi onRefresh để cập nhật data từ server
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      message.error((err as Error).message);
      setSelectedStaff(delivery.staff || undefined);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleClose = () => {
    // Không reset selectedStaff khi đóng modal
    onClose();
  };

  if (!delivery) return null;

  // Debug để kiểm tra imageUrl
  console.log('Delivery imageUrl:', delivery.imageUrl);

  // Lấy status info an toàn
  const statusInfo = statusMap[delivery.status] ?? {
    text: delivery.status || "Không xác định",
    color: "gray",
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      title={`Chi tiết đơn hàng #${delivery.id}`}
      footer={null}
      width={650}
    >
      {loading ? (
        <Spin />
      ) : (
        <Descriptions
          bordered
          column={1}
          labelStyle={{ fontWeight: 600, width: "200px" }}
          contentStyle={{ fontSize: 14 }}
        >
          {delivery.status === "PreparingKit" && (
            <Descriptions.Item label="Nhân viên">
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn nhân viên để phân công"
                value={selectedStaff}
                onChange={handleStaffChange}
                allowClear
                loading={assignLoading}
                disabled={assignLoading || !canAssignStaff}
              >
                {staffList.map((staff) => (
                  <Select.Option key={staff.id} value={staff.id}>
                    {staff.fullName} ({staff.email})
                  </Select.Option>
                ))}
              </Select>
              {/* {selectedStaff && (
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  Đã phân công:{" "}
                  {staffList.find((s) => s.id === selectedStaff)?.fullName ||
                    "Đang tải..."}
                </div>
              )} */}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Khách hàng">
            {delivery.name}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {delivery.address}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {delivery.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian tạo đơn">
            {formatDateTime(delivery.scheduleAt)}
          </Descriptions.Item>
          {delivery.completeAt && (
            <Descriptions.Item label="Thời gian hoàn thành">
              {formatDateTime(delivery.completeAt)}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Ghi chú">
            {delivery.note || "Không có"}
          </Descriptions.Item>
          <Descriptions.Item label="Ảnh xác nhận">
            {delivery.imageUrl ? (
              <img
                src={delivery.imageUrl}
                alt="Ảnh xác nhận"
                style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
              />
            ) : (
              "Chưa có ảnh xác nhận"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Badge color={statusInfo.color} text={statusInfo.text} />
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DeliveryDetailModal;
