'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Heart, Lock, Mail, Shield, Users, Dna } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Đăng nhập thất bại');
      }

      // API returns { data: { token, userName, role, userId }, message, statusCode }
      const loginData = data.data;

      // Store token and user info
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify({
        userName: loginData.userName,
        role: loginData.role,
        userId: loginData.userId,
      }));

      // Redirect based on role
      switch (loginData.role) {
        case 'Admin':
          router.push('/admin/dashboard');
          break;
        case 'Staff':
          router.push('/staff/test-sample');
          break;
        case 'Manager':
          router.push('/manager/dashboard');
          break;
        case 'Client':
          router.push('/customer/bookings');
          break;
        default:
          router.push('/');
      }
    } catch (error) {
      setErrors({
        password: error instanceof Error ? error.message : 'Đăng nhập thất bại',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Left Side - Illustration */}
      <div className="relative flex-col items-center justify-center flex-1 hidden p-12 lg:flex bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-lg text-center text-white">
          {/* DNA Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm">
                <Dna size={48} className="text-white animate-pulse" />
              </div>
              <div className="absolute flex items-center justify-center w-8 h-8 bg-green-400 rounded-full -top-2 -right-2">
                <Heart size={16} className="text-white" />
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold">Hệ Thống Y Tế Thông Minh</h1>
          <p className="mb-8 text-xl text-blue-100">
            Dịch vụ xét nghiệm ADN huyết thống
          </p>

          {/* Features */}
          <div className="pt-8 mt-8 space-y-4 border-t border-white/20">
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Shield size={18} />
              <span>Bảo mật thông tin tuyệt đối</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Heart size={18} />
              <span>Theo dõi sức khỏe 24/7</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Users size={18} />
              <span>Đội ngũ bác sĩ chuyên nghiệp</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute w-16 h-16 rounded-full top-10 left-10 bg-white/10 animate-pulse" />
        <div className="absolute w-12 h-12 rounded-full bottom-20 right-16 bg-green-400/20 animate-pulse" />
        <div className="absolute w-8 h-8 rounded-full top-1/3 right-8 bg-white/15" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center flex-1 p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <Lock size={24} className="text-blue-600" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-800">Đăng Nhập</h2>
            <p className="text-gray-600">
              Truy cập vào hệ thống quản lý y tế của bạn
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Mật Khẩu
              </label>
              <div className="relative">
                <Lock size={18} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu của bạn"
                  className={`w-full py-3 pl-10 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base font-semibold text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập Hệ Thống'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link
                href="/register"
                className="ml-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Quay lại{' '}
              <Link
                href="/"
                className="ml-1 font-semibold text-green-600 hover:text-green-800 hover:underline"
              >
                Trang chủ
              </Link>
            </p>
            <div className="flex items-center justify-center mt-4 space-x-4 text-xs text-gray-500">
              <span>Hỗ trợ 24/7</span>
              <span>•</span>
              <span>Bảo mật SSL</span>
              <span>•</span>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

