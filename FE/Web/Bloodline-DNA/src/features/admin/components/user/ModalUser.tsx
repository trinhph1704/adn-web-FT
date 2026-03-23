import React, { useState } from 'react';
import { Button } from '../../../staff/components/sample/ui/button';

interface ModalUserProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    role: number;
  }) => void;
}

const ModalUser: React.FC<ModalUserProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 1,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Thêm người dùng mới</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={e => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          <div>
            <label className="block mb-1 font-medium text-blue-900">Họ tên</label>
            <input
              className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập họ tên"
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-900">Email</label>
            <input
              className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-900">Số điện thoại</label>
            <input
              className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập số điện thoại"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-900">Địa chỉ</label>
            <input
              className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập địa chỉ"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-900">Mật khẩu</label>
            <input
              className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-900">Vai trò</label>
            <select
              className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: Number(e.target.value) }))}
              required
            >
              <option value={1}>Nhân viên</option>
              <option value={2}>Người dùng</option>
              <option value={3}>Quản lý</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 px-6"
            >
              Thêm mới
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUser;