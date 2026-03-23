import React, { useEffect } from "react";

interface BookingOption {
  id: string;
  clientName: string;
  email: string;
  appointmentDate: string;
  status: string;
}

interface ModalTestResultProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: {
    TestBookingId: string;
    ResultSummary: string;
    ResultDate: string;
    ResultFile: File | null;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onFileChange: (file: File | null) => void;
  bookingOptions: BookingOption[];
  isLoadingBookings: boolean;
  isSubmitting?: boolean;
}

const ModalTestResult: React.FC<ModalTestResultProps> = ({
  show,
  onClose,
  onSubmit,
  form,
  onChange,
  onFileChange,
  bookingOptions,
  isLoadingBookings,
  isSubmitting = false,
}) => {
  useEffect(() => {
    if (!form.ResultSummary) {
      const defaultSummary = `Khách hàng:

Đánh giá:

Nhận xét thêm: `;
      const fakeEvent = {
        target: {
          name: "ResultSummary",
          value: defaultSummary,
        },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(fakeEvent);
    }

    if (!form.ResultDate) {
      const today = new Date().toISOString().split("T")[0];
      const fakeEvent = {
        target: {
          name: "ResultDate",
          value: today,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(fakeEvent);
    }
  }, [form.ResultSummary, form.ResultDate, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Tạo kết quả xét nghiệm</h2>
          <button
            onClick={onClose}
            className="text-xl leading-none text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5 text-sm">
          {/* Booking select */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Tạo kết quả cho:
            </label>
            {isLoadingBookings ? (
              <div className="text-gray-500">Đang tải danh sách...</div>
            ) : (
              <select
                name="TestBookingId"
                value={form.TestBookingId}
                onChange={onChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn --</option>
                {bookingOptions
                  .filter((booking) => booking.status === "Testing")
                  .map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.clientName} - {booking.id.slice(-6)}
                    </option>
                  ))}
              </select>
            )}
          </div>

          {/* Result Summary */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Tóm tắt kết quả
            </label>
            <textarea
              name="ResultSummary"
              value={form.ResultSummary}
              onChange={onChange}
              placeholder={`Khách hàng:

Đánh giá:

Nhận xét thêm: `}
              rows={8}
              required
              className="w-full px-3 py-2 leading-relaxed whitespace-pre-wrap border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-1 text-xs text-gray-500">
              Vui lòng nhập theo định dạng (mỗi phần trên một dòng riêng):
              <div className="p-2 mt-1 text-xs rounded bg-gray-50">
                <div className="mb-2"><strong>Khách hàng:</strong> [Thông tin khách hàng]</div>
                <div className="mb-2"><strong>Đánh giá:</strong> [Kết quả đánh giá]</div>
                <div><strong>Nhận xét thêm:</strong> [Ghi chú bổ sung]</div>
              </div>
            </div>
          </div>

          {/* Result Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Ngày trả kết quả
            </label>
            <input
              placeholder="YYYY-MM-DD"
              type="date"
              name="ResultDate"
              value={form.ResultDate}
              onChange={onChange}
              required
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              File kết quả xét nghiệm
            </label>
            <input
              placeholder="Chọn file kết quả"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {form.ResultFile && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">File đã chọn:</span> {form.ResultFile.name}
                <span className="ml-2 text-xs text-gray-500">
                  ({(form.ResultFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
            <div className="mt-1 text-xs text-gray-500">
              Chấp nhận: PDF, DOC, DOCX, JPG, JPEG, PNG (tối đa 10MB)
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <div className="text-white">{isSubmitting ? 'Đang xử lý...' : 'Tạo và gửi kết quả'}</div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTestResult;
