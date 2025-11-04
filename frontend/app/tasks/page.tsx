'use client';

import { useState } from 'react';
import { Card, Tabs, Typography, Space, Tag, Progress, Row, Col, Button, Empty } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  TrophyOutlined,
  FireOutlined,
  CheckCircleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { tasks, tasksByCategory } from '@/data/tasks';
import { useAppStore } from '@/stores/useAppStore';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const categoryIcons = {
  create: <PlusOutlined />,
  read: <SearchOutlined />,
  update: <EditOutlined />,
  delete: <DeleteOutlined />,
};

const categoryNames = {
  create: '创建 (Create)',
  read: '读取 (Read)',
  update: '更新 (Update)',
  delete: '删除 (Delete)',
};

const categoryColors = {
  create: '#52c41a',
  read: '#1890ff',
  update: '#faad14',
  delete: '#ff4d4f',
};

const difficultyColors = {
  beginner: '#52c41a',
  intermediate: '#faad14',
  advanced: '#ff4d4f',
};

const difficultyNames = {
  beginner: '入门',
  intermediate: '中级',
  advanced: '高级',
};

export default function TasksPage() {
  const { gamification, esConnections, activeConnectionId } = useAppStore();
  const [activeTab, setActiveTab] = useState('all');
  
  const hasConnection = esConnections.length > 0 && activeConnectionId;
  const completedTasksCount = gamification.completedTasks.length;
  const totalTasks = tasks.length;
  const progress = (completedTasksCount / totalTasks) * 100;

  const isTaskCompleted = (taskId: string) => {
    return gamification.completedTasks.includes(taskId);
  };

  const renderTaskCard = (task: any) => {
    const completed = isTaskCompleted(task.id);
    
    return (
      <Card
        key={task.id}
        hoverable
        style={{
          marginBottom: 16,
          border: completed ? '2px solid #52c41a' : '1px solid #d9d9d9',
          opacity: !hasConnection ? 0.6 : 1,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>
                  {categoryIcons[task.category]}
                </span>
                <Title level={4} style={{ margin: 0 }}>
                  {task.title}
                  {completed && (
                    <CheckCircleOutlined 
                      style={{ color: '#52c41a', marginLeft: 8 }} 
                    />
                  )}
                </Title>
              </div>
              
              <Paragraph type="secondary" style={{ margin: 0 }}>
                {task.description}
              </Paragraph>
              
              <Space>
                <Tag color={categoryColors[task.category]}>
                  {categoryNames[task.category]}
                </Tag>
                <Tag color={difficultyColors[task.difficulty]}>
                  {difficultyNames[task.difficulty]}
                </Tag>
                <Tag icon={<FireOutlined />} color="orange">
                  +{task.experience} EXP
                </Tag>
              </Space>
            </Space>
          </div>
          
          <div style={{ marginLeft: 16 }}>
            {!hasConnection ? (
              <Button 
                icon={<LockOutlined />} 
                disabled
              >
                需要配置 ES
              </Button>
            ) : completed ? (
              <Button type="default" icon={<CheckCircleOutlined />}>
                已完成
              </Button>
            ) : (
              <Link href={`/tasks/${task.id}`}>
                <Button type="primary">
                  开始任务
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 头部信息 */}
        <Card>
          <Row gutter={24}>
            <Col span={12}>
              <Space direction="vertical" size="small">
                <Title level={2} style={{ margin: 0 }}>
                  <TrophyOutlined /> 学习任务
                </Title>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                  通过完成任务学习 Elasticsearch CRUD 操作，获得经验值升级！
                </Paragraph>
              </Space>
            </Col>
            <Col span={12}>
              <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>等级 {gamification.level}</Text>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                      {gamification.experience} EXP
                    </Text>
                  </div>
                  <Progress 
                    percent={progress} 
                    strokeColor="#fff"
                    trailColor="rgba(255,255,255,0.3)"
                    showInfo={false}
                  />
                  <Text style={{ color: 'white', fontSize: 14 }}>
                    已完成 {completedTasksCount} / {totalTasks} 个任务
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* ES 连接提示 */}
        {!hasConnection && (
          <Card style={{ background: '#fff7e6', border: '1px solid #ffd591' }}>
            <Space>
              <LockOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <div>
                <Text strong>需要先配置 ES 连接</Text>
                <br />
                <Text type="secondary">
                  在开始任务之前，请先{' '}
                  <Link href="/config" style={{ fontWeight: 'bold' }}>
                    配置 Elasticsearch 连接
                  </Link>
                </Text>
              </div>
            </Space>
          </Card>
        )}

        {/* 任务列表 */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="全部任务" key="all">
            {tasks.map(renderTaskCard)}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <PlusOutlined /> 创建
              </span>
            } 
            key="create"
          >
            {tasksByCategory.create.map(renderTaskCard)}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <SearchOutlined /> 读取
              </span>
            } 
            key="read"
          >
            {tasksByCategory.read.map(renderTaskCard)}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <EditOutlined /> 更新
              </span>
            } 
            key="update"
          >
            {tasksByCategory.update.map(renderTaskCard)}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <DeleteOutlined /> 删除
              </span>
            } 
            key="delete"
          >
            {tasksByCategory.delete.map(renderTaskCard)}
          </TabPane>
        </Tabs>
      </Space>
    </div>
  );
}

