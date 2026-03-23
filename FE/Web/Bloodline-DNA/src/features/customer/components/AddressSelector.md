# AddressSelector Component

## Mô tả
Component `AddressSelector` được tạo để xử lý việc chọn địa chỉ từ API tỉnh/thành phố và quận/huyện của Việt Nam. Component này tích hợp với API công khai từ `https://provinces.open-api.vn/api/?depth=2`.

## Tính năng
- ✅ Tự động load danh sách tỉnh/thành phố và quận/huyện từ API
- ✅ Chọn tỉnh/thành phố trước, sau đó chọn quận/huyện tương ứng
- ✅ Nhập địa chỉ chi tiết (số nhà, đường, phường)
- ✅ Tự động tạo địa chỉ đầy đủ theo format: "Địa chỉ chi tiết, Quận/Huyện, Tỉnh/Thành phố"
- ✅ Hiển thị preview địa chỉ đầy đủ với validation
- ✅ Xử lý trường hợp đặc biệt cho địa chỉ "TẠI CƠ SỞ"
- ✅ Parse địa chỉ có sẵn khi edit booking
- ✅ Validation và hiển thị lỗi
- ✅ Loading states và error handling

## Cách sử dụng

### Import
```tsx
import { AddressSelector } from './AddressSelector';
```

### Props
```tsx
interface AddressSelectorProps {
  value: string;                    // Địa chỉ hiện tại
  onChange: (address: string) => void; // Callback khi địa chỉ thay đổi
  placeholder?: string;             // Placeholder cho input địa chỉ chi tiết
  disabled?: boolean;               // Disable toàn bộ component
  required?: boolean;               // Đánh dấu các field bắt buộc
  className?: string;               // CSS classes bổ sung
}
```

### Ví dụ sử dụng cơ bản
```tsx
const [address, setAddress] = useState('');

<AddressSelector
  value={address}
  onChange={setAddress}
  placeholder="Nhập địa chỉ chi tiết"
  required={true}
/>
```

### Ví dụ trong BookingModal
```tsx
{formData.serviceType === "home" ? (
  <AddressSelector
    value={formData.address}
    onChange={(address) => handleInputChange("address", address)}
    placeholder="Nhập địa chỉ nhận bộ kit ADN hoặc địa chỉ thu mẫu tại nhà"
    required={true}
    className="md:col-span-2"
  />
) : (
  <div>
    <Input
      type="text"
      value={formData.address}
      onChange={(e) => handleInputChange("address", e.target.value)}
      placeholder="Xét nghiệm tại cơ sở"
      className="w-full"
      disabled={true}
      readOnly={true}
    />
    <p className="text-xs text-blue-600 mt-1">
      <strong>Lưu ý:</strong> Bạn sẽ đến trung tâm để thực hiện xét nghiệm
    </p>
  </div>
)}
```

### Ví dụ trong EditBooking
```tsx
<AddressSelector
  value={formData.address}
  onChange={(address) => handleInputChange('address', address)}
  placeholder="Nhập địa chỉ chi tiết"
  required={true}
  className="mt-1"
/>
```

## Cấu trúc dữ liệu

### API Response
```json
[
  {
    "code": "01",
    "name": "Hà Nội",
    "districts": [
      {
        "name": "Ba Đình",
        "code": "001"
      }
    ]
  }
]
```

### Địa chỉ format
- **Đầy đủ**: "Số 123, Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh"
- **Chỉ có tỉnh**: "Số 123, Đường ABC, TP. Hồ Chí Minh"
- **Đặc biệt**: "TẠI CƠ SỞ" (cho clinic services)

## Validation

### Địa chỉ hợp lệ
- Có ít nhất 2 phần (địa chỉ chi tiết + tỉnh/thành phố)
- Đã chọn tỉnh/thành phố
- Không rỗng

### Hiển thị
- ✅ **Xanh**: Địa chỉ đầy đủ và hợp lệ
- ⚠️ **Vàng**: Địa chỉ chưa hoàn chỉnh
- 🔴 **Đỏ**: Có lỗi khi load dữ liệu

## Xử lý đặc biệt

### Trường hợp "TẠI CƠ SỞ"
Khi `value === "TẠI CƠ SỞ"`, component sẽ hiển thị:
- Thông báo địa chỉ đặc biệt
- Không hiển thị các dropdown chọn địa chỉ
- Giải thích rằng xét nghiệm sẽ thực hiện tại trung tâm

### Parse địa chỉ có sẵn
Khi edit booking, component sẽ:
- Tự động parse địa chỉ có sẵn
- Set selectedProvince và selectedDistrict tương ứng
- Hiển thị địa chỉ chi tiết trong input

## Error Handling

### Network errors
- Hiển thị thông báo lỗi khi không thể load API
- Tự động clear error khi load thành công

### Validation errors
- Hiển thị thông báo khi địa chỉ chưa hoàn chỉnh
- Hướng dẫn user cách nhập địa chỉ đúng

## Dependencies
- `axios`: Để gọi API
- `lucide-react`: Icon MapPinIcon
- `react`: Hooks và types

## API Endpoint
- **URL**: `https://provinces.open-api.vn/api/?depth=2`
- **Method**: GET
- **Response**: JSON array của tỉnh/thành phố và quận/huyện
- **Caching**: Không cache, load mỗi lần component mount

## Performance
- Load dữ liệu một lần khi component mount
- Filter quận/huyện theo tỉnh đã chọn
- Không re-render không cần thiết
- Optimized với useCallback và useMemo (có thể thêm nếu cần)

## Tương thích
- React 18+
- TypeScript
- Tailwind CSS
- Axios 