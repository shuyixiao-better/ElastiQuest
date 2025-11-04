import Link from 'next/link';
import { Button, Result } from 'antd';

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '48px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '120px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
          }}>
            404
          </div>
          <h2 style={{
            fontSize: '32px',
            marginBottom: '16px',
            color: '#333',
          }}>
            页面未找到
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '32px',
          }}>
            抱歉，您访问的页面不存在或已被移除。
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
          }}>
            <Link href="/">
              <Button type="primary" size="large">
                返回首页
              </Button>
            </Link>
            <Link href="/config">
              <Button size="large">
                配置 ES
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

