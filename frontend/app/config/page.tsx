'use client';

import { useState } from 'react';
import { Card, Tabs, Typography, Space, Button, Alert } from 'antd';
import { DatabaseOutlined, UnorderedListOutlined, HomeOutlined } from '@ant-design/icons';
import ESConnectionForm from '@/components/Config/ESConnectionForm';
import ESConnectionList from '@/components/Config/ESConnectionList';
import { ESConnectionConfig, useAppStore } from '@/stores/useAppStore';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [editingConfig, setEditingConfig] = useState<ESConnectionConfig | null>(null);
  const { esConnections, activeConnectionId } = useAppStore();

  const handleAddSuccess = () => {
    // 添加成功后切换到列表页
    setActiveTab('list');
    setEditingConfig(null);
  };

  const handleEdit = (config: ESConnectionConfig) => {
    setEditingConfig(config);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingConfig(null);
    setActiveTab('list');
  };

  const hasActiveConnection = esConnections.length > 0 && activeConnectionId;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2}>
              <DatabaseOutlined /> ES 连接配置
            </Title>
            <Paragraph type="secondary">
              配置和管理你的 Elasticsearch 连接。你可以添加多个连接配置，并在不同环境之间切换。
            </Paragraph>
          </div>
          <Link href="/">
            <Button type="default" icon={<HomeOutlined />} size="large">
              返回首页
            </Button>
          </Link>
        </div>

        {hasActiveConnection && (
          <Alert
            message="配置完成！"
            description={
              <div>
                你已经配置了 ES 连接，现在可以{' '}
                <Link href="/tasks" style={{ fontWeight: 'bold' }}>
                  开始任务
                </Link>
                {' '}或{' '}
                <Link href="/" style={{ fontWeight: 'bold' }}>
                  返回首页
                </Link>
              </div>
            }
            type="success"
            showIcon
            closable
          />
        )}

        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            if (key === 'list') {
              setEditingConfig(null);
            }
          }}
          items={[
            {
              key: 'list',
              label: (
                <span>
                  <UnorderedListOutlined />
                  连接列表
                </span>
              ),
              children: <ESConnectionList onEdit={handleEdit} />
            },
            {
              key: 'add',
              label: (
                <span>
                  <DatabaseOutlined />
                  {editingConfig ? '编辑连接' : '添加连接'}
                </span>
              ),
              children: (
                <Card>
                  <ESConnectionForm
                    onSuccess={handleAddSuccess}
                    editingConfig={editingConfig}
                    onCancelEdit={handleCancelEdit}
                  />
                </Card>
              )
            }
          ]}
        />
      </Space>
    </div>
  );
}

