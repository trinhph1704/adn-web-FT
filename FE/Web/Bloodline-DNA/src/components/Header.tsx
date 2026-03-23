import { Button, Dropdown, Menu } from "antd";
import { Dna, UserCircle2 } from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem('accountId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="profile"
        onClick={() => navigate("/customer/edit-profile")}
      >
        Hồ sơ cá nhân
      </Menu.Item>
      <Menu.Item
        key="bookings"
        onClick={() => navigate("/customer/booking-list")}
      >
        Lịch sử đặt lịch
      </Menu.Item>
      <Menu.Item key="logout" danger onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const isActive = (path: string) => location.pathname === path;
  const basePath = user?.role === "Client" ? "/customer" : "";

  const navItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Về chúng tôi", path: "/about" },
    { label: "Dịch vụ", path: "/services" },
    // { label: "Các Bác Sĩ", path: "/doctors" },
    { label: "Tin tức", path: "/blogs" },
    { label: "Liên hệ", path: "/contacts" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to={user?.role === "Client" ? "/customer" : "/"}>
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
              <Dna size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              ADN Huyết Thống
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden space-x-8 md:flex">
          {navItems.map((item) => {
            let fullPath = "";

            if (item.path === "/") {
              // Trang chủ -> theo role
              fullPath = user?.role === "Client" ? "/customer" : "/";
            } else {
              fullPath = `${basePath}${item.path}`;
            }

            return (
              <a
                key={item.path}
                href={fullPath}
                className={`relative transition-colors duration-300 after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:transition-all after:duration-300 after:bg-blue-600
          ${isActive(fullPath)
                    ? "text-blue-600 after:w-full"
                    : "text-gray-600 hover:text-blue-600 after:w-0 hover:after:w-full"}
        `}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {user && user.role === "Client" ? (
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <div className="flex items-center space-x-2 cursor-pointer">
                <UserCircle2 size={32} className="text-blue-600" />
                <span className="font-semibold text-gray-700">
                  {user.fullName}
                </span>
              </div>
            </Dropdown>
          ) : (
            <>
              <Link
                to="/login"
                className="font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                Đăng nhập
              </Link>
              <Link to="/register">
                <Button
                  type="primary"
                  size="large"
                  className="transition-all bg-blue-600 border-none shadow-lg hover:bg-blue-700 hover:shadow-xl"
                >
                  Đăng ký ngay
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
