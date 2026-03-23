import { Dna } from "lucide-react";
import React, { useState } from "react";
import {
  FaAngleDown,
  FaAngleRight,
  FaBookReader,
  FaChartBar,
  FaShippingFast,
} from "react-icons/fa";
import { GrTestDesktop } from "react-icons/gr";
import { MdDomainAdd } from "react-icons/md";
import { TiStarHalfOutline } from "react-icons/ti";
import { Link, useLocation } from "react-router-dom";
import { FaMoneyBillTransfer } from "react-icons/fa6";


interface SidebarDataType {
  icon: React.ElementType;
  heading: string;
  href: string;
  children?: SidebarDataType[];
}

const SidebarData: SidebarDataType[] = [
  {
    icon: FaChartBar,
    heading: "Quản lí doanh thu",
    href: "/manager/dashboard",
  },
  {
    icon: GrTestDesktop,
    heading: "Quản lí đơn xét nghiệm",
    href: "/manager/test-booking",
  },
  {
    icon: MdDomainAdd,
    heading: "Quản lí dịch vụ",
    href: "/manager/test-management",
  },
  {
    icon: FaShippingFast,
    heading: "Quản lý giao - nhận TestKit",
    href: "/manager/delivery",
  },
  {
    icon: MdDomainAdd,
    heading: "Quản lí thẻ bài viết",
    href: "/manager/tags",
  },
  {
    icon: FaBookReader,
    heading: "Quản lí bài viết",
    href: "/manager/blogs",
  },
  {
    icon: TiStarHalfOutline,
    heading: "Các đánh giá",
    href: "/manager/feedback",
  },
  {
    icon: FaMoneyBillTransfer,
    heading: "Quản lí lịch sử thanh toán",
    href: "/manager/list-payment",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleDropdown = (heading: string) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [heading]: !prev[heading],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('accountId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-[#1F2B6C] shadow-lg ">
      <div className="flex flex-col items-center py-6">
        <div className="w-14 h-14 rounded-full bg-[#1F2B6C] flex items-center justify-center mb-2">
          <Dna size={32} className="text-white" />
        </div>
        <span className="text-2xl font-bold text-center text-white">
          ADN Huyết Thống
        </span>
      </div>
      <nav className="flex-1 px-6 py-6 overflow-y-auto scrollbar-hide">
        <ul className="space-y-2">
          {SidebarData.map((item) => (
            <li key={item.heading}>
              {item.children ? (
                <>
                  <div
                    onClick={() => toggleDropdown(item.heading)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-sm font-medium ${
                      pathname === item.href
                        ? "bg-[#FCFEFE] font-bold text-[#1F2B6C]"
                        : "text-white hover:bg-[#FCFEFE] hover:text-[#1F2B6C]"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 text-lg">
                        <item.icon />
                      </div>
                      {item.heading}
                    </div>
                    {openDropdown[item.heading] ? (
                      <FaAngleDown />
                    ) : (
                      <FaAngleRight />
                    )}
                  </div>
                  {openDropdown[item.heading] && (
                    <ul className="mt-1 ml-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.heading}>
                          <Link to={child.href}>
                            <div
                              className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium ${
                                pathname === child.href
                                  ? "bg-[#FCFEFE] font-bold text-[#1F2B6C]"
                                  : "text-white hover:bg-[#FCFEFE] hover:text-[#1F2B6C]"
                              }`}
                            >
                              <div className="mr-3 text-lg">
                                <child.icon />
                              </div>
                              {child.heading}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link to={item.href}>
                  <div
                    className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      pathname === item.href
                        ? "bg-[#FCFEFE] font-bold text-[#1F2B6C]"
                        : "text-white hover:bg-[#FCFEFE] hover:text-[#1F2B6C]"
                    }`}
                  >
                    <div className="mr-3 text-lg">
                      <item.icon />
                    </div>
                    {item.heading}
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 py-6">
        <Link to="/">
          <button
            className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-[#1F2B6C] bg-white hover:bg-[#EDEBDF] transition-colors"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
