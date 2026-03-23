export const formatVietnamTime = (dateStr?: string): string => {
  if (!dateStr) return "Không có";
  
  // Tạo Date object và đảm bảo timezone đúng
  const date = new Date(dateStr);
  
  // Kiểm tra nếu date không hợp lệ
  if (isNaN(date.getTime())) return "Thời gian không hợp lệ";
  
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit", 
    year: "numeric",
    hour12: false,
  });
};

// Thêm hàm mới để format thời gian hiện tại
export const getCurrentVietnamTime = (): string => {
  const now = new Date();
  return now.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric", 
    hour12: false,
  });
};
