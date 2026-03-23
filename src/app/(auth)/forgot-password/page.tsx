'use client';

import { Button, Form, Input, Modal } from "antd";
import { Heart, Mail, Shield, Unlock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DnaIllustration } from "@/components/auth/DnaIllustration";

export default function ForgotPasswordPage() {
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [emailSent, setEmailSent] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (resetSuccess) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push("/login");
            setIsModalVisible(false);
            setResetSuccess(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resetSuccess, router]);

  useEffect(() => {
    if (isModalVisible && emailSent) {
      resetForm.setFieldsValue({ email: emailSent });
    }
  }, [isModalVisible, emailSent, resetForm]);

  const handleForgotPassword = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể gửi email");
      }

      setEmailSent(values.email);
      setIsModalVisible(true);
      form.resetFields();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Có lỗi xảy ra";
      form.setFields([
        {
          name: "email",
          errors: [msg],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: {
    otpCode: string;
    newPassword: string;
  }) => {
    setResetLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailSent,
          otpCode: values.otpCode,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể đặt lại mật khẩu");
      }

      setResetSuccess(true);
      setCountdown(5);
      resetForm.resetFields();
    } catch (error) {
      resetForm.setFields([
        {
          name: "otpCode",
          errors: ["Mã OTP không hợp lệ hoặc đã hết hạn"],
        },
      ]);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Left Side */}
      <div className="relative flex-col items-center justify-center flex-1 hidden p-12 lg:flex bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-lg text-center text-white">
          <div className="flex justify-center mb-8">
            <DnaIllustration badgeIcon={Heart} badgeColor="bg-green-400" />
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
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <Unlock size={24} className="text-blue-600" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-800">
              Quên Mật Khẩu
            </h2>
            <p className="text-gray-600">
              Nhập email để nhận hướng dẫn đặt lại mật khẩu
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleForgotPassword}
            className="space-y-6"
            disabled={loading}
            requiredMark={false}
          >
            <Form.Item
              label={
                <span className="text-sm font-semibold text-gray-700">
                  Địa chỉ Email <span className="text-red-500">*</span>
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
                prefix={<Mail size={15} className="mr-1 text-gray-400" />}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full py-3 text-base font-semibold bg-blue-600 border-none rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl"
              >
                {loading ? "Đang xử lý..." : "Gửi Yêu Cầu"}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Quay lại{" "}
              <Link
                href="/login"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="ml-2 font-semibold text-green-600 hover:text-green-700 hover:underline"
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
        </div>
      </div>

      <Modal
        title="Xác nhận đổi mật khẩu"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setResetSuccess(false);
          setCountdown(5);
        }}
        footer={null}
      >
        {resetSuccess ? (
          <div className="py-6 text-center">
            <p className="text-lg font-semibold text-green-600">
              ✅ Mật khẩu đã được đặt lại thành công!
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Đang chuyển đến trang đăng nhập sau{" "}
              <span className="font-semibold text-blue-600">{countdown}</span>{" "}
              giây...
            </p>
          </div>
        ) : (
          <Form
            form={resetForm}
            layout="vertical"
            onFinish={handleResetPassword}
          >
            <Form.Item label="Email" name="email" initialValue={emailSent}>
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Mã xác nhận (OTP)"
              name="otpCode"
              rules={[
                { required: true, message: "Vui lòng nhập mã xác nhận" },
              ]}
            >
              <Input placeholder="Nhập mã xác nhận" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={resetLoading}
              >
                Xác nhận đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
