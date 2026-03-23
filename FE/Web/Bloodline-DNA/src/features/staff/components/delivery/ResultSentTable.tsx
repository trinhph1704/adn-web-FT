import { CheckOutlined } from "@ant-design/icons";
import { Button, message, Modal, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { updateTestBookingStatusStaff } from "../../api/deliveryApi";
import { getTestBookingApi } from "../../api/testBookingApi";
import { statusColorMap, statusTextMap } from "../../types/delivery";
import type { TestBookingResponse } from "../../types/testBooking";

interface Props {
  onRowClick: (id: string) => void;
  onComplete: () => void;
}

const ResultSent = ({ onRowClick, onComplete }: Props) => {
  const [data, setData] = useState<TestBookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const selectedOrder = data.find((d) => d.id === selectedId);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const result = await getTestBookingApi(token);
      const filtered = result.filter((item) => item.status === "Testing");
      setData(filtered);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách:", error);
      message.error("Không thể lấy danh sách đơn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickSendResult = (id: string) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    setConfirmLoading(true);
    try {
      const token = localStorage.getItem("token") || "";

      await updateTestBookingStatusStaff(
        { bookingId: selectedId, status: 8 },
        token
      );

      message.success("Đã gửi kết quả và cập nhật trạng thái.");
      setOpenModal(false);
      setSelectedId(null);
      onComplete();
      fetchData();
    } catch (error) {
      console.error("Lỗi khi gửi kết quả:", error);
      message.error("Lỗi khi gửi kết quả.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns: ColumnsType<TestBookingResponse> = [
    {
      title: <span style={{ fontSize: "12px" }}>Mã đơn</span>,
      dataIndex: "id",
      render: (id: string) => <span style={{ fontSize: 10 }}>#{id}</span>,
    },
    {
      title: <span style={{ fontSize: "12px" }}>Khách hàng</span>,
      dataIndex: "clientName",
      render: (text: string) => <span style={{ fontSize: 10 }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: "12px" }}>Số điện thoại</span>,
      dataIndex: "phone",
      render: (text: string) => <span style={{ fontSize: 10 }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: "12px" }}>Địa chỉ</span>,
      dataIndex: "address",
      render: (text: string) => (
        <span style={{ fontSize: 10 }}>
          {text || <div className="italic">Chưa cập nhật</div>}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Ghi chú</span>,
      dataIndex: "note",
      render: (text?: string) => {
        const cleaned = text?.trim().toLowerCase();
        return (
          <span style={{ fontSize: 10 }}>
            {cleaned && cleaned !== "string" ? (
              text
            ) : (
              <div className="italic">Không có</div>
            )}
          </span>
        );
      },
    },
    {
      title: <span style={{ fontSize: "12px" }}>Ngày tạo</span>,
      dataIndex: "createdAt",
      align: "center",
      render: (text?: string) => {
        if (!text || text.trim().toLowerCase() === "string")
          return <span style={{ fontSize: 10 }}>Không có</span>;
        const date = new Date(text);
        const formatted = date.toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return <span style={{ fontSize: 10 }}>{formatted}</span>;
      },
    },
    {
      title: <span style={{ fontSize: "12px" }}>Ngày cật nhật</span>,
      dataIndex: "updatedAt",
      align: "center",
      render: (text?: string) => {
        if (!text || text.trim().toLowerCase() === "string")
          return <span style={{ fontSize: 10 }}>Không có</span>;
        const date = new Date(text);
        const formatted = date.toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return <span style={{ fontSize: 10 }}>{formatted}</span>;
      },
    },
    {
      title: <span style={{ fontSize: "12px" }}>Trạng thái</span>,
      dataIndex: "status",
      align: "center",
      render: (status: string) => (
        <Tag color={statusColorMap[status]} style={{ fontSize: 10 }}>
          {statusTextMap[status] || status}
        </Tag>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Hành động</span>,
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button
          icon={<CheckOutlined />}
          size="small"
          disabled={record.status === "Completed"}
          onClick={(e) => {
            e.stopPropagation();
            handleClickSendResult(record.id);
          }}
          className={
            record.status === "Completed"
              ? "text-xs bg-gray-300 text-gray-500 cursor-not-allowed"
              : "text-xs text-white bg-purple-500 hover:bg-purple-600"
          }
          style={{ fontSize: 10 }}
        >
          Gửi kết quả
        </Button>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="id"
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 6 }}
          onRow={(record) => ({
            onClick: () => onRowClick(record.id),
            style: { cursor: "pointer" },
          })}
          size="small"
          locale={{ emptyText: "Không có đơn Testing nào." }}
        />
      )}

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleConfirm}
        confirmLoading={confirmLoading}
        okText="Gửi"
        cancelText="Hủy"
        title="Xác nhận gửi kết quả"
      >
        {selectedOrder ? (
          <div className="space-y-2 text-sm">
            <p>
              Bạn có chắc muốn gửi kết quả cho đơn{" "}
              <strong>#{selectedOrder.id}</strong>?
            </p>
            <div className="flex flex-col gap-5 p-3 mt-3 space-y-1 bg-gray-100 rounded">
              <div>
                <strong>Khách hàng:</strong> {selectedOrder.clientName}
              </div>
              <div>
                <strong>Số điện thoại:</strong> {selectedOrder.phone}
              </div>
              <div>
                <strong>Địa chỉ:</strong>{" "}
                {selectedOrder.address || "Chưa cập nhật"}
              </div>
              <div>
                <strong>Ghi chú:</strong> {selectedOrder.note || "Không có"}
              </div>
              <div>
                <strong>Trạng thái hiện tại: </strong>
                <Tag color={statusColorMap[selectedOrder.status]}>
                  {statusTextMap[selectedOrder.status] || selectedOrder.status}
                </Tag>
              </div>
            </div>
          </div>
        ) : (
          <p>Không tìm thấy đơn hàng.</p>
        )}
      </Modal>
    </>
  );
};

export default ResultSent;
