import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-blue-100 bg-blue-50">
      <div className="px-6 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Logo & About */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-blue-800">
              ADN Huyết Thống
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Nền tảng xét nghiệm ADN huyết thống chuyên nghiệp, bảo mật và
              nhanh chóng – đồng hành cùng bạn trong hành trình xác định quan hệ
              gia đình.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-700">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  to="/about"
                  className="transition-colors hover:text-blue-600"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="transition-colors hover:text-blue-600"
                >
                  Tin tức
                </Link>
              </li>
                            <li>
                <Link
                  to="/contacts"
                  className="transition-colors hover:text-blue-600"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-700">
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Mail className="text-blue-500" size={16} />
                <span>bloodlineDNA@support.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="text-blue-500" size={16} />
                <span>+ 84 342 555 702</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="text-blue-500" size={16} />
                <span>TP Ho Chi Minh, Vietnam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 mt-12 text-sm text-center text-gray-500 border-t border-gray-200">
          © 2025 ADN Huyết Thống.
          <p className="flex justify-center gap-4 pt-2">
            <span>Bảo mật</span>
            <span>–</span>
            <span>Chính xác</span>
            <span>–</span>
            <span>Chuyên nghiệp</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
