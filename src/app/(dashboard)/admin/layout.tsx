'use client';

import { Sidebar } from '@/components/dashboard';
import { BarChart3, Users, FileText } from 'lucide-react';

const adminSidebarItems = [
  {
    icon: BarChart3,
    heading: 'Thống kê',
    href: '/admin/dashboard',
  },
  {
    icon: Users,
    heading: 'Quản lí người dùng',
    href: '/admin/users',
  },
  {
    icon: FileText,
    heading: 'Hướng dẫn lấy mẫu',
    href: '/admin/sample-instructions',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar items={adminSidebarItems} title="Admin Panel" />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

