import React, { useState, useEffect } from 'react';
import { MapPinIcon } from 'lucide-react';
import axios from 'axios';

interface AddressSelectorProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

interface Province {
  code: string;
  name: string;
  districts: District[];
}

interface District {
  name: string;
  province: string;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
  placeholder = "Nhập địa chỉ chi tiết",
  disabled = false,
  required = false,
  className = ""
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentDetailedAddress, setCurrentDetailedAddress] = useState('');

  // Auto-enable district selection when TP.HCM is loaded
  useEffect(() => {
    if (selectedProvince && districts.length > 0 && !value.includes('Thành phố Hồ Chí Minh')) {
      // Nếu đã có selectedProvince và districts, nhưng value chưa có TP.HCM
      // thì cập nhật value để bao gồm TP.HCM
      const currentAddress = getDetailedAddress();
      const newAddress = currentAddress ? `${currentAddress}, ${selectedProvince}` : selectedProvince;
      onChange(newAddress);
    }
  }, [selectedProvince, districts.length]);

  // Parse địa chỉ từ value để set selectedDistrict
  useEffect(() => {
    if (value && districts.length > 0 && !isTyping) {
      const addressParts = value.split(',').map(part => part.trim());
      
      // Tìm quận/huyện trong địa chỉ
      const districtPart = addressParts.find(part => 
        districts.some(d => d.name === part)
      );
      
      if (districtPart) {
        setSelectedDistrict(districtPart);
      }
      
      console.log('📍 Parsed address:', { addressParts, districtPart, selectedDistrict: districtPart || 'not found' });
    }
  }, [value, districts, isTyping]);

  // Clear error when data loads successfully
  useEffect(() => {
    if (provinces.length > 0 && error) {
      setError(null);
    }
  }, [provinces, error]);

  // Update currentDetailedAddress when value changes from outside
  useEffect(() => {
    if (!isTyping) {
      setCurrentDetailedAddress(getDetailedAddress());
    }
  }, [value, isTyping]);

  // Reset selections when value changes to empty
  useEffect(() => {
    if (!value) {
      setSelectedProvince('');
      setSelectedDistrict('');
    }
  }, [value]);

  // Handle special case for "TẠI CƠ SỞ" address
  const isClinicAddress = value === 'TẠI CƠ SỞ';

  useEffect(() => {
    const fetchAddressData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/?depth=2");
        
        // Chỉ lấy thành phố Hồ Chí Minh
        const hcmCity = response.data.find((province: Province) => 
          province.name.toLowerCase().includes('hồ chí minh') || 
          province.name.toLowerCase().includes('tp.hcm') ||
          province.name.toLowerCase().includes('tp hcm') ||
          province.code === '79' // Mã code của TP.HCM
        );
        
        if (hcmCity) {
          // Chỉ set TP.HCM làm province duy nhất
          setProvinces([hcmCity]);
          
          // Tự động chọn TP.HCM làm selectedProvince
          setSelectedProvince(hcmCity.name);
          
          // Lấy tất cả quận/huyện của TP.HCM
          const hcmDistricts: District[] = [];
          hcmCity.districts.forEach((district: any) => {
            hcmDistricts.push({
              name: district.name,
              province: hcmCity.name,
            });
          });
          setDistricts(hcmDistricts);
          
          console.log('📍 Loaded TP.HCM with districts:', hcmDistricts.length);
          console.log('📍 Auto-selected province:', hcmCity.name);
          
          // Nếu chưa có địa chỉ nào và không phải clinic address, tự động set TP.HCM vào value
          if (!value || value === '') {
            onChange(hcmCity.name);
          }
        } else {
          throw new Error('Không tìm thấy thành phố Hồ Chí Minh trong dữ liệu');
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
        setError("Không thể tải danh sách địa chỉ. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddressData();
  }, []);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    
    // Cập nhật địa chỉ với quận/huyện mới - luôn sử dụng TP.HCM làm tỉnh
    const currentAddress = getDetailedAddress();
    const provinceName = selectedProvince || 'Thành phố Hồ Chí Minh';
    
    if (districtName) {
      const newAddress = currentAddress ? `${currentAddress}, ${districtName}, ${provinceName}` : `${districtName}, ${provinceName}`;
      onChange(newAddress);
    } else {
      // Nếu bỏ chọn quận/huyện, chỉ giữ lại địa chỉ chi tiết + TP.HCM
      const newAddress = currentAddress ? `${currentAddress}, ${provinceName}` : provinceName;
      onChange(newAddress);
    }
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const addressValue = e.target.value;
    setCurrentDetailedAddress(addressValue);
    
    let fullAddress = '';
    const provinceName = selectedProvince || 'Thành phố Hồ Chí Minh';
    
    // Xây dựng địa chỉ đầy đủ
    if (addressValue && selectedDistrict) {
      fullAddress = `${addressValue}, ${selectedDistrict}, ${provinceName}`;
    } else if (addressValue) {
      fullAddress = `${addressValue}, ${provinceName}`;
    } else if (selectedDistrict) {
      fullAddress = `${selectedDistrict}, ${provinceName}`;
    } else {
      fullAddress = provinceName;
    }
    
    onChange(fullAddress);
  };

  const handleAddressInputFocus = () => {
    setIsTyping(true);
  };

  const handleAddressInputBlur = () => {
    setIsTyping(false);
  };

  // Lấy phần địa chỉ chi tiết (không bao gồm quận/huyện, tỉnh)
  const getDetailedAddress = () => {
    if (!value) return '';
    
    const parts = value.split(',').map(part => part.trim());
    
    // Loại bỏ các phần là tên quận/huyện và TP.HCM
    const filteredParts = parts.filter(part => {
      // Kiểm tra xem có phải là tên quận/huyện không
      const isDistrict = districts.some(d => d.name === part);
      // Kiểm tra xem có phải là TP.HCM không
      const isHCM = part.toLowerCase().includes('hồ chí minh') || 
                   part.toLowerCase().includes('tp.hcm') ||
                   part.toLowerCase().includes('tp hcm');
      
      return !isDistrict && !isHCM;
    });
    
    return filteredParts.join(', ').trim();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Special case for clinic address */}
      {isClinicAddress ? (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Địa chỉ:</strong> {value}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Xét nghiệm sẽ được thực hiện tại trung tâm
          </p>
        </div>
      ) : (
        <>
          {/* Tỉnh/Thành phố - Hiển thị thông tin TP.HCM */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố {required && <span className="text-red-500">*</span>}
            </label>
            <div className="w-full p-3 border border-gray-200 rounded-lg bg-blue-50">
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  {selectedProvince || 'Thành phố Hồ Chí Minh'}
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Dịch vụ hiện chỉ khả dụng tại TP. Hồ Chí Minh
              </p>
            </div>
          </div>

          {/* Quận/Huyện */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện {required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={disabled || isLoading || districts.length === 0}
              required={required}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((district) => (
                <option key={district.name} value={district.name}>
                  {district.name}
                </option>
              ))}
              {isLoading && (
                <option value="" disabled>
                  Đang tải dữ liệu...
                </option>
              )}
              {districts.length === 0 && !isLoading && (
                <option value="" disabled>
                  Không có dữ liệu quận/huyện
                </option>
              )}
            </select>
          </div>

          {/* Địa chỉ chi tiết */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ chi tiết {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={isTyping ? currentDetailedAddress : getDetailedAddress()}
                onChange={handleAddressInputChange}
                onFocus={handleAddressInputFocus}
                onBlur={handleAddressInputBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Số 123, Đường ABC, Phường XYZ
            </p>
          </div>
        </>
      )}
    </div>
  );
}; 