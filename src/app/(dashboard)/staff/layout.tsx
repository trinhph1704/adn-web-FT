'use client';

import { Sidebar } from '@/components/dashboard';
import { TestTube, Building2, FileCheck, Truck, Calendar } from 'lucide-react';

const staffSidebarItems = [
  {
    icon: TestTube,
    heading: 'Quản lý mẫu xét nghiệm',
    href: '/staff/test-sample',
  },
  {
    icon: Building2,
    heading: 'Lấy mẫu tại cơ sở',
    href: '/staff/test-sample-at-facility',
  },
  {
    icon: Calendar,
    heading: 'Đặt lịch xét nghiệm',
    href: '/staff/test-booking',
  },
  {
    icon: FileCheck,
    heading: 'Kết quả xét nghiệm',
    href: '/staff/test-result',
  },
  {
    icon: Truck,
    heading: 'Giao nhận',
    href: '/staff/delivery',
  },
];

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FCFEFE]">
      <Sidebar items={staffSidebarItems} title="ADN Huyết Thống" />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

