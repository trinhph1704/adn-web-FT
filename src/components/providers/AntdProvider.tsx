'use client';

import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
