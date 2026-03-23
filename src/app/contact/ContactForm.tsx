'use client';

import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent("Liên hệ từ website ADN Huyết Thống");
    const body = encodeURIComponent(
      `Họ tên: ${formData.name}\nEmail: ${formData.email}\nSố điện thoại: ${formData.phone}\n\nNội dung:\n${formData.message}`
    );
    window.location.href = `mailto:bloodlineDNA@support.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  if (submitted) {
    return (
      <div className="p-6 text-center bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-medium">
          Đã mở ứng dụng email. Vui lòng gửi email đến bloodlineDNA@support.com
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Gửi tin nhắn khác
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Họ và tên
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="input-field"
          placeholder="Nguyễn Văn A"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="input-field"
          placeholder="email@example.com"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Số điện thoại
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          className="input-field"
          placeholder="0901234567"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Nội dung
        </label>
        <textarea
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          className="input-field min-h-[120px]"
          placeholder="Nhập câu hỏi hoặc yêu cầu tư vấn..."
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Gửi tin nhắn
      </button>
    </form>
  );
}
