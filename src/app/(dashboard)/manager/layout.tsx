'use client';

import { Sidebar } from '@/components/dashboard';
import { 
  BarChart3, 
  ClipboardList, 
  Settings, 
  Truck, 
  Tag, 
  FileText, 
  Star,
  CreditCard 
} from 'lucide-react';

const managerSidebarItems = [
  {
    icon: BarChart3,
    heading: 'Thống kê',
    href: '/manager/dashboard',
  },
  {
    icon: ClipboardList,
    heading: 'Đặt lịch xét nghiệm',
    href: '/manager/test-booking',
  },
  {
    icon: Settings,
    heading: 'Quản lý xét nghiệm',
    href: '/manager/test-management',
  },
  {
    icon: Truck,
    heading: 'Giao nhận',
    href: '/manager/delivery',
  },
  {
    icon: Tag,
    heading: 'Thẻ tag',
    href: '/manager/tags',
  },
  {
    icon: FileText,
    heading: 'Bài viết',
    href: '/manager/blogs',
  },
  {
    icon: Star,
    heading: 'Phản hồi',
    href: '/manager/feedback',
  },
  {
    icon: CreditCard,
    heading: 'Thanh toán',
    href: '/manager/list-payment',
  },
];

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FCFEFE]">
      <Sidebar items={managerSidebarItems} title="ADN Huyết Thống" />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

