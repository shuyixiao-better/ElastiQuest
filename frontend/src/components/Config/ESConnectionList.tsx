'use client';

import { List, Card, Button, Tag, Space, Popconfirm, message, Spin } from 'antd';
import { DeleteOutlined, CheckCircleOutlined, ApiOutlined, EditOutlined } from '@ant-design/icons';
import { useAppStore, ESConnectionConfig } from '@/stores/useAppStore';
import { testESConnection } from '@/lib/api/esConnection';
import { useState } from 'react';

interface ESConnectionListProps {
  onEdit?: (config: ESConnectionConfig) => void;
}

export default function ESConnectionList({ onEdit }: ESConnectionListProps) {
  const { esConnections, activeConnectionId, setActiveConnection, removeConnection } = useAppStore();
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTest = async (config: ESConnectionConfig) => {
    setTestingId(config.id);
    try {
      const result = await testESConnection(config);
      if (result.success) {
        message.success(`连接成功！集群: ${result.clusterName}, 版本: ${result.version}`);
      } else {
        message.error(`连接失败: ${result.error || result.message}`);
      }
    } catch (error) {
      message.error('测试连接时发生错误');
    } finally {
      setTestingId(null);
    }
  };

  const handleDelete = (id: string) => {
    removeConnection(id);
    message.success('配置已删除');
  };

  const handleSetActive = (id: string) => {
    setActiveConnection(id);
    message.success('已设置为活动连接');
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'development':
        return 'blue';
      case 'test':
        return 'orange';
      case 'production':
        return 'red';
      default:
        return 'default';
    }
  };

  const getEnvironmentText = (env: string) => {
    switch (env) {
      case 'development':
        return '开发环境';
      case 'test':
        return '测试环境';
      case 'production':
        return '生产环境';
      default:
        return env;
    }
  };

  if (esConnections.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <ApiOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <p>暂无 ES 连接配置</p>
          <p>请添加一个新的连接配置</p>
        </div>
      </Card>
    );
  }

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
      dataSource={esConnections}
      renderItem={(config) => (
        <List.Item>
          <Card
            title={
              <Space>
                {config.name}
                {activeConnectionId === config.id && (
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    活动
                  </Tag>
                )}
              </Space>
            }
            extra={
              <Space>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEdit?.(config)}
                  title="编辑"
                />
                <Popconfirm
                  title="确定要删除这个配置吗？"
                  onConfirm={() => handleDelete(config.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} title="删除" />
                </Popconfirm>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <strong>地址:</strong> {config.scheme}://{config.host}:{config.port}
              </div>
              {config.username && (
                <div>
                  <strong>用户名:</strong> {config.username}
                </div>
              )}
              <div>
                <strong>环境:</strong>{' '}
                <Tag color={getEnvironmentColor(config.environment)}>
                  {getEnvironmentText(config.environment)}
                </Tag>
              </div>
              <div>
                <strong>创建时间:</strong> {new Date(config.createdAt).toLocaleString('zh-CN')}
              </div>
              <Space style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleTest(config)}
                  loading={testingId === config.id}
                  disabled={testingId !== null && testingId !== config.id}
                >
                  {testingId === config.id ? '测试中...' : '测试连接'}
                </Button>
                {activeConnectionId !== config.id && (
                  <Button size="small" onClick={() => handleSetActive(config.id)}>
                    设为活动
                  </Button>
                )}
              </Space>
            </Space>
          </Card>
        </List.Item>
      )}
    />
  );
}

