import { AlertCircleIcon, CheckCircleIcon, ClipboardCheckIcon, TruckIcon, PackageIcon, ClockIcon, DnaIcon, FlaskConicalIcon, CreditCardIcon, XCircleIcon } from 'lucide-react';
import type { DetailedBookingStatus } from '../../types/bookingTypes';

// Internal status config using lowercase keys for easier management
const internalStatusConfig = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircleIcon, description: 'Yêu cầu đặt lịch đang được xử lý' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-sky-100 text-sky-800', icon: CheckCircleIcon, description: 'Lịch hẹn đã được xác nhận' },
  preparingkit: { label: 'Đang chuẩn bị Kit', color: 'bg-sky-100 text-sky-800', icon: ClipboardCheckIcon, description: 'Bộ kit xét nghiệm đang được chuẩn bị' },
  deliveringkit: { label: 'Đang giao Kit', color: 'bg-blue-100 text-blue-800', icon: TruckIcon, description: 'Bộ kit đang được giao đến bạn' },
  kitdelivered: { label: 'Đã nhận Kit', color: 'bg-blue-100 text-blue-800', icon: PackageIcon, description: 'Bạn đã nhận được bộ kit xét nghiệm' },
  waitingforsample: { label: 'Chờ nhận mẫu', color: 'bg-orange-100 text-orange-800', icon: ClockIcon, description: 'Chờ nhận mẫu xét nghiệm từ bạn' },
  returningsample: { label: 'Đang vận chuyển mẫu', color: 'bg-orange-100 text-orange-800', icon: TruckIcon, description: 'Mẫu của bạn đang được vận chuyển đến phòng lab' },
  samplereceived: { label: 'Đã nhận mẫu', color: 'bg-indigo-100 text-indigo-800', icon: DnaIcon, description: 'Phòng lab đã nhận được mẫu của bạn' },
  testing: { label: 'Đang phân tích', color: 'bg-purple-100 text-purple-800', icon: FlaskConicalIcon, description: 'Mẫu của bạn đang được phân tích' },
  finalpayment: { label: 'Chờ thanh toán', color: 'bg-rose-100 text-rose-800', icon: CreditCardIcon, description: 'Vui lòng thanh toán số tiền còn lại để xem kết quả.' },
  completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, description: 'Dịch vụ đã được thực hiện hoàn tất' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircleIcon, description: 'Lịch hẹn đã bị hủy bỏ' }
};

// Export the statusConfig mapped to DetailedBookingStatus keys
export const statusConfig = internalStatusConfig;

// Helper function to get status info by DetailedBookingStatus
export const getStatusConfigByDetailedStatus = (status: DetailedBookingStatus) => {
  const statusMap: Record<DetailedBookingStatus, keyof typeof internalStatusConfig> = {
    'Pending': 'pending',
    'PreparingKit': 'preparingkit',
    'DeliveringKit': 'deliveringkit', 
    'KitDelivered': 'kitdelivered',
    'WaitingForSample': 'waitingforsample',
    'ReturningSample': 'returningsample',
    'SampleReceived': 'samplereceived',
    'Testing': 'testing',
    'Completed': 'completed',
    'Cancelled': 'cancelled',
    'StaffGettingSample': 'waitingforsample', // Fallback mapping
    'CheckIn': 'confirmed' // Fallback mapping
  };
  
  const key = statusMap[status] || 'pending';
  return internalStatusConfig[key];
};