# Payment Logging System

Hệ thống logging chi tiết cho quá trình thanh toán, giúp debug và theo dõi toàn bộ flow thanh toán.

## 🎯 Mục đích

- **Debug**: Theo dõi chi tiết quá trình thanh toán khi có lỗi
- **Monitoring**: Giám sát performance và success rate
- **Analytics**: Phân tích user behavior trong quá trình thanh toán
- **Troubleshooting**: Nhanh chóng xác định vấn đề khi user báo lỗi

## 📊 Các loại log được ghi

### 1. PAYMENT_START
- Khi user bắt đầu quá trình thanh toán
- Ghi lại: bookingId, paymentType (deposit/remaining), timestamp

### 2. PAYMENT_API_CALL  
- Khi gọi API thanh toán
- Ghi lại: endpoint URL, request headers, request body

### 3. PAYMENT_API_RESPONSE
- Khi nhận response từ API
- Ghi lại: status code, response data, payment URLs

### 4. PAYMENT_REDIRECT
- Khi redirect user đến trang thanh toán
- Ghi lại: payment URL, orderCode, booking info

### 5. PAYMENT_RETURN
- Khi user quay lại từ trang thanh toán
- Ghi lại: return URL, status parameter, orderCode

### 6. PAYMENT_CALLBACK
- Khi xử lý callback từ payment gateway
- Ghi lại: callback data, success/failure status

### 7. PAYMENT_SUCCESS
- Khi thanh toán thành công
- Ghi lại: final status, booking update info

### 8. PAYMENT_ERROR
- Khi có lỗi trong quá trình thanh toán
- Ghi lại: error message, error context, failed step

### 9. PAYMENT_CANCEL
- Khi user hủy thanh toán
- Ghi lại: cancellation reason, current step

## 🔧 Cách sử dụng

### Trong Development
```typescript
import { paymentLogger } from '../utils/paymentLogger';

// Xem tất cả logs
console.log(paymentLogger.getAllLogs());

// Xem logs của một booking cụ thể
console.log(paymentLogger.getLogsByBookingId('booking-123'));

// Xem logs theo type
console.log(paymentLogger.getLogsByType('PAYMENT_ERROR'));

// Export logs ra file JSON
const logsJson = paymentLogger.exportLogs();

// Xem summary của một booking
paymentLogger.logPaymentSummary('booking-123');
```

### Payment Debugger Component
Trong development mode, có thể sử dụng `PaymentDebugger` component:

```tsx
import { PaymentDebugger } from '../components/PaymentDebugger';

// Hiển thị debugger cho booking cụ thể
<PaymentDebugger bookingId="booking-123" isVisible={true} />
```

## 📱 Giao diện Debug

PaymentDebugger cung cấp:
- **Real-time logs**: Cập nhật logs theo thời gian thực
- **Filter by booking**: Chỉ hiển thị logs của booking hiện tại
- **Export function**: Xuất logs ra file JSON
- **Clear logs**: Xóa tất cả logs
- **Color coding**: Mỗi loại log có màu riêng để dễ phân biệt

## 🔍 Debugging Common Issues

### 1. Payment URL không được tạo
```
Tìm logs: PAYMENT_API_RESPONSE
Kiểm tra: responseData có chứa paymentUrl/checkoutUrl không
```

### 2. User không được redirect
```
Tìm logs: PAYMENT_REDIRECT
Kiểm tra: redirectUrl có hợp lệ không
```

### 3. Callback không được xử lý
```
Tìm logs: PAYMENT_RETURN, PAYMENT_CALLBACK
Kiểm tra: status parameter trong URL, orderCode matching
```

### 4. Payment status không được cập nhật
```
Tìm logs: PAYMENT_CALLBACK, PAYMENT_SUCCESS/ERROR
Kiểm tra: API callback response, booking status update
```

## 📈 Log Analysis

### Performance Metrics
```typescript
// Thời gian từ start đến redirect
const startLog = logs.find(l => l.type === 'PAYMENT_START');
const redirectLog = logs.find(l => l.type === 'PAYMENT_REDIRECT');
const duration = new Date(redirectLog.timestamp) - new Date(startLog.timestamp);
```

### Success Rate
```typescript
const totalPayments = paymentLogger.getLogsByType('PAYMENT_START').length;
const successfulPayments = paymentLogger.getLogsByType('PAYMENT_SUCCESS').length;
const successRate = (successfulPayments / totalPayments) * 100;
```

### Error Analysis
```typescript
const errors = paymentLogger.getLogsByType('PAYMENT_ERROR');
const errorsByType = errors.reduce((acc, log) => {
  const errorType = log.data.error;
  acc[errorType] = (acc[errorType] || 0) + 1;
  return acc;
}, {});
```

## 🚀 Production Considerations

- Logs chỉ được lưu trong memory, sẽ mất khi refresh page
- Trong production, có thể gửi logs quan trọng lên server
- Cân nhắc privacy khi log sensitive data
- Implement log rotation để tránh memory leak

## 🔒 Security Notes

- Không log full token, chỉ log prefix
- Không log sensitive user data
- Mask payment details nếu cần thiết
- Logs chỉ hiển thị trong development mode

## 📝 Example Log Output

```json
{
  "type": "PAYMENT_START",
  "data": {
    "bookingId": "123456",
    "paymentType": "deposit",
    "baseUrl": "https://api.example.com"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Hệ thống logging này giúp team development nhanh chóng identify và fix các vấn đề liên quan đến thanh toán, đồng thời cung cấp insights về user experience trong payment flow.
