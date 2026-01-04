'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Dna, User, LogOut } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/services', label: 'Dịch vụ' },
  { href: '/about', label: 'Giới thiệu' },
  { href: '/contact', label: 'Liên hệ' },
];

interface UserInfo {
  userName: string;
  role: string;
  userId: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserInfo;
        setIsLoggedIn(true);
        setUserInfo(user);
      } catch {
        // Invalid user data, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [pathname]); // Re-check when pathname changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserInfo(null);
    router.push('/');
  };

  const userRole = userInfo?.role || null;

  const getDashboardLink = () => {
    switch (userRole) {
      case 'Admin':
        return '/admin/dashboard';
      case 'Staff':
        return '/staff/test-sample';
      case 'Manager':
        return '/manager/dashboard';
      case 'Client':
        return '/customer/bookings';
      default:
        return '/customer/bookings';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600">
              <Dna size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-blue-900">Bloodline DNA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === link.href ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && userInfo ? (
              <>
                <span className="text-sm text-gray-600">
                  Xin chào, <span className="font-semibold text-blue-600">{userInfo.userName}</span>
                </span>
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                >
                  <User size={18} />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-red-600"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2" />
              {isLoggedIn && userInfo ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Xin chào, <span className="font-semibold text-blue-600">{userInfo.userName}</span>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-left text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
