import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {  FaChartBar,  FaAngleDown,  FaAngleRight,  FaUsers,} from 'react-icons/fa';
import { Dna } from 'lucide-react';
import { MdDomainAdd } from 'react-icons/md';

interface SidebarDataType {
  icon: React.ElementType;
  heading: string;
  href: string;
  children?: SidebarDataType[];
}

const SidebarData: SidebarDataType[] = [
  {
    icon: FaChartBar,
    heading: 'Thống kê',
    href: '/admin/dashboard'
  },
  {
    icon: FaUsers,
    heading: 'Quản lí người dùng',
    href: '/admin/users',
  },
  {
    icon: MdDomainAdd,
    heading: 'Hướng dẫn lấy mẫu',
    href: '/admin/sample-ins',
  },
  
];

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (heading: string) => {
    setOpenDropdown(prev => ({
      ...prev,
      [heading]: !prev[heading]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  return (
    <div className='flex h-screen w-64 flex-col bg-[#1F2B6C] shadow-lg'>
          <div className="flex flex-col items-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#1F2B6C] flex items-center justify-center mb-2">
              <Dna size={32} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white text-center">ADN Huyết Thống</span>
          </div>
          <nav className='scrollbar-hide flex-1 overflow-y-auto px-6 py-6'>
            <ul className='space-y-2'>
              {SidebarData.map(item => (
                <li key={item.heading}>
                  {item.children ? (
                    <>
                      <div
                        onClick={() => toggleDropdown(item.heading)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-sm font-medium ${pathname.startsWith(item.href)
                            ? 'bg-[#FCFEFE] font-bold text-[#1F2B6C]'
                            : 'text-white hover:bg-[#FCFEFE] hover:text-[#1F2B6C]'
                          }`}
                      >
                        <div className='flex items-center'>
                          <div className='mr-3 text-lg'>
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
                        <ul className='ml-2 mt-1 space-y-1'>
                          {item.children.map(child => (
                            <li key={child.heading}>
                              <Link to={child.href}>
                                <div
                                  className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium ${pathname === child.href
                                      ? 'bg-[#FCFEFE] font-bold text-[#1F2B6C]'
                                      : 'text-white hover:bg-[#FCFEFE] hover:text-[#1F2B6C]'
                                    }`}
                                >
                                  <div className='mr-3 text-lg'>
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
                        className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium ${pathname === item.href
                            ? 'bg-[#FCFEFE] font-bold text-[#1F2B6C]'
                            : 'text-white hover:bg-[#FCFEFE] hover:text-[#1F2B6C]'
                          }`}
                      >
                        <div className='mr-3 text-lg'>
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
          <div className='px-4 py-6'>
            <Link to='/'>
              <button
                className='flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-[#1F2B6C] bg-white hover:bg-[#EDEBDF] transition-colors'
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
