'use client';

import { Button, Form, Input, message } from "antd";
import { Eye, EyeOff, Heart, Lock, Mail, Shield, Users } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DnaIllustration } from "@/components/auth/DnaIllustration";
import Loading, { ButtonLoading } from "@/components/shared/Loading";
import { getUserInfoApi, loginApi } from "@/lib/api/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await loginApi(values.email, values.password);
      const loginData = response.data;

      localStorage.setItem("token", loginData.token);
      const userData = await getUserInfoApi(loginData.token);
      if (!userData) {
        message.error("Không thể lấy thông tin người dùng");
        return;
      }
      localStorage.setItem("accountId", userData.id);

      const user = {
        userName: loginData.userName,
        role: loginData.role,
      };
      localStorage.setItem("user", JSON.stringify(user));

      switch (loginData.role) {
        case "Admin":
          router.push("/admin/dashboard");
          break;
        case "Staff":
          router.push("/staff/test-sample");
          break;
        case "Manager":
          router.push("/manager/dashboard");
          break;
        case "Client":
          router.push("/customer");
          break;
        default:
          message.error("Role không hợp lệ");
          break;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Đăng nhập thất bại";
      message.error(msg);
      form.setFields([
        {
          name: "password",
          errors: [msg],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Left Side - Illustration */}
      <div className="relative flex-col items-center justify-center flex-1 hidden p-12 lg:flex bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-lg text-center text-white">
          <div className="flex justify-center mb-8">
            <DnaIllustration badgeIcon={Heart} badgeColor="bg-green-400" />
          </div>

          <h1 className="mb-4 text-4xl font-bold">Hệ Thống Y Tế Thông Minh</h1>
          <p className="mb-8 text-xl text-blue-100">
            Dịch vụ xét nghiệm ADN huyết thống
          </p>

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
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <MessageCircle size={18} />
              <span>Hỏi đáp nhanh 24h cùng chatbotAI</span>
            </div>
          </div>
        </div>

        <div className="absolute w-16 h-16 rounded-full top-10 left-10 bg-white/10 animate-pulse" />
        <div className="absolute w-12 h-12 rounded-full bottom-20 right-16 bg-green-400/20 animate-pulse" />
        <div className="absolute w-8 h-8 rounded-full top-1/3 right-8 bg-white/15" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center flex-1 p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <Lock size={24} className="text-blue-600" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-800">
              Đăng Nhập
            </h2>
            <p className="text-gray-600">
              Truy cập vào hệ thống quản lý y tế của bạn
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            className="space-y-6"
            disabled={loading}
          >
            <Form.Item
              label={
                <span className="text-sm font-semibold text-gray-700">
                  Địa chỉ Email
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập email của bạn"
                prefix={<Mail size={15} className="mr-0.5 text-gray-400" />}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-sm font-semibold text-gray-700">
                  Mật Khẩu
                </span>
              }
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input
                size="large"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu của bạn"
                prefix={<Lock size={15} className="mr-0.5 text-gray-400" />}
                suffix={
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-gray-400 hover:text-blue-600"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </span>
                }
                className="rounded-lg"
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="w-full py-3 text-base font-semibold !bg-blue-600 !border-none rounded-lg shadow-lg hover:!bg-blue-700 hover:shadow-xl"
              >
                {loading ? (
                  <ButtonLoading message="Đang đăng nhập..." />
                ) : (
                  "Đăng Nhập Hệ Thống"
                )}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Quay lại{" "}
              <Link
                href="/"
                className="ml-2 font-semibold text-green-600 hover:text-green-800 hover:underline"
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
      {loading && (
        <Loading
          fullScreen={true}
          message="Đang xác thực thông tin đăng nhập..."
          size="large"
          color="blue"
        />
      )}
    </div>
  );
}
