'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Activity, 
  Clock, 
  Shield, 
  Heart, 
  Users,
  Dna,
  UserPlus,
  CheckCircle
} from 'lucide-react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (!formData.terms) {
      newErrors.terms = 'Vui lòng đồng ý với điều khoản dịch vụ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Đăng ký thất bại');
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('email')) {
        setErrors({ email: error.message });
      } else {
        setErrors({ 
          confirmPassword: error instanceof Error ? error.message : 'Đăng ký thất bại' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-md p-8 text-center bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Đăng Ký Thành Công!</h2>
          <p className="mb-6 text-gray-600">
            Tài khoản của bạn đã được tạo thành công. 
            Bạn sẽ được chuyển hướng đến trang đăng nhập...
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Left Side - Illustration */}
      <div className="relative flex-col items-center justify-center flex-1 hidden p-12 lg:flex bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="text-center text-white max-w">
          {/* DNA Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm">
                <Dna size={48} className="text-white" />
              </div>
              <div className="absolute flex items-center justify-center w-8 h-8 bg-blue-400 rounded-full -top-2 -right-2 animate-bounce">
                <Activity size={16} className="text-white" />
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold">Tham Gia Cùng Chúng Tôi</h1>
          <p className="mb-8 text-xl text-green-100">
            Hành trình kiểm tra toàn diện với dịch vụ ADN huyết thống
          </p>

          {/* Registration Benefits */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 text-green-100">
              <Clock size={20} />
              <span>Đặt lịch khám nhanh chóng</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-green-100">
              <Shield size={20} />
              <span>Lưu trữ hồ sơ y tế an toàn</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-green-100">
              <Heart size={20} />
              <span>Theo dõi sức khỏe liên tục</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-green-100">
              <Users size={20} />
              <span>Kết nối với bác sĩ chuyên khoa</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 mt-8 border-t border-white/20">
            <p className="mb-4 text-sm text-green-200">Được tin tưởng bởi</p>
            <div className="flex items-center justify-center space-x-8 text-white/80">
              <div className="text-center">
                <span className="block text-2xl font-bold">50K+</span>
                <span className="text-xs">Bệnh nhân</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">200+</span>
                <span className="text-xs">Bác sĩ</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">15+</span>
                <span className="text-xs">Chuyên khoa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute w-16 h-16 rounded-full top-10 left-10 bg-white/10 animate-pulse" />
        <div className="absolute w-12 h-12 rounded-full bottom-20 right-16 bg-blue-400/20 animate-pulse" />
        <div className="absolute w-8 h-8 rounded-full top-1/3 right-8 bg-white/15" />
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex items-center justify-center flex-1 p-8 overflow-y-auto bg-white">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
              <UserPlus size={24} className="text-green-600" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-800">
              Đăng Ký Tài Khoản
            </h2>
            <p className="text-gray-600">
              Tạo tài khoản để truy cập đầy đủ dịch vụ y tế
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                <span className="text-red-500">*</span> Họ và tên
              </label>
              <div className="relative">
                <User size={18} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập tên đầy đủ. Ví dụ: Nguyễn Văn A"
                  className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  <span className="text-red-500">*</span> Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ email"
                    className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  <span className="text-red-500">*</span> Số điện thoại
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                <span className="text-red-500">*</span> Địa chỉ
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ chi tiết của bạn"
                  className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  <span className="text-red-500">*</span> Mật khẩu
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  <span className="text-red-500">*</span> Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-green-600 hover:underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-green-600 hover:underline">
                    Chính sách bảo mật
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 text-base font-semibold text-white transition-all bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="mb-4 text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                href="/login"
                className="ml-1 font-semibold text-green-600 hover:text-green-800 hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>Miễn phí đăng ký</span>
              <span>•</span>
              <span>Bảo mật tuyệt đối</span>
              <span>•</span>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

