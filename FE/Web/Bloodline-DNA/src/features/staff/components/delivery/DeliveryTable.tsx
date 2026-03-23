import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { Loading } from "../../../../components";
import { completeDelivery, getAssignedDeliveries } from "../../api/deliveryApi";
import {
  statusColorMap,
  statusTextMap,
  type DeliveryOrder,
} from "../../types/delivery";

const DeliveryTable = () => {
  const [data, setData] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const selectedOrder = data.find((item) => item.id === selectedId);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAssignedDeliveries();
      const filteredResult = result.filter(item => item.status === "DeliveringKit");
      setData(filteredResult);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn giao Kit:", error);
      message.error("Không thể lấy danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClickComplete = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirmComplete = async () => {
    if (!selectedId || !uploadedImage) {
      message.error("Vui lòng tải ảnh xác nhận.");
      return;
    }

    setConfirmLoading(true);
    try {
      const formData = new FormData();
      formData.append("evidence", uploadedImage);

      await completeDelivery(selectedId, formData);
      message.success(`Đã hoàn thành đơn hàng #${selectedId}`);
      setSelectedId(null);
      setUploadedImage(null);
      fetchData();
    } catch (error) {
      console.error("Lỗi hoàn thành đơn:", error);
      message.error("Không thể hoàn thành đơn hàng.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const filteredData =
    filterStatus === "All"
      ? data
      : data.filter((item) => item.status === filterStatus);

  const columns: ColumnsType<DeliveryOrder> = [
    {
      title: <span style={{ fontSize: "12px" }}>Mã đơn</span>,
      dataIndex: "id",
      key: "id",
      render: (id: string) => <span style={{ fontSize: "10px" }}>#{id}</span>,
    },
    {
      title: <span style={{ fontSize: "12px" }}>Khách hàng</span>,
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span style={{ fontSize: "10px" }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: "12px" }}>Địa chỉ</span>,
      dataIndex: "address",
      key: "address",
      render: (text: string) => (
        <span style={{ fontSize: "10px" }}>{text}</span>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>SĐT</span>,
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => (
        <span style={{ fontSize: "10px" }}>{text}</span>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Thời gian giao</span>,
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      align: "center",
      render: (value: string) => (
        <span style={{ fontSize: "10px" }}>
          {new Date(value).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Ghi chú</span>,
      dataIndex: "note",
      key: "note",
      render: (text?: string) => {
        const cleaned = text?.trim().toLowerCase();
        return (
          <span style={{ fontSize: "10px" }}>
            {cleaned && cleaned !== "string" ? text : "Không có"}
          </span>
        );
      },
    },
    {
      title: <span style={{ fontSize: "12px" }}>Trạng thái</span>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => (
        <Tag
          color={statusColorMap[status] || "default"}
          style={{ fontSize: "10px", padding: "2px 6px" }}
        >
          {statusTextMap[status] || status}
        </Tag>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Hành động</span>,
      key: "actions",
      align: "center",
      render: (_, record) => {
        const canComplete = record.status === "DeliveringKit";

        return (
          <Button
            icon={<CheckOutlined />}
            size="small"
            disabled={!canComplete}
            onClick={(e) => {
              e.stopPropagation();
              handleClickComplete(record.id);
            }}
            className={`px-2 py-1 text-xs rounded ${canComplete
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            style={{ fontSize: 10 }}
          >
            Hoàn thành
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-blue-500 before:content-['•'] before:mr-2">Giao mẫu Kit tới tận tay khách hàng.</p>
        </div>
        <div className="italic">
          Số đơn đang cần giao: <span className="font-semibold text-blue-500">{filteredData.length}/{filteredData.length}</span> đơn
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loading message="Đang tải danh sách giao Kit..." />
        </div>
      ) : (
        <Table
          rowKey="id"
          dataSource={filteredData.sort(
            (a, b) =>
              new Date(b.scheduledAt).getTime() -
              new Date(a.scheduledAt).getTime()
          )}
          columns={columns}
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => console.log("Xem chi tiết:", record.id),
            style: { cursor: "pointer" },
          })}
          size="small"
          locale={{
            emptyText: (
              <span style={{ fontSize: "12px" }}>
                Không có đơn nào được phân công.
              </span>
            ),
          }}
        />
      )}

      <Modal
        open={!!selectedId}
        title="Xác nhận hoàn thành giao Kit"
        onOk={handleConfirmComplete}
        onCancel={() => {
          setSelectedId(null);
          setUploadedImage(null);
        }}
        confirmLoading={confirmLoading}
        okText="Hoàn thành"
        cancelText="Hủy"
        okButtonProps={{ disabled: !uploadedImage }}
      >
        {selectedOrder ? (
          <div className="space-y-2 text-sm">
            <p>
              Bạn có chắc chắn muốn đánh dấu đơn hàng{" "}
              <strong>#{selectedOrder.id}</strong> là đã giao Kit?
            </p>
            <div className="flex flex-col gap-5 p-3 mt-3 space-y-1 bg-gray-100 rounded">
              <div>
                <strong>Địa chỉ:</strong> {selectedOrder.address}
              </div>
              <div>
                <strong>Số điện thoại:</strong> {selectedOrder.phone}
              </div>
              <div>
                <strong>Ghi chú:</strong>{" "}
                {selectedOrder.note &&
                  selectedOrder.note.trim().toLowerCase() !== "string"
                  ? selectedOrder.note
                  : "Không có"}
              </div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                <Tag color={statusColorMap[selectedOrder.status]}>
                  {statusTextMap[selectedOrder.status] || selectedOrder.status}
                </Tag>
              </div>
            </div>
            <div>
              <div className="mt-4">
                <label className="flex flex-col items-start gap-1 mb-1 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    <RiImageAddLine className="text-lg" />
                    <span>Tải ảnh giao mẫu Kit để xác nhận!</span>
                  </div>
                  <p className="text-xs italic text-red-500">* (bắt buộc)</p>
                </label>
                {/* Upload ảnh xác nhận */}
                <div className="px-4 py-2 mb-5 transition border border-blue-300 rounded cursor-pointer w-fit bg-blue-50 hover:bg-blue-100">
                  <input
                    placeholder="Tải ảnh xác nhận"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setUploadedImage(file);
                    }}
                    className="text-sm text-gray-700 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Không tìm thấy thông tin đơn hàng.</p>
        )}
      </Modal>
    </>
  );
};

export default DeliveryTable;
