import { Button, Modal } from "antd";
import { ArrowRight, CheckCircle, Mail, SquareAsterisk, UserRoundPlus } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
  email?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  onGoToLogin,
  email,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      closable={false}
      maskClosable={false}
      className="success-modal"
      styles={{
        body: { padding: 0 },
      }}
    >
      <div className="relative overflow-hidden bg-white rounded-lg">
        {/* Success Animation Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50"></div>

        {/* Decorative Elements */}
        <div className="absolute w-32 h-32 rounded-full -top-16 -right-16 bg-green-100/50"></div>
        <div className="absolute w-20 h-20 rounded-full -bottom-10 -left-10 bg-emerald-100/50"></div>

        <div className="relative px-8 py-10 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <CheckCircle
                  size={40}
                  className="text-green-600 animate-pulse"
                />
              </div>
              {/* Animated Ring */}
              <div className="absolute inset-0 border-4 border-green-200 rounded-full opacity-75 animate-ping"></div>
              <div className="absolute border-2 border-green-300 rounded-full inset-2 animate-pulse"></div>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="mb-3 text-2xl font-bold text-gray-800">
            🎉 Đăng Ký Thành Công!
          </h2>

          <p className="mb-2 text-gray-600">
            Chúc mừng bạn đã tạo tài khoản thành công!
          </p>

          {/* Email Info */}
          {email && (
            <div className="flex items-center justify-center p-3 mx-4 mb-6 rounded-lg bg-blue-50">
              <Mail size={16} className="text-blue-600 " />
              <p className="text-sm text-blue-800 ">
                Email tài khoản đã được đăng ký:{" "}
                <span className="font-semibold">{email}</span>
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 mx-2 mb-6 rounded-lg bg-yellow-50">
            <div className="flex items-start space-x-3">
              <SquareAsterisk size={16} className="text-yellow-600 " />
              <div className="text-left">
                <h4 className="mb-1 text-sm font-semibold text-yellow-800">
                  Lưu ý:
                </h4>
                <ul className="space-y-1 text-xs text-yellow-700">
                  <li>• Email tài khoản chỉ đăng ký 1 lần.</li>
                  <li>• Không chia sẻ tài khoản với người khác.</li>
                  <li>• Sử dụng email thật để đảm bảo nhận được <br/> thông báo.</li>
                  <li>• Nên dùng mật khẩu mạnh (bao gồm chữ hoa, chữ thường, số, ký tự đặc biệt).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 space-y-3">
            <Button
              type="primary"
              size="middle"
              onClick={onGoToLogin}
              className="w-full font-semibold transition-all bg-green-600 border-none rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl"
              icon={<ArrowRight size={15} />}
            >
              Đi đến trang Đăng Nhập
            </Button>

            <Button
              size="middle"
              onClick={onClose}
              className="w-full text-gray-600 transition-all border-gray-300 rounded-lg hover:border-gray-400"
              icon={<UserRoundPlus size={15} />}
            >
              Đăng ký tài khoản khác
            </Button>
          </div>

          {/* Footer Note */}
          <div className="flex justify-center pt-4 mt-6 text-xs text-gray-500 border-t border-gray-100 ">
            <p className="mr-1">
              Liên hệ hỗ trợ 24/7 hoặc hệ thống Chat tự động..
            </p>
            <Link style={{ textDecoration: "underline" }} to="/">
              Trang chủ
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;