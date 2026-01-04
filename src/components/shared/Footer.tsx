import Link from 'next/link';
import { Dna, Mail, Phone, MapPin, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600">
                <Dna size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Bloodline DNA</span>
            </Link>
            <p className="mb-4 text-sm leading-relaxed">
              Dịch vụ xét nghiệm ADN huyết thống chính xác 99.99%. 
              Kết quả nhanh chóng, bảo mật tuyệt đối.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Dịch vụ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services?type=civil" className="hover:text-white transition-colors">
                  Xét nghiệm Dân sự
                </Link>
              </li>
              <li>
                <Link href="/services?type=legal" className="hover:text-white transition-colors">
                  Xét nghiệm Hành chính
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Lấy mẫu tại nhà
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Lấy mẫu tại cơ sở
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-400" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                <a href="tel:1900xxxx" className="hover:text-white transition-colors">
                  1900-xxxx
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a href="mailto:info@bloodlinedna.com" className="hover:text-white transition-colors">
                  info@bloodlinedna.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <p>&copy; {new Date().getFullYear()} Bloodline DNA. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
