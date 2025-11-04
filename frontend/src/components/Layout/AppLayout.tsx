'use client';

import { Layout, Menu } from 'antd';
import { useState } from 'react';
import {
  HomeOutlined,
  DatabaseOutlined,
  BookOutlined,
  TrophyOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAppStore } from '@/stores/useAppStore';

const { Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [selectedKey, setSelectedKey] = useState('home');

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'tasks',
      icon: <BookOutlined />,
      label: '任务',
    },
    {
      key: 'query',
      icon: <DatabaseOutlined />,
      label: '查询构建器',
    },
    {
      key: 'achievements',
      icon: <TrophyOutlined />,
      label: '成就',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={!sidebarOpen}
        onCollapse={toggleSidebar}
        theme="light"
        width={250}
      >
        <div style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
          ElastiQuest
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px', padding: '24px', background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
