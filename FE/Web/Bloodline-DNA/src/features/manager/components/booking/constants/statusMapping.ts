export interface StatusOption {
  label: string;
  value: number;
}

export const STATUS_MAPPING: StatusOption[] = [
  { label: 'Chờ xử lý', value: 0 },             // Pending
  { label: 'Đang chuẩn bị kit', value: 1 },      // PreparingKit
  { label: 'Đang giao kit', value: 2 },          // DeliveringKit
  { label: 'Đã giao kit', value: 3 },            // KitDelivered
  { label: 'Chờ lấy mẫu', value: 4 },            // WaitingForSample
  { label: 'Đang hoàn mẫu', value: 5 },          // ReturningSample
  { label: 'Đã nhận mẫu', value: 6 },            // SampleReceived
  { label: 'Đang xét nghiệm', value: 7 },        // Testing
  { label: 'Hoàn tất', value: 8 },               // Completed
  { label: 'Đã huỷ', value: 9 },                 // Cancelled
  { label: 'Nhân viên đang lấy mẫu', value: 10 },    // StaffGettingSample
  { label: 'Đã check-in', value: 11 },            // CheckIn
];

export const getStatusColor = (status: string | number): string => {
  const numericStatus = typeof status === 'number' ? status : statusToNumber(status);

  switch (numericStatus) {
    case 0: // Pending
      return 'bg-yellow-400';
    case 1: // PreparingKit
      return 'bg-blue-300';
    case 2: // DeliveringKit
      return 'bg-blue-500';
    case 3: // KitDelivered
      return 'bg-blue-600';
    case 4: // WaitingForSample
      return 'bg-orange-300';
    case 5: // ReturningSample
      return 'bg-orange-500';
    case 6: // SampleReceived
      return 'bg-teal-500';
    case 7: // Testing
      return 'bg-purple-500';
    case 8: // Completed
      return 'bg-green-600';
    case 9: // Cancelled
      return 'bg-red-500';
    case 10: // StaffGettingSample
      return 'bg-yellow-500';
    case 11: // CheckIn
      return 'bg-blue-700';
    default:
      return 'bg-gray-300';
  }
};


// Helper function to convert status to number
const statusToNumber = (status: string | number): number => {
  if (typeof status === 'number') {
    return status;
  }
  const statusMap: Record<string, number> = {
    Pending: 0,
    PreparingKit: 1,
    DeliveringKit: 2,
    KitDelivered: 3,
    WaitingForSample: 4,
    ReturningSample: 5,
    SampleReceived: 6,
    Testing: 7,
    Completed: 8,
    Cancelled: 9,
    StaffGettingSample: 10,
    CheckIn: 11,
  };
  return statusMap[status] !== undefined ? statusMap[status] : -1;
};