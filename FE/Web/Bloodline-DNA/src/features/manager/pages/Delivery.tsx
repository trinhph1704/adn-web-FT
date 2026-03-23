import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "../../../components";
import {
  getDeliveryLogisticById,
  getDeliveryLogistics,
} from "../api/deliveryApi";
import DeliveryCard from "../components/delivery/DeliveryCard";
import DeliveryDetailModal from "../components/delivery/ModalDeliveryDetail";
import StatCard from "../components/delivery/StatCard";
import type { DeliveryOrder, DeliveryStatus } from "../types/delivery";

const DeliveryStatusLabel: Record<DeliveryStatus, string> = {
  PreparingKit: "Chuẩn bị Kit",
  DeliveringKit: "Giao Kit",
  KitDelivered: "Đã nhận Kit",
  WaitingForPickup: "Đợi lấy mẫu",
  PickingUpSample: "Đang lấy mẫu",
  SampleReceived: "Đã nhận mẫu",
  Cancelled: "Đã hủy",
};

function Delivery() {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryOrder | null>(null);

  const fetchDeliveries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDeliveryLogistics();
      setDeliveries(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách logistics:", error);
      setDeliveries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleOpenModal = async (id: string) => {
    setLoadingId(id);
    try {
      const delivery = await getDeliveryLogisticById(id);
      setSelectedDelivery(delivery);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    if (filterStatus === "all") return true;
    return delivery.status === filterStatus;
  });

  const stats = {
    total: deliveries.length,
    preparingKit: deliveries.filter((d) => d.status === "PreparingKit").length,
    deliveringKit: deliveries.filter((d) => d.status === "DeliveringKit")
      .length,
    kitDelivered: deliveries.filter((d) => d.status === "KitDelivered").length,
    waitingForPickup: deliveries.filter((d) => d.status === "WaitingForPickup")
      .length,
    pickingUpSample: deliveries.filter((d) => d.status === "PickingUpSample")
      .length,
    sampleReceived: deliveries.filter((d) => d.status === "SampleReceived")
      .length,
    cancelled: deliveries.filter((d) => d.status === "Cancelled").length,
  };

  return (
    <>
      <div className="relative flex flex-col items-center min-h-screen p-6 overflow-auto bg-blue-50">
        <div className="w-full mx-auto max-w-7xl">
          <li className="mb-3 text-2xl font-medium text-blue-800 md:text-xl">
            Quản lý giao nhận đơn
          </li>

          {/* Thống kê */}
          <div className="flex flex-wrap justify-between mb-6 gap-y-4">
            <div className="basis-[23%] grow-0 shrink-0">
              <StatCard
                label="Tổng đơn"
                count={stats.total}
                color="text-blue-600"
              />
            </div>
            <div className="basis-[23%] grow-0 shrink-0">
              <StatCard
                label="Chuẩn bị Kit"
                count={stats.preparingKit}
                color="text-orange-600"
              />
            </div>
            <div className="basis-[23%] grow-0 shrink-0">
              <StatCard
                label="Giao Kit"
                count={stats.deliveringKit}
                color="text-blue-600"
              />
            </div>
            <div className="basis-[23%] grow-0 shrink-0">
              <StatCard
                label="Đã nhận Kit"
                count={stats.kitDelivered}
                color="text-green-600"
              />
            </div>
            {/* <StatCard
              label="Đợi lấy mẫu"
              count={stats.waitingForPickup}
              color="text-yellow-600"
            />
            <StatCard
              label="Đang lấy mẫu"
              count={stats.pickingUpSample}
              color="text-purple-600"
            />
            <StatCard
              label="Đã nhận mẫu"
              count={stats.sampleReceived}
              color="text-emerald-600"
            />
            <StatCard
              label="Đã hủy"
              count={stats.cancelled}
              color="text-red-600"
            /> */}
          </div>

          {/* Bộ lọc */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "all",
              "PreparingKit",
              "DeliveringKit",
              "KitDelivered",
              // "WaitingForPickup",
              // "PickingUpSample",
              // "SampleReceived",
              // "Cancelled",
            ].map((status) => {
              const isActive = filterStatus === status;

              return (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    backgroundColor: isActive ? "#2563eb" : "#ffffff",
                    color: isActive ? "#ffffff" : "#1f2937",
                  }}
                  className="text-sm font-medium transition-colors border-0 rounded-lg hover:bg-gray-100"
                >
                  {status === "all"
                    ? "Tất cả"
                    : DeliveryStatusLabel[status as DeliveryStatus] || status}
                </Button>
              );
            })}
          </div>

          {/* Danh sách đơn */}
          {isLoading ? (
            <div className="flex items-center justify-center h-[550px]">
              <Loading message="Đang tải danh sách giao hàng..." />
            </div>
          ) : filteredDeliveries.length > 0 ? (
            <div className="h-[550px] overflow-y-auto space-y-4 pr-2">
              {[...filteredDeliveries]
                .sort((a, b) => new Date(b.scheduleAt).getTime() - new Date(a.scheduleAt).getTime())
                .map((delivery) => (
                  <DeliveryCard
                    key={delivery.id}
                    delivery={delivery}
                    onClick={handleOpenModal}
                    loadingId={loadingId}
                  />
                ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              Không có đơn giao hàng nào để hiển thị.
            </div>
          )}

        </div>
      </div>

      <DeliveryDetailModal
        visible={isModalVisible}
        delivery={selectedDelivery}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedDelivery(null);
        }}
        onRefresh={fetchDeliveries}
        canAssignStaff={selectedDelivery?.status === "PreparingKit"}
      />
    </>
  );
}

export default Delivery;
