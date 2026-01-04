'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Heart, Shield, Users, Dna, Unlock, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrors({ email: 'Vui lòng nhập email' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Email không hợp lệ' });
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      // Call API to send OTP
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể gửi email');
      }

      setStep('otp');
    } catch (error) {
      setErrors({ 
        email: error instanceof Error ? error.message : 'Có lỗi xảy ra' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!otpCode) newErrors.otpCode = 'Vui lòng nhập mã xác nhận';
    if (!newPassword) newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    else if (newPassword.length < 6) newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể đặt lại mật khẩu');
      }

      setStep('success');
      
      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setErrors({ 
        otpCode: error instanceof Error ? error.message : 'Mã OTP không hợp lệ' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Left Side */}
      <div className="relative flex-col items-center justify-center flex-1 hidden p-12 lg:flex bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-lg text-center text-white">
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
          <h1 className="mb-4 text-4xl font-bold">Khôi Phục Tài Khoản</h1>
          <p className="mb-8 text-xl text-blue-100">
            Lấy lại quyền truy cập hệ thống y tế của bạn
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Shield size={20} />
              <span>Bảo mật thông tin tuyệt đối</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Heart size={20} />
              <span>Hỗ trợ khôi phục nhanh chóng</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Users size={20} />
              <span>Đội ngũ hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center flex-1 p-8 bg-white">
        <div className="w-full max-w-md">
          {step === 'success' ? (
            <div className="py-6 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
                <Unlock size={40} className="text-green-600" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-green-600">
                ✅ Mật khẩu đã được đặt lại thành công!
              </h2>
              <p className="mt-2 text-gray-500">
                Đang chuyển đến trang đăng nhập sau{' '}
                <span className="font-semibold text-blue-600">{countdown}</span>{' '}
                giây...
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                  <Unlock size={24} className="text-blue-600" />
                </div>
                <h2 className="mb-2 text-3xl font-bold text-gray-800">
                  {step === 'email' ? 'Quên Mật Khẩu' : 'Đặt Lại Mật Khẩu'}
                </h2>
                <p className="text-gray-600">
                  {step === 'email'
                    ? 'Nhập email để nhận hướng dẫn đặt lại mật khẩu'
                    : 'Nhập mã xác nhận và mật khẩu mới'}
                </p>
              </div>

              {step === 'email' ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Địa chỉ Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors({});
                        }}
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 text-base font-semibold text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang xử lý...' : 'Gửi Yêu Cầu'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full py-3 px-4 border rounded-lg bg-gray-100 border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Mã xác nhận (OTP) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value);
                        setErrors((prev) => ({ ...prev, otpCode: '' }));
                      }}
                      placeholder="Nhập mã xác nhận"
                      className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.otpCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {errors.otpCode && (
                      <p className="mt-1 text-sm text-red-500">{errors.otpCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, newPassword: '' }));
                      }}
                      placeholder="Nhập mật khẩu mới"
                      className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <ArrowLeft size={18} />
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Quay lại{' '}
                  <Link
                    href="/login"
                    className="ml-1 font-semibold text-blue-600 hover:underline"
                  >
                    Đăng nhập
                  </Link>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Chưa có tài khoản?{' '}
                  <Link
                    href="/register"
                    className="ml-1 font-semibold text-green-600 hover:underline"
                  >
                    Đăng ký ngay
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

