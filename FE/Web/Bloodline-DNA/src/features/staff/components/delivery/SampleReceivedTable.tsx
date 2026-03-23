import { CheckOutlined } from "@ant-design/icons";
import { Button, message, Modal, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { Loading } from "../../../../components";
import { completeDelivery, getAssignedDeliveries } from "../../api/deliveryApi";
import { statusColorMap, statusTextMap, type DeliveryOrder } from "../../types/delivery";

interface Props {
  onRowClick: (id: string) => void;
  onComplete: () => void;
}

const SampleReceived = ({ onRowClick, onComplete }: Props) => {
  const [data, setData] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const fetchData = async () => {
  setLoading(true);
  try {
    const result = await getAssignedDeliveries();
    const filtered = result
      .filter((item) => item.status === "WaitingForPickup")
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

    setData(filtered);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn:", error);
    message.error("Không thể lấy danh sách đơn.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickMarkReceived = (id: string) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedId || !uploadedImage) return;
    setConfirmLoading(true);

    try {
      const formData = new FormData();
      formData.append("evidence", uploadedImage);

      await completeDelivery(selectedId, formData);

      message.success("Đã xác nhận nhận lại mẫu Kit.");
      setOpenModal(false);
      setSelectedId(null);
      setUploadedImage(null);
      onComplete(); // gọi callback nếu có
      fetchData(); // refetch lại danh sách
    } catch (err) {
      console.error("Lỗi khi hoàn tất đơn hàng:", err);
      message.error("Lỗi khi xác nhận nhận lại mẫu Kit.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns: ColumnsType<DeliveryOrder> = [
    {
      title: <span style={{ fontSize: "12px" }}>Mã đơn</span>,
      dataIndex: "id",
      render: (id: string) => <span style={{ fontSize: 10 }}>#{id}</span>,
    },
    {
      title: <span style={{ fontSize: "12px" }}>Khách hàng</span>,
      dataIndex: "name",
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
      dataIndex: "scheduledAt",
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
    // {
    //   title: <span style={{ fontSize: "12px" }}>Ngày cập nhật</span>,
    //   dataIndex: "updatedAt",
    //   align: "center",
    //   render: (text?: string) => {
    //     if (!text || text.trim().toLowerCase() === "string")
    //       return <span style={{ fontSize: 10 }}>Không có</span>;
    //     const date = new Date(text);
    //     const formatted = date.toLocaleString("vi-VN", {
    //       day: "2-digit",
    //       month: "2-digit",
    //       year: "numeric",
    //       hour: "2-digit",
    //       minute: "2-digit",
    //       hour12: false,
    //     });
    //     return <span style={{ fontSize: 10 }}>{formatted}</span>;
    //   },
    // },
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
          // disabled={record.status !== "ReturningSample"}
          onClick={(e) => {
            e.stopPropagation();
            handleClickMarkReceived(record.id);
          }}
          className="text-xs text-white bg-blue-500 hover:bg-blue-600"
          style={{ fontSize: 10 }}
        >
          Đã nhận mẫu
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-yellow-600 before:content-['•'] before:mr-2">Xác nhận và nhận lại mẫu Kit từ khách hàng.</p>
        </div>
        <div className="italic">
          Số đơn yêu cầu nhận: <span className="font-semibold text-yellow-600">{data.length}/{data.length}</span> đơn
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loading message="Đang tải danh sách nhận mẫu Kit..." />
        </div>
      ) : (
        <Table
          rowKey="id"
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => onRowClick(record.id),
            style: { cursor: "pointer" },
          })}
          size="small"
          locale={{ emptyText: "Không có đơn yêu cầu nhận mẫu Kit nào." }}
        />
      )}

      <Modal
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setUploadedImage(null); // reset ảnh nếu đóng modal
        }}
        onOk={handleConfirm}
        okButtonProps={{ disabled: !uploadedImage }}
        confirmLoading={confirmLoading}
        okText="Xác nhận"
        cancelText="Hủy"
        title="Xác nhận đã nhận mẫu Kit"
      >
        {selectedId && (
          <>
            <p>Bạn có chắc muốn xác nhận đã nhận mẫu từ đơn hàng sau?</p>
            <div className="flex flex-col gap-5 p-3 mt-3 space-y-1 text-sm bg-gray-100 rounded">
              <div>
                <strong>Mã đơn:</strong> #{selectedId}
              </div>
              <div>
                <strong>Khách hàng:</strong>{" "}
                {data.find((d) => d.id === selectedId)?.name || "N/A"}
              </div>
              <div>
                <strong>Số điện thoại:</strong>{" "}
                {data.find((d) => d.id === selectedId)?.phone || "N/A"}
              </div>
              <div className="flex gap-1">
                <strong>Địa chỉ:</strong>{" "}
                {data.find((d) => d.id === selectedId)?.address || (
                  <div className="italic">Chưa cập nhật</div>
                )}
              </div>
              <div>
                <strong>Ghi chú:</strong>{" "}
                {data.find((d) => d.id === selectedId)?.note || "Không có"}
              </div>
              <div>
                <strong>Trạng thái hiện tại:</strong>{" "}
                <Tag
                  color={
                    statusColorMap[
                    data.find((d) => d.id === selectedId)?.status || ""
                    ]
                  }
                >
                  {statusTextMap[
                    data.find((d) => d.id === selectedId)?.status || ""
                  ] || data.find((d) => d.id === selectedId)?.status}
                </Tag>
              </div>
            </div>

            <div>
              <div className="mt-4">
                <label className="flex flex-col items-start gap-1 mb-1 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    <RiImageAddLine className="text-lg" />
                    <span>Tải ảnh nhận lại mẫu Kit để xác nhận!</span>
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
          </>
        )}
      </Modal>

    </>
  );
};

export default SampleReceived;
