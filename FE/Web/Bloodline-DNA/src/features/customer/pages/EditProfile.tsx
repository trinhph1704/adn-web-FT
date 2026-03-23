import {
  ArrowLeftIcon,
  EditIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SaveIcon,
  UserIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Footer, Header } from "../../../components";
import Loading from "../../../components/Loading";
import ChatbotAI from "../../chatbotAI/components/ChatbotAI";
import { getMockUserData, getUserInfoApi, updateUserInfoApi, type UpdateUserData } from "../api/userApi";
import { AddressSelector } from "../components/AddressSelector";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  role?: string;
}

export const EditProfile = (): React.JSX.Element => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "", 
    phone: "",
    address: "",
    role: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  
  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }>({});

  // Load user data from API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        
        const userData = await getUserInfoApi();
        
        // Validate essential data
        if (!userData || !userData.id) {
          throw new Error("Dữ liệu người dùng không hợp lệ");
        }
        
        // Transform API data to profile format with safe fallbacks
        const userProfile: UserProfile = {
          name: userData.fullName || 'Chưa cập nhật',
          email: userData.email || 'Chưa cập nhật',
          phone: userData.phone || 'Chưa cập nhật',
          address: userData.address || 'Chưa cập nhật',
          role: userData.role || 'Khách hàng'
        };
        
        setProfile(userProfile);
        setOriginalProfile(userProfile);
      } catch (err) {
        console.error("Error loading user data:", err);
        
        // Fallback to mock data
        const mockData = getMockUserData();
        const mockProfile: UserProfile = {
          name: mockData.fullName,
          email: mockData.email,
          phone: mockData.phone,
          address: mockData.address,
          role: mockData.role
        };
        
        setProfile(mockProfile);
        setOriginalProfile(mockProfile);
        
        // Set error message based on the error from API
        const errorMessage = err instanceof Error 
          ? err.message
          : 'Không thể tải thông tin người dùng';
        setError(`${errorMessage}. Đang hiển thị dữ liệu mẫu.`);
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing (only for validated fields)
    if ((field === 'name' || field === 'phone' || field === 'address') && fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validation function
  const validateField = (field: keyof UserProfile, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value || value.trim() === '' || value === 'Chưa cập nhật') {
          return 'Họ và tên không được để trống';
        }
        if (value.trim().length < 2) {
          return 'Họ và tên phải có ít nhất 2 ký tự';
        }
        break;
      
      case 'phone':
        if (!value || value.trim() === '' || value === 'Chưa cập nhật') {
          return 'Số điện thoại không được để trống';
        }
        const phoneRegex = /^(0[3-9])[0-9]{8}$/;
        if (!phoneRegex.test(value.trim())) {
          return 'Số điện thoại không hợp lệ (ví dụ: 0901234567)';
        }
        break;
      
      case 'address':
        if (!value || value.trim() === '' || value === 'Chưa cập nhật') {
          return 'Địa chỉ không được để trống';
        }
        const addressCommaCount = (value.match(/,/g) || []).length;
        if (addressCommaCount < 1) {
          return 'Vui lòng chọn tỉnh/thành phố từ danh sách';
        }
        break;
      
      default:
        break;
    }
    return undefined;
  };

  // Validate all fields
  const validateAllFields = (): boolean => {
    const errors: typeof fieldErrors = {};
    let hasErrors = false;

    // Validate name
    const nameError = validateField('name', profile.name || '');
    if (nameError) {
      errors.name = nameError;
      hasErrors = true;
    }

    // Validate phone
    const phoneError = validateField('phone', profile.phone || '');
    if (phoneError) {
      errors.phone = phoneError;
      hasErrors = true;
    }

    // Validate address
    const addressError = validateField('address', profile.address || '');
    if (addressError) {
      errors.address = addressError;
      hasErrors = true;
    }

    setFieldErrors(errors);
    return !hasErrors;
  };

  const handleSave = async () => {
    // Clear previous errors
    setError(null);
    
    // Validate all fields first
    if (!validateAllFields()) {
      setError('Vui lòng kiểm tra và sửa các lỗi trong form');
      return;
    }

    setLoading(true);
    try {
      // Prepare update data (exclude email as it's not updatable)
      const updateData: UpdateUserData = {
        fullName: profile.name.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim()
      };

      // Call update API
      const updatedUser = await updateUserInfoApi(updateData);
      
      // Update profile with response data
      const updatedProfile: UserProfile = {
        name: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role
      };
      
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setIsEditing(false);
      
      // Clear any previous errors and show success
      setError(null);
      setFieldErrors({});
      setSuccessMessage('Cập nhật thông tin thành công!');
      
      // Clear success message and reload page after 2 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        // Reload the page to show updated data
        window.location.reload();
      }, 2000);
      
      console.log('✅ Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      
      // Set error message for user
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Có lỗi xảy ra khi cập nhật thông tin';
      setError(`Lỗi cập nhật: ${errorMessage}`);
      
      // TODO: Add error toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    if (originalProfile) {
      setProfile(originalProfile);
    }
    // Clear validation errors
    setFieldErrors({});
    setError(null);
  };

  // Loading state
  if (initialLoading) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="relative z-50">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading 
            size="large" 
            message="Đang tải thông tin người dùng..." 
            color="blue" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        {/* Header */}
        <div className="relative z-50">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative w-full py-20 overflow-hidden md:py-28 bg-blue-50">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af"/></svg>
          </div>
          <div className="container relative z-10 px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">Trang Chủ</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbLink href="/customer/booking-list" className="text-blue-600 hover:text-blue-800">Tài khoản của tôi</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><span className="font-semibold text-blue-900">Chỉnh Sửa Hồ Sơ</span></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">Chỉnh Sửa Hồ Sơ
              <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
                Cập nhật thông tin cá nhân
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">Cập nhật và quản lý thông tin cá nhân của bạn để nhận được dịch vụ tốt nhất.</p>
          </div>
        </section>

        {/* Success Message Display */}
        {successMessage && (
          <section className="py-4 border-green-200 bg-green-50 border-y-2">
            <div className="container max-w-4xl px-4 mx-auto md:px-6 lg:px-8">
              <div className="flex items-center p-4 bg-green-100 border border-green-200 rounded-lg">
                <div className="mr-3 text-green-600">✅</div>
                <div className="flex-1">
                  <p className="font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Error/Warning Display */}
        {error && (
          <section className={`py-4 border-y-2 ${
            error.includes('đăng nhập') || error.includes('hết hạn') 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="container max-w-4xl px-4 mx-auto md:px-6 lg:px-8">
              <div className={`flex items-center p-4 rounded-lg border ${
                error.includes('đăng nhập') || error.includes('hết hạn')
                  ? 'bg-orange-100 border-orange-200'
                  : 'bg-yellow-100 border-yellow-200'
              }`}>
                <div className={`mr-3 ${
                  error.includes('đăng nhập') || error.includes('hết hạn') 
                    ? 'text-orange-600' 
                    : 'text-yellow-600'
                }`}>
                  {error.includes('đăng nhập') || error.includes('hết hạn') ? '🔐' : '⚠️'}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    error.includes('đăng nhập') || error.includes('hết hạn') 
                      ? 'text-orange-800' 
                      : 'text-yellow-800'
                  }`}>{error}</p>
                  {error.includes('mẫu') && !error.includes('đăng nhập') && (
                    <p className="mt-1 text-sm text-yellow-600">
                      Để xem dữ liệu thực từ API, vui lòng kiểm tra kết nối mạng hoặc liên hệ hỗ trợ.
                    </p>
                  )}
                                     {error.includes('đăng nhập') && (
                     <p className="mt-1 text-sm text-orange-600">
                       Vui lòng đăng nhập để xem thông tin cá nhân. Hiện tại đang hiển thị dữ liệu mẫu.
                     </p>
                   )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Profile Edit Form */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container max-w-4xl px-4 mx-auto md:px-6 lg:px-8">
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader className="p-6 text-white rounded-t-lg bg-gradient-to-r from-blue-900 to-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-white/20">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Thông Tin Cá Nhân</h2>
                      <p className="text-white/90">Quản lý và cập nhật thông tin của bạn</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="text-white bg-white/20 hover:bg-white/30 border-white/30"
                      variant="outline"
                    >
                      <EditIcon className="w-4 h-4 mr-2" />
                      Chỉnh Sửa
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Profile Avatar */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
                        <UserIcon className="w-12 h-12 text-white" />
                      </div>
                      {isEditing && (
                        <button type="button" title="Edit Icon" className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 !text-white transition-colors duration-200 bg-blue-600 rounded-full hover:bg-blue-700">
                          <EditIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900">
                      {profile.name && profile.name !== 'Chưa cập nhật' ? profile.name : 'Chưa có tên'}
                    </h3>
                    <p className="text-slate-600">
                      {profile.role && profile.role !== 'Khách hàng' ? `Vai trò: ${profile.role}` : 'Vai trò: Khách hàng'}
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Name Field */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Họ và Tên
                      </label>
                      {isEditing ? (
                        <div>
                          <Input
                            type="text"
                            value={profile.name === 'Chưa cập nhật' ? '' : profile.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 ${
                              fieldErrors.name 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-200'
                            }`}
                            placeholder="Nhập họ và tên"
                          />
                          {fieldErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                          )}
                        </div>
                      ) : (
                        <Input
                          type="text"
                          value={profile.name}
                          readOnly
                          className="w-full p-3 border-2 border-gray-200 rounded-lg cursor-not-allowed bg-gray-50"
                        />
                      )}
                    </div>

                    {/* Email Field - Always Read-only */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <MailIcon className="w-4 h-4 mr-2" />
                        Email
                        <span className="ml-2 text-xs text-gray-500">(Không thể chỉnh sửa)</span>
                      </label>
                      <Input
                        type="email"
                        value={profile.email}
                        readOnly
                        className="w-full p-3 border-2 border-gray-200 rounded-lg cursor-not-allowed bg-gray-50"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        Số Điện Thoại
                      </label>
                      {isEditing ? (
                        <div>
                          <Input
                            type="tel"
                            value={profile.phone === 'Chưa cập nhật' ? '' : profile.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 ${
                              fieldErrors.phone 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-200'
                            }`}
                            placeholder="Nhập số điện thoại"
                          />
                          {fieldErrors.phone && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                          )}
                        </div>
                      ) : (
                        <Input
                          type="tel"
                          value={profile.phone}
                          readOnly
                          className="w-full p-3 border-2 border-gray-200 rounded-lg cursor-not-allowed bg-gray-50"
                        />
                      )}
                    </div>

                    {/* Address Field */}
                    <div className="space-y-1">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        Địa Chỉ
                      </label>
                      {isEditing ? (
                        <div>
                          <AddressSelector
                            value={profile.address === 'Chưa cập nhật' ? '' : profile.address}
                            onChange={(newAddress) => handleInputChange('address', newAddress)}
                            placeholder="Nhập địa chỉ chi tiết của bạn"
                            required={true}
                            className={`w-full ${
                              fieldErrors.address 
                                ? 'border-red-500 focus:border-red-500' 
                                : ''
                            }`}
                          />
                          {fieldErrors.address && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>
                          )}
                        </div>
                      ) : (
                        <Input
                          type="text"
                          value={profile.address}
                          readOnly
                          className="w-full p-3 border-2 border-gray-200 rounded-lg cursor-not-allowed bg-gray-50"
                        />
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex flex-col gap-4 pt-6 border-t border-gray-200 sm:flex-row">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 px-8 py-3 font-semibold !text-white bg-blue-900 rounded-lg hover:bg-blue-800 sm:flex-none"
                      >
                        {loading ? (
                          <div className="w-5 h-5 mr-2 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                        ) : (
                          <SaveIcon className="w-5 h-5 mr-2" />
                        )}
                        {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 px-8 py-3 font-semibold text-gray-700 border-gray-300 rounded-lg hover:bg-gray-50 sm:flex-none"
                      >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Hủy Bỏ
                      </Button>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="pt-6 border-t border-gray-200">
                      <div className="p-4 rounded-lg bg-blue-50">
                        <p className="text-sm text-blue-800">
                          <strong>Lưu ý:</strong> Thông tin cá nhân của bạn được bảo mật và chỉ được sử dụng cho mục đích cung cấp dịch vụ y tế.
                        </p>
                      </div>
                    </div>
                  )}


                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="relative">
          <div className="fixed bottom-0 right-0 p-4">
            <ChatbotAI />
          </div>
          <Footer />
        </div>
      </div>
      
      {/* Fullscreen Loading when saving */}
      {loading && (
        <Loading
          fullScreen={true}
          message="Đang lưu thông tin cá nhân..."
          size="large"
          color="blue"
        />
      )}
    </div>
  );
}; 