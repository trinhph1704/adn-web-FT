'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { Dna, UserCircle2, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Trang chủ' },
  { href: '/about', label: 'Về chúng tôi' },
  { href: '/services', label: 'Dịch vụ' },
  { href: '/blogs', label: 'Tin tức' },
  { href: '/contacts', label: 'Liên hệ' },
];

interface UserInfo {
  userName: string;
  fullName?: string;
  role: string;
  userId: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as UserInfo;
        setUserInfo(user);
      } catch {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('accountId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserInfo(null);
    router.push('/login');
  };

  const getClientHomeLink = () => '';

  const getNavHref = (itemHref: string) => {
    if (userInfo?.role === 'Client') {
      if (itemHref === '/') return '';
      return `${itemHref}`;
    }
    return itemHref;
  };

  const isActive = (href: string) => {
    const fullPath = getNavHref(href);
    return pathname === fullPath || (href !== '/' && pathname.startsWith(fullPath));
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      onClick: () => router.push('/edit-profile'),
    },
    {
      key: 'bookings',
      label: 'Lịch sử đặt lịch',
      onClick: () => router.push('/booking-list'),
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Link
          href={userInfo?.role === 'Client' ? getClientHomeLink() : '/'}
          className="flex items-center space-x-3"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
            <Dna size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">ADN Huyết Thống</span>
        </Link>

        <nav className="hidden space-x-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={getNavHref(item.href)}
              className={`relative transition-colors duration-300 after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:transition-all after:duration-300 after:bg-blue-600 ${
                isActive(item.href)
                  ? 'text-blue-600 after:w-full'
                  : 'text-gray-600 hover:text-blue-600 after:w-0 hover:after:w-full'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {userInfo && userInfo.role === 'Client' ? (
            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" arrow>
              <div className="flex items-center space-x-2 cursor-pointer">
                <UserCircle2 size={32} className="text-blue-600" />
                <span className="font-semibold text-gray-700">
                  {userInfo.fullName || userInfo.userName}
                </span>
              </div>
            </Dropdown>
          ) : (
            <>
              <Link
                href="/login"
                className="font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                Đăng nhập
              </Link>
              <Link href="/register">
                <Button
                  type="primary"
                  size="large"
                  className="!bg-blue-600 !border-none shadow-lg hover:!bg-blue-700 hover:!shadow-xl"
                >
                  Đăng ký ngay
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="p-2 text-gray-700 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="py-4 border-t md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={getNavHref(item.href)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2" />
            {userInfo && userInfo.role === 'Client' ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">
                    {userInfo.fullName || userInfo.userName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    router.push('/booking-list');
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Lịch sử đặt lịch
                </button>
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
                  Đăng ký ngay
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
