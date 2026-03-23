import { WechatWorkOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { Eye, EyeOff, Heart, Lock, Mail, Shield, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading, { ButtonLoading } from "../../../components/Loading";
import { getUserInfoApi, loginApi } from "../api/loginApi";
import type { Login } from "../types/auth.types";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (data: Login) => {
    setLoading(true);
    try {
      const response = await loginApi(data.email, data.password);
      localStorage.setItem("token", response.data.token);
      const userData = await getUserInfoApi(response.data.token);
      if (!userData) {
        message.error("Không thể lấy thông tin người dùng");
        return;
      }
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("accountId", userData.id);

      const user = {
        userName: response.data.userName,
        role: response.data.role,
      };
      localStorage.setItem("user", JSON.stringify(user));
      const userRole = response.data.role;
      switch (userRole) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Staff":
          navigate("/staff/test-sample");
          break;
        case "Manager":
          navigate("/manager/dashboard");
          break;
        case "Client":
          navigate("/customer");
          break;
        default:
          message.error("Role không hợp lệ");
          break;
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      form.setFields([
        {
          name: "password",
          errors: [
            error instanceof Error ? error.message : "Lỗi không xác định",
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Left Side - Medical Image/Illustration */}
      <div className="relative flex items-center justify-center flex-1 p-12 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-lg text-center text-white">
          {/* Medical Cross Icon */}
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
                  {/* DNA Double Helix */}
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

                  {/* Left DNA Strand */}
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

                  {/* Right DNA Strand */}
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

                  {/* Connecting Lines */}
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
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <WechatWorkOutlined size={20} />
              <span>Hỏi đáp nhanh 24h cùng chatbotAI</span>
            </div>
          </div>
        </div>

        {/* Decorative medical elements */}
        <div className="absolute w-16 h-16 rounded-full top-10 left-10 bg-white/10 animate-pulse"></div>
        <div className="absolute w-12 h-12 rounded-full bottom-20 right-16 bg-green-400/20 animate-pulse"></div>
        <div className="absolute w-8 h-8 rounded-full top-1/3 right-8 bg-white/15"></div>
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
                className="text-xs border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500 custom-placeholder"
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
                prefix={<Lock size={15} className="text-gray-400 mr-0.5" />}
                suffix={
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 transition-colors cursor-pointer hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </span>
                }
                className="border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <Link
                to="/forgot-password"
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
                className="w-full py-3 text-base font-semibold transition-all bg-blue-600 border-none rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl"
              >
                {loading ? (
                  <ButtonLoading message="Đang đăng nhập..." />
                ) : (
                  "Đăng Nhập Hệ Thống"
                )}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Quay lại{""}
              <Link
                to="/"
                className="ml-2 font-semibold text-green-600 hover:text-green-800 hover:underline"
              >
                Trang chủ
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
};

export default LoginForm;