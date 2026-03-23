"use client";

import React, { useState, useEffect } from "react";
import { MapPinIcon } from "lucide-react";

interface AddressSelectorProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

interface Province {
  code?: number | string;
  name: string;
  districts?: Array<{ name: string; code?: number | string }>;
}

interface District {
  name: string;
  province?: string;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
  placeholder = "Nhập địa chỉ chi tiết",
  disabled = false,
  required = false,
  className = "",
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentDetailedAddress, setCurrentDetailedAddress] = useState("");

  useEffect(() => {
    if (
      selectedProvince &&
      districts.length > 0 &&
      !value.includes("Thành phố Hồ Chí Minh")
    ) {
      const currentAddress = getDetailedAddress();
      const newAddress = currentAddress
        ? `${currentAddress}, ${selectedProvince}`
        : selectedProvince;
      onChange(newAddress);
    }
  }, [selectedProvince, districts.length]);

  useEffect(() => {
    if (value && districts.length > 0 && !isTyping) {
      const addressParts = value.split(",").map((part) => part.trim());
      const districtPart = addressParts.find((part) =>
        districts.some((d) => d.name === part)
      );
      if (districtPart) {
        setSelectedDistrict(districtPart);
      }
    }
  }, [value, districts, isTyping]);

  useEffect(() => {
    if (provinces.length > 0 && error) {
      setError(null);
    }
  }, [provinces, error]);

  useEffect(() => {
    if (!isTyping) {
      setCurrentDetailedAddress(getDetailedAddress());
    }
  }, [value, isTyping]);

  useEffect(() => {
    if (!value) {
      setSelectedProvince("");
      setSelectedDistrict("");
    }
  }, [value]);

  const isClinicAddress = value === "TẠI CƠ SỞ";

  useEffect(() => {
    const fetchAddressData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://provinces.open-api.vn/api/?depth=2"
        );
        const data = await response.json();
        const hcmCity = data.find(
          (province: Province) =>
            province.name?.toLowerCase().includes("hồ chí minh") ||
            province.name?.toLowerCase().includes("tp.hcm") ||
            province.name?.toLowerCase().includes("tp hcm") ||
            String(province.code) === "79"
        );

        if (hcmCity) {
          setProvinces([hcmCity]);
          setSelectedProvince(hcmCity.name);
          const hcmDistricts: District[] = (hcmCity.districts ?? []).map(
            (district: { name: string }) => ({
              name: district.name,
              province: hcmCity.name,
            })
          );
          setDistricts(hcmDistricts);
          if (!value || value === "") {
            onChange(hcmCity.name);
          }
        } else {
          throw new Error("Không tìm thấy thành phố Hồ Chí Minh");
        }
      } catch (err) {
        console.error("Error fetching address data:", err);
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
    const provinceName = selectedProvince || "Thành phố Hồ Chí Minh";
    const currentAddress = getDetailedAddress();

    if (districtName) {
      const newAddress = currentAddress
        ? `${currentAddress}, ${districtName}, ${provinceName}`
        : `${districtName}, ${provinceName}`;
      onChange(newAddress);
    } else {
      const newAddress = currentAddress
        ? `${currentAddress}, ${provinceName}`
        : provinceName;
      onChange(newAddress);
    }
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const addressValue = e.target.value;
    setCurrentDetailedAddress(addressValue);
    const provinceName = selectedProvince || "Thành phố Hồ Chí Minh";

    let fullAddress = "";
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

  const getDetailedAddress = () => {
    if (!value) return "";
    const parts = value.split(",").map((part) => part.trim());
    const filteredParts = parts.filter((part) => {
      const isDistrict = districts.some((d) => d.name === part);
      const isHCM =
        part.toLowerCase().includes("hồ chí minh") ||
        part.toLowerCase().includes("tp.hcm") ||
        part.toLowerCase().includes("tp hcm");
      return !isDistrict && !isHCM;
    });
    return filteredParts.join(", ").trim();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố {required && <span className="text-red-500">*</span>}
            </label>
            <div className="w-full p-3 border border-gray-200 rounded-lg bg-blue-50">
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  {selectedProvince || "Thành phố Hồ Chí Minh"}
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Dịch vụ hiện chỉ khả dụng tại TP. Hồ Chí Minh
              </p>
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ chi tiết {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={
                  isTyping ? currentDetailedAddress : getDetailedAddress()
                }
                onChange={handleAddressInputChange}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
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
