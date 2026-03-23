import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { Activity, Clock, Heart, Shield, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddressSelector } from "../../customer/components/AddressSelector";
import { SuccessModal } from "../../../components";
import Loading from "../../../components/Loading";
import {
  addressRules,
  createConfirmPasswordValidator,
  emailRules,
  fullNameRules,
  passwordRules,
  phoneRules,
  termsValidator,
} from "../../../utils/validators/auth";
import { registerApi } from "../api/registerApi";
import { UserRole, type RegisterUser } from "../types/auth.types";

const RegisterForm: React.FC = () => {
  const [form] = Form.useForm();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (values: RegisterUser) => {
    setLoading(true);

    const registerData: RegisterUser = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      address: address || values.address, // Use address state or fallback to form value
      password: values.password,
      role: UserRole.Client,
    };

    try {
      await registerApi(registerData);

      // Lưu email để hiển thị trong modal
      setRegisteredEmail(values.email);

      // Hiển thị modal thành công thay vì message
      setShowSuccessModal(true);

      // Reset form
      form.resetFields();
      setConfirmPassword("");
      setPasswordsMatch(true);
      setAddress(""); // Reset address state
    } catch (error) {
      console.error("Đăng ký thất bại:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Đăng ký thất bại, vui lòng kiểm tra lại thông tin";

      // Hiển thị message lỗi ở góc
      message.error(errorMessage);

      // Gắn lỗi trực tiếp vào trường email nếu có từ khóa "email"
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("email")
      ) {
        form.setFields([
          {
            name: "email",
            errors: [error.message],
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle success modal actions
  const handleGoToLogin = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setRegisteredEmail("");
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setFieldsValue({ PasswordHash: value });

    // Check if passwords match
    if (confirmPassword) {
      setPasswordsMatch(confirmPassword === value);
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);

    const password = form.getFieldValue("password");
    setPasswordsMatch(value === password);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Left Side - Medical Registration Image/Illustration */}
        <div className="relative flex items-center justify-center flex-1 p-12 bg-gradient-to-br from-green-600 to-emerald-700">
          <div className="text-center text-white max-w">
            {/* Medical Registration Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    {/* DNA Double Helix with Glow Effect */}
                    <defs>
                      <style>
                        {`
                          .dna-glow { 
                            filter: drop-shadow(0 0 8px rgba(255,255,255,0.6));
                            animation: dna-pulse 3s ease-in-out infinite;
                          }
                          @keyframes dna-pulse {
                            0%, 100% { opacity: 1; transform: scale(1); }
                            50% { opacity: 0.8; transform: scale(1.05); }
                          }
                        `}
                      </style>
                    </defs>

                    <g className="dna-glow">
                      {/* Left DNA Strand */}
                      <path
                        d="M8 2c0 4-2 6-2 10s2 6 2 10"
                        strokeLinecap="round"
                      />
                      <circle cx="8" cy="4" r="1.5" fill="currentColor" />
                      <circle cx="6" cy="8" r="1.5" fill="currentColor" />
                      <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                      <circle cx="6" cy="16" r="1.5" fill="currentColor" />
                      <circle cx="8" cy="20" r="1.5" fill="currentColor" />

                      {/* Right DNA Strand */}
                      <path
                        d="M16 2c0 4 2 6 2 10s-2 6-2 10"
                        strokeLinecap="round"
                      />
                      <circle cx="16" cy="4" r="1.5" fill="currentColor" />
                      <circle cx="18" cy="8" r="1.5" fill="currentColor" />
                      <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                      <circle cx="18" cy="16" r="1.5" fill="currentColor" />
                      <circle cx="16" cy="20" r="1.5" fill="currentColor" />

                      {/* Connecting Lines */}
                      <line
                        x1="8"
                        y1="4"
                        x2="16"
                        y2="4"
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity="0.8"
                      />
                      <line
                        x1="6"
                        y1="8"
                        x2="18"
                        y2="8"
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity="0.8"
                      />
                      <line
                        x1="8"
                        y1="12"
                        x2="16"
                        y2="12"
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity="0.8"
                      />
                      <line
                        x1="6"
                        y1="16"
                        x2="18"
                        y2="16"
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity="0.8"
                      />
                      <line
                        x1="8"
                        y1="20"
                        x2="16"
                        y2="20"
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity="0.8"
                      />
                    </g>
                  </svg>
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
                <span className="text-2xl font-bold">50K+</span>
                <span className="text-xs">Bệnh nhân</span>
                <span className="text-2xl font-bold">200+</span>
                <span className="text-xs">Bác sĩ</span>
                <span className="text-2xl font-bold">15+</span>
                <span className="text-xs">Chuyên khoa</span>
              </div>
            </div>
          </div>

          {/* Decorative medical elements */}
          <div className="absolute w-16 h-16 rounded-full top-10 left-10 bg-white/10 animate-pulse"></div>
          <div className="absolute w-12 h-12 rounded-full bottom-20 right-16 bg-blue-400/20 animate-pulse"></div>
          <div className="absolute w-8 h-8 rounded-full top-1/3 right-8 bg-white/15"></div>
          <div className="absolute w-10 h-10 rounded-full bottom-1/3 left-8 bg-emerald-400/20"></div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex items-center justify-center flex-1 p-8 overflow-y-auto bg-white">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="mb-8 text-center ">
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
            <Form
              form={form}
              name="register"
              onFinish={handleRegister}
              layout="vertical"
              requiredMark={false}
              className="space-y-0"
              disabled={loading}
            >
              <Form.Item
                name="fullName"
                label={
                  <span className="text-sm font-semibold text-gray-700">
                    <span className="text-xs text-red-400">*</span> Họ và tên
                  </span>
                }
                rules={fullNameRules}
              >
                <Input
                  size="middle"
                  prefix={
                    <UserOutlined size={15} className="text-gray-400 mr-0.5" />
                  }
                  placeholder="Nhập tên đầy đủ. Ví dụ: Nguyễn Văn A"
                  className="border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                />
              </Form.Item>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  name="email"
                  label={
                    <div className="text-sm font-semibold text-gray-700">
                      <span className="text-xs text-red-400">*</span> Email
                    </div>
                  }
                  rules={emailRules}
                >
                  <Input
                    size="middle"
                    prefix={
                      <MailOutlined
                        size={15}
                        className="text-gray-400 mr-0.5"
                      />
                    }
                    placeholder="Nhập địa chỉ email thực"
                    className="border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={
                    <span className="text-sm font-semibold text-gray-700">
                      <span className="text-xs text-red-400">*</span> Số điện
                      thoại
                    </span>
                  }
                  rules={phoneRules}
                >
                  <Input
                    size="middle"
                    prefix={
                      <PhoneOutlined
                        size={15}
                        className="text-gray-400 mr-0.5"
                      />
                    }
                    placeholder="Nhập số điện thoại"
                    className="border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                  />
                </Form.Item>
              </div>
              <p style={{marginTop: '-15px', marginBottom: '18px', fontSize: '9px'}} className="italic text-gray-500">
                (Lưu ý: Vui lòng sử dụng{" "}
                <strong>email và số điện thoại thực</strong> để đảm bảo một số nhu cầu về dịch vụ cũng như tài khoản..)
              </p>

              <Form.Item
                name="address"
                label={
                  <span className="text-sm font-semibold text-gray-700">
                    <span className="text-xs text-red-400">*</span> Địa chỉ
                  </span>
                }
                rules={addressRules}
              >
                <AddressSelector
                  value={address}
                  onChange={(newAddress) => {
                    setAddress(newAddress);
                    form.setFieldValue('address', newAddress);
                  }}
                  placeholder="Nhập địa chỉ chi tiết của bạn"
                  required={true}
                />
              </Form.Item>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  name="password"
                  label={
                    <span className="text-sm font-semibold text-gray-700">
                      <span className="text-xs text-red-400">*</span> Mật khẩu
                    </span>
                  }
                  rules={passwordRules}
                >
                  <Input.Password
                    size="middle"
                    prefix={
                      <LockOutlined
                        size={15}
                        className="text-gray-400 mr-0.5"
                      />
                    }
                    placeholder="Nhập mật khẩu của bạn"
                    onChange={handlePasswordChange}
                    className="border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label={
                    <span className="text-sm font-semibold text-gray-700">
                      <span className="text-xs text-red-400">*</span> Xác nhận
                      mật khẩu
                    </span>
                  }
                  rules={[createConfirmPasswordValidator(form.getFieldValue)]}
                >
                  <Input.Password
                    size="middle"
                    prefix={
                      <LockOutlined
                        size={15}
                        className="text-gray-400 mr-0.5"
                      />
                    }
                    placeholder="Nhập lại mật khẩu của bạn"
                    onChange={handleConfirmPasswordChange}
                    className="border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                    status={
                      !passwordsMatch && confirmPassword !== "" ? "error" : ""
                    }
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="terms"
                valuePropName="checked"
                rules={[termsValidator]}
                label={
                  <span className="text-sm font-semibold text-gray-700">
                    <span className="text-xs text-red-400">*</span> Điều khoản
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

              <Form.Item className="mt-10 mb-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full py-3 text-base font-semibold transition-all bg-green-600 border-none rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl"
                >
                  {loading ? "Đang xử lý..." : "Tạo Tài Khoản"}
                </Button>
              </Form.Item>
            </Form>

            {/* Footer */}
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
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

        {loading && (
          <Loading
            fullScreen={true}
            message="Đang tạo tài khoản..."
            size="large"
            color="green"
          />
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleCloseModal}
        onGoToLogin={handleGoToLogin}
        email={registeredEmail}
      />
    </>
  );
};

export default RegisterForm;