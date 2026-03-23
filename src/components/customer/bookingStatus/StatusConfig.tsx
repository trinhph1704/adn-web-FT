import {
  AlertCircle,
  CheckCircle,
  ClipboardCheck,
  Truck,
  Package,
  Clock,
  Dna,
  FlaskConical,
  CreditCard,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BookingStatus } from "@/types";

interface StatusConfigItem {
  label: string;
  color: string;
  icon: LucideIcon;
  description: string;
}

const statusConfigMap: Record<BookingStatus, StatusConfigItem> = {
  [BookingStatus.Pending]: {
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
    description: "Yêu cầu đặt lịch đang được xử lý",
  },
  [BookingStatus.DepositPaid]: {
    label: "Đã đặt cọc",
    color: "bg-sky-100 text-sky-800",
    icon: CheckCircle,
    description: "Đã thanh toán đặt cọc",
  },
  [BookingStatus.KitDelivering]: {
    label: "Đang giao kit",
    color: "bg-blue-100 text-blue-800",
    icon: Truck,
    description: "Bộ kit đang được giao đến bạn",
  },
  [BookingStatus.KitDelivered]: {
    label: "Đã giao kit",
    color: "bg-blue-100 text-blue-800",
    icon: Package,
    description: "Bạn đã nhận được bộ kit xét nghiệm",
  },
  [BookingStatus.SampleCollected]: {
    label: "Đã thu mẫu",
    color: "bg-orange-100 text-orange-800",
    icon: ClipboardCheck,
    description: "Mẫu đã được thu thập",
  },
  [BookingStatus.SampleDelivering]: {
    label: "Đang giao mẫu",
    color: "bg-orange-100 text-orange-800",
    icon: Truck,
    description: "Mẫu đang được vận chuyển đến phòng lab",
  },
  [BookingStatus.SampleReceived]: {
    label: "Đã nhận mẫu",
    color: "bg-indigo-100 text-indigo-800",
    icon: Dna,
    description: "Phòng lab đã nhận được mẫu",
  },
  [BookingStatus.Testing]: {
    label: "Đang xét nghiệm",
    color: "bg-purple-100 text-purple-800",
    icon: FlaskConical,
    description: "Mẫu đang được phân tích",
  },
  [BookingStatus.ResultReady]: {
    label: "Có kết quả",
    color: "bg-rose-100 text-rose-800",
    icon: CreditCard,
    description: "Kết quả đã sẵn sàng",
  },
  [BookingStatus.FullyPaid]: {
    label: "Đã thanh toán đủ",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Đã thanh toán đủ",
  },
  [BookingStatus.Completed]: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Dịch vụ đã hoàn tất",
  },
  [BookingStatus.Cancelled]: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    description: "Lịch hẹn đã bị hủy",
  },
};

export function getStatusConfig(status: BookingStatus): StatusConfigItem {
  return statusConfigMap[status] ?? statusConfigMap[BookingStatus.Pending];
}
