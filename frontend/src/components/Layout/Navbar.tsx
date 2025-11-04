'use client';

import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, DatabaseOutlined, BookOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header } = Layout;

export default function Navbar() {
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">首页</Link>,
    },
    {
      key: '/config',
      icon: <DatabaseOutlined />,
      label: <Link href="/config">ES 配置</Link>,
    },
    {
      key: '/tasks',
      icon: <BookOutlined />,
      label: <Link href="/tasks">任务</Link>,
    },
  ];

  return (
    <Header style={{ 
      background: '#fff', 
      padding: '0 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
          }}>
            ElastiQuest
          </div>
        </Link>
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ 
            border: 'none',
            flex: 1,
            minWidth: 0,
          }}
        />
      </div>
    </Header>
  );
}

