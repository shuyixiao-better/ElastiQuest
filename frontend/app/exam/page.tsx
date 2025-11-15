'use client';

import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { 
  DashboardOutlined, 
  BookOutlined, 
  TrophyOutlined,
  RocketOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { ExamDashboard } from '@/components/Exam/ExamDashboard';
import { TopicList } from '@/components/Exam/TopicList';
import { TopicDetail } from '@/components/Exam/TopicDetail';
import { LevelMap } from '@/components/Exam/LevelMap';
import { LevelDetail } from '@/components/Exam/LevelDetail';
import { MockExam } from '@/components/Exam/MockExam';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

type MenuKey = 'dashboard' | 'topics' | 'levels' | 'mock-exam';

export default function ExamPage() {
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '学习仪表板'
    },
    {
      key: 'topics',
      icon: <BookOutlined />,
      label: '知识点学习'
    },
    {
      key: 'levels',
      icon: <RocketOutlined />,
      label: '闯关地图'
    },
    {
      key: 'mock-exam',
      icon: <FileTextOutlined />,
      label: '模拟考试'
    }
  ];

  const renderContent = () => {
    // 如果选择了知识点，显示知识点详情
    if (selectedTopic) {
      return (
        <TopicDetail 
          topicId={selectedTopic} 
          onBack={() => setSelectedTopic(null)} 
        />
      );
    }

    // 如果选择了关卡，显示关卡详情
    if (selectedLevel) {
      return (
        <LevelDetail 
          levelId={selectedLevel} 
          onBack={() => setSelectedLevel(null)} 
        />
      );
    }

    switch (selectedMenu) {
      case 'dashboard':
        return <ExamDashboard />;
      case 'topics':
        return <TopicList onSelectTopic={(topicId) => {
          setSelectedTopic(topicId);
        }} />;
      case 'levels':
        return <LevelMap onStartLevel={(levelId) => {
          setSelectedLevel(levelId);
        }} />;
      case 'mock-exam':
        return <MockExam />;
      default:
        return <ExamDashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#001529', 
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TrophyOutlined style={{ fontSize: 32, color: '#fff', marginRight: 16 }} />
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            ES认证工程师学习平台
          </Title>
        </div>
      </Header>
      
      <Layout>
        <Sider 
          width={250} 
          style={{ background: '#fff' }}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            items={menuItems}
            style={{ height: '100%', borderRight: 0 }}
            onClick={({ key }) => setSelectedMenu(key as MenuKey)}
          />
        </Sider>
        
        <Layout style={{ padding: '0' }}>
          <Content
            style={{
              background: '#f0f2f5',
              minHeight: 280,
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
