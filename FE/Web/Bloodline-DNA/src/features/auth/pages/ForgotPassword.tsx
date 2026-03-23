import { Button, Form, Input, Modal } from "antd";
import { Ban, Heart, Mail, Shield, Unlock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import { emailRules } from "../../../utils/validators/auth";
import { forgotPassword, resetPassword } from "../api/forgotPasswordApi";
import type { ForgotPassword, ResetPassword } from "../types/auth.types";

export const ForgotPasswordForm: React.FC = () => {
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [emailSent, setEmailSent] = useState<string>("");
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5); // thời gian đếm ngược (giây)
  const navigate = useNavigate();

  useEffect(() => {
    if (resetSuccess) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate("/login");
            setIsModalVisible(false);
            setResetSuccess(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // cleanup nếu modal đóng
    }
  }, [resetSuccess, navigate]);

  const handleForgotPassword = async (values: ForgotPassword) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      setEmailSent(values.email);
      setIsModalVisible(true);
      form.resetFields();
    } catch (error) {
      console.error("Gửi yêu cầu thất bại:", error);
      form.setFields([
        {
          name: "email",
          errors: [(error as Error).message],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: ResetPassword) => {
  setResetLoading(true);
  try {
    const payload = {
      email: emailSent,
      otpCode: values.otpCode,
      newPassword: values.newPassword,
    };
    await resetPassword(payload.email, payload.otpCode, payload.newPassword);

    setResetSuccess(true); // ← Bắt đầu hiển thị trạng thái thành công
    setCountdown(5); // ← Đặt lại thời gian đếm ngược 5s
    resetForm.resetFields();
  } catch (error) {
    console.error("Reset password error:", error);
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
      {/* Left side */}
      <div className="relative flex items-center justify-center flex-1 p-12 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-lg text-center text-white">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm">
                <svg
                  className="w-12 h-12 text-white animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <style>
                      {`
                        .dna-strand1 { animation: dna-rotate 4s linear infinite; }
                        .dna-strand2 { animation: dna-rotate 4s linear infinite reverse; }
                        @keyframes dna-rotate {
                          0% { transform: rotateY(0deg); }
                          100% { transform: rotateY(360deg); }
                        }
                      `}
                    </style>
                  </defs>
                  <g className="dna-strand1">
                    <path
                      d="M8 2c0 4-2 6-2 10s2 6 2 10"
                      strokeLinecap="round"
                    />
                    <circle cx="8" cy="4" r="1.5" fill="currentColor" />
                    <circle cx="6" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="6" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="20" r="1.5" fill="currentColor" />
                  </g>
                  <g className="dna-strand2">
                    <path
                      d="M16 2c0 4 2 6 2 10s-2 6-2 10"
                      strokeLinecap="round"
                    />
                    <circle cx="16" cy="4" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="20" r="1.5" fill="currentColor" />
                  </g>
                  <line
                    x1="8"
                    y1="4"
                    x2="16"
                    y2="4"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <line
                    x1="6"
                    y1="8"
                    x2="18"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <line
                    x1="8"
                    y1="12"
                    x2="16"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <line
                    x1="6"
                    y1="16"
                    x2="18"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <line
                    x1="8"
                    y1="20"
                    x2="16"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                </svg>
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

      {/* Right side - form */}
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
              rules={emailRules}
              className="mb-3"
              help={
                form.getFieldError("email").length > 0 ? (
                  <div className="flex items-center gap-1.5 mt-2 mb-4 text-sm text-red-500">
                    <Ban size={14} className="mt-[1px]" />
                    <span>{form.getFieldError("email")[0]}</span>
                  </div>
                ) : null
              }
              validateStatus={
                form.getFieldError("email").length > 0 ? "error" : ""
              }
            >
              <Input
                size="large"
                placeholder="Nhập email của bạn"
                prefix={<Mail size={15} className="mr-1 text-gray-400" />}
                className="border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full py-3 text-base font-semibold transition-all bg-blue-600 border-none rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl"
              >
                {loading ? "Đang xử lý..." : "Gửi Yêu Cầu"}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <p className="text-sm text-gray-600 ">
              Quay lại.{""}
              <Link
                to="/login"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="ml-2 font-semibold text-green-600 hover:text-green-700 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
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
              rules={[{ required: true, message: "Vui lòng nhập mã xác nhận" }]}
            >
              <Input placeholder="Nhập mã xác nhận" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
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

      {loading && (
        <Loading
          fullScreen={true}
          message="Đang gửi yêu cầu đặt lại mật khẩu..."
          size="large"
          color="blue"
        />
      )}
    </div>
  );
};
