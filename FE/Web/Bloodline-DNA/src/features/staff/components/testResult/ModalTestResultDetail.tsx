import React from "react";

interface Client {
  fullName: string;
  email: string;
  address: string;
}

interface TestResultDetail {
  testBookingId: string;
  resultSummary: string;
  resultDate: string;
  resultFileUrl?: string;
  client?: Client;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
  result: TestResultDetail | null;
}

const ModalTestResultDetail: React.FC<Props> = ({ show, onClose, result }) => {
  if (!show || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg p-6 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-lg font-semibold text-blue-800">Chi tiết kết quả xét nghiệm</h2>

        <div className="space-y-4 text-sm">
          <div>
            <p><strong>Mã đặt xét nghiệm:</strong> {result.testBookingId}</p>
          </div>

          <div>
            <p className="mb-2"><strong>Tóm tắt kết quả:</strong></p>
            <div className="p-3 leading-relaxed whitespace-pre-wrap border rounded-md bg-gray-50">
              {result.resultSummary}
            </div>
          </div>

          <div>
            <p><strong>Ngày trả:</strong> {new Date(result.resultDate).toLocaleDateString("vi-VN")}</p>
          </div>

          {result.resultFileUrl && (
            <div>
              <p>
                <strong>File:</strong>{" "}
                <a href={result.resultFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                  Xem file kết quả
                </a>
              </p>
            </div>
          )}

          {result.client && (
            <div className="pt-2 border-t border-gray-200">
              <p className="mb-2"><strong>Thông tin khách hàng:</strong></p>
              <div className="pl-4 space-y-1">
                <p><strong>Họ tên:</strong> {result.client.fullName}</p>
                <p><strong>Email:</strong> {result.client.email}</p>
                <p><strong>Địa chỉ:</strong> {result.client.address}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 mt-6 border-t border-gray-200">
          <button
            style={{ color: "white" }}
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTestResultDetail;
