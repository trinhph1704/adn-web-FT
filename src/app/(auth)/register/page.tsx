'use client';

import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { Activity, Clock, Heart, Shield, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DnaIllustration } from "@/components/auth/DnaIllustration";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const router = useRouter();

  const handleRegister = async (values: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    terms: boolean;
  }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Đăng ký thất bại");
      }

      setRegisteredEmail(values.email);
      setShowSuccess(true);
      form.resetFields();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Đăng ký thất bại";
      message.error(msg);
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("email")
      ) {
        form.setFields([{ name: "email", errors: [msg] }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    setShowSuccess(false);
    router.push("/login");
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-md p-8 text-center bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
            <UserPlus size={40} className="text-green-600" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Đăng Ký Thành Công!
          </h2>
          <p className="mb-6 text-gray-600">
            Tài khoản của bạn đã được tạo thành công. Vui lòng kiểm tra email{" "}
            <span className="font-semibold">{registeredEmail}</span> để xác thực.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={handleGoToLogin}
            className="bg-green-600 hover:bg-green-700"
          >
            Đăng nhập ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Left Side - Illustration */}
      <div className="relative flex-col items-center justify-center flex-1 hidden p-12 lg:flex bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="text-center text-white max-w-lg">
          <div className="flex justify-center mb-8">
            <DnaIllustration
              badgeIcon={Activity}
              badgeColor="bg-blue-400"
            />
          </div>

          <h1 className="mb-4 text-4xl font-bold">Tham Gia Cùng Chúng Tôi</h1>
          <p className="mb-8 text-xl text-green-100">
            Hành trình kiểm tra toàn diện với dịch vụ ADN huyết thống
          </p>

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

          <div className="pt-8 mt-8 border-t border-white/20">
            <p className="mb-4 text-sm text-green-200">Được tin tưởng bởi</p>
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="text-center">
                <span className="block text-2xl font-bold">50K+</span>
                <span className="text-xs">Khách hàng</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">200+</span>
                <span className="text-xs">Chuyên gia</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">15+</span>
                <span className="text-xs">Năm kinh nghiệm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute w-16 h-16 rounded-full top-10 left-10 bg-white/10 animate-pulse" />
        <div className="absolute w-12 h-12 rounded-full bottom-20 right-16 bg-blue-400/20 animate-pulse" />
        <div className="absolute w-8 h-8 rounded-full top-1/3 right-8 bg-white/15" />
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex items-center justify-center flex-1 p-8 overflow-y-auto bg-white">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
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

          <Form
            form={form}
            name="register"
            onFinish={handleRegister}
            layout="vertical"
            requiredMark={false}
            disabled={loading}
          >
            <Form.Item
              name="fullName"
              label={
                <span className="text-sm font-semibold text-gray-700">
                  <span className="text-red-400">*</span> Họ và tên
                </span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập họ tên" },
                { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nhập tên đầy đủ. Ví dụ: Nguyễn Văn A"
                className="rounded-lg"
              />
            </Form.Item>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Item
                name="email"
                label={
                  <span className="text-sm font-semibold text-gray-700">
                    <span className="text-red-400">*</span> Email
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Nhập địa chỉ email"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label={
                  <span className="text-sm font-semibold text-gray-700">
                    <span className="text-red-400">*</span> Số điện thoại
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Nhập số điện thoại"
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="address"
              label={
                <span className="text-sm font-semibold text-gray-700">
                  <span className="text-red-400">*</span> Địa chỉ
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input
                size="large"
                placeholder="Nhập địa chỉ chi tiết của bạn"
                className="rounded-lg"
              />
            </Form.Item>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Item
                name="password"
                label={
                  <span className="text-sm font-semibold text-gray-700">
                    <span className="text-red-400">*</span> Mật khẩu
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập mật khẩu"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={
                  <span className="text-sm font-semibold text-gray-700">
                    <span className="text-red-400">*</span> Xác nhận mật khẩu
                  </span>
                }
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập lại mật khẩu"
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Vui lòng đồng ý với điều khoản dịch vụ")
                        ),
                },
              ]}
              label={
                <span className="text-sm font-semibold text-gray-700">
                  <span className="text-red-400">*</span> Điều khoản
                </span>
              }
            >
              <Checkbox className="text-gray-600">
                Tôi đồng ý với{" "}
                <a
                  href="#"
                  className="text-green-600 hover:text-green-800 hover:underline"
                >
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a
                  href="#"
                  className="text-green-600 hover:text-green-800 hover:underline"
                >
                  Chính sách bảo mật
                </a>
              </Checkbox>
            </Form.Item>

            <Form.Item className="mt-6 mb-6">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full py-3 text-base font-semibold bg-green-600 border-none rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl"
              >
                {loading ? "Đang xử lý..." : "Tạo Tài Khoản"}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <p className="mb-4 text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="ml-2 font-semibold text-green-600 hover:text-green-800 hover:underline"
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
