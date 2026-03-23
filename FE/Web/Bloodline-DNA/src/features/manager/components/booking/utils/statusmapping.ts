// constants/statusMapping.ts
export const STATUS_MAPPING = [
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

export const STATUS_COLOR_MAP: Record<number, string> = {
  0: "default",
  1: "processing",
  2: "blue",
  3: "cyan",
  4: "orange",
  5: "volcano",
  6: "green",
  7: "geekblue",
  8: "purple",
  9: "red",
  10: "gold",
  11: "lime",
};

export const STATUS_LABEL_MAP: Record<number, string> = STATUS_MAPPING.reduce(
  (acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  },
  {} as Record<number, string>
);
