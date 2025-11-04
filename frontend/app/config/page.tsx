'use client';

import { useState } from 'react';
import { Card, Tabs, Typography, Space } from 'antd';
import { DatabaseOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ESConnectionForm from '@/components/Config/ESConnectionForm';
import ESConnectionList from '@/components/Config/ESConnectionList';
import { ESConnectionConfig } from '@/stores/useAppStore';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [editingConfig, setEditingConfig] = useState<ESConnectionConfig | null>(null);

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

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>
            <DatabaseOutlined /> ES 连接配置
          </Title>
          <Paragraph type="secondary">
            配置和管理你的 Elasticsearch 连接。你可以添加多个连接配置，并在不同环境之间切换。
          </Paragraph>
        </div>

        <Tabs activeKey={activeTab} onChange={(key) => {
          setActiveTab(key);
          if (key === 'list') {
            setEditingConfig(null);
          }
        }}>
          <TabPane
            tab={
              <span>
                <UnorderedListOutlined />
                连接列表
              </span>
            }
            key="list"
          >
            <ESConnectionList onEdit={handleEdit} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <DatabaseOutlined />
                {editingConfig ? '编辑连接' : '添加连接'}
              </span>
            }
            key="add"
          >
            <Card>
              <ESConnectionForm
                onSuccess={handleAddSuccess}
                editingConfig={editingConfig}
                onCancelEdit={handleCancelEdit}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Space>
    </div>
  );
}

