'use client';

import { Layout, Button, Badge } from 'antd';
import { HomeOutlined, DatabaseOutlined, BookOutlined, CheckCircleOutlined, RobotOutlined, TrophyOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/stores/useAppStore';

const { Header } = Layout;

export default function Navbar() {
  const pathname = usePathname();
  const { esConnections, activeConnectionId } = useAppStore();

  const hasConnection = esConnections.length > 0 && activeConnectionId;

  const navItems = [
    {
      key: '/',
      icon: <HomeOutlined style={{ fontSize: '20px' }} />,
      label: '首页',
      href: '/',
    },
    {
      key: '/exam',
      icon: <TrophyOutlined style={{ fontSize: '20px' }} />,
      label: 'ES认证考试',
      href: '/exam',
      highlight: true,
    },
    {
      key: '/config',
      icon: <DatabaseOutlined style={{ fontSize: '20px' }} />,
      label: 'ES 配置',
      href: '/config',
      badge: hasConnection,
    },
    {
      key: '/tasks',
      icon: <BookOutlined style={{ fontSize: '20px' }} />,
      label: '学习任务',
      href: '/tasks',
    },
    {
      key: '/rag',
      icon: <RobotOutlined style={{ fontSize: '20px' }} />,
      label: 'RAG 问答',
      href: '/rag',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', width: '100%' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            fontSize: '22px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
            ⚡ ElastiQuest
          </div>
        </Link>

        <div style={{
          display: 'flex',
          gap: '12px',
          flex: 1,
          justifyContent: 'center',
        }}>
          {navItems.map((item) => {
            const isActive = pathname === item.key;
            const isHighlight = item.highlight && !isActive;
            return (
              <Link key={item.key} href={item.href} style={{ textDecoration: 'none' }}>
                <Button
                  type={isActive ? 'primary' : 'default'}
                  size="large"
                  icon={item.badge ? (
                    <Badge dot status="success">
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '48px',
                    padding: '0 24px',
                    fontSize: '16px',
                    fontWeight: isActive || isHighlight ? 'bold' : 'normal',
                    background: isActive
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : isHighlight
                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                        : 'transparent',
                    color: isActive || isHighlight ? '#fff' : undefined,
                    border: isActive || isHighlight ? 'none' : '1px solid #d9d9d9',
                    boxShadow: isActive
                      ? '0 2px 8px rgba(102, 126, 234, 0.3)'
                      : isHighlight
                        ? '0 2px 8px rgba(251, 191, 36, 0.3)'
                        : 'none',
                  }}
                >
                  {item.label}
                  {item.badge && (
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </Header>
  );
}

