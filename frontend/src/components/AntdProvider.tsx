'use client';

import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ReactNode, useEffect } from 'react';
import { initWarningSuppress } from '@/lib/suppressWarnings';

export default function AntdProvider({ children }: { children: ReactNode }) {
  // 初始化警告抑制
  useEffect(() => {
    initWarningSuppress();
  }, []);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        cssVar: true,
        hashed: false,
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}

