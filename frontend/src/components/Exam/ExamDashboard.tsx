'use client';

import React from 'react';
import { Card, Progress, Row, Col, Statistic, Tag, Button, Space, Typography } from 'antd';
import { 
  TrophyOutlined, 
  FireOutlined, 
  BookOutlined, 
  CheckCircleOutlined,
  RocketOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useExamStore } from '@/stores/useExamStore';
import { examTopics, examLevels, categoryInfo } from '@/data/examTopics';

const { Title, Text, Paragraph } = Typography;

export const ExamDashboard: React.FC = () => {
  const { userProgress } = useExamStore();

  // 计算进度
  const totalTopics = examTopics.length;
  const completedTopicsCount = userProgress.completedTopics.length;
  const topicProgress = (completedTopicsCount / totalTopics) * 100;

  const totalChallenges = Object.keys(userProgress.completedChallenges).length;
  const currentLevelProgress = (userProgress.totalExperience % 1000) / 10;

  // 获取下一个关卡
  const nextLevel = examLevels.find(
    level => !userProgress.completedLevels.includes(level.id)
  );

  // 按分类统计完成情况
  const categoryProgress = Object.entries(categoryInfo).map(([key, info]) => {
    const categoryTopics = examTopics.filter(t => t.category === key);
    const completed = categoryTopics.filter(t => 
      userProgress.completedTopics.includes(t.id)
    ).length;
    return {
      category: key,
      ...info,
      total: categoryTopics.length,
      completed,
      progress: categoryTopics.length > 0 ? (completed / categoryTopics.length) * 100 : 0
    };
  });

  return (
    <div style={{ padding: '24px' }}>
      {/* 欢迎区域 */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row align="middle">
          <Col flex="auto">
            <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
              🎓 ES认证工程师学习中心
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 0 }}>
              通过游戏化的方式掌握Elasticsearch认证考试知识点
            </Paragraph>
          </Col>
          <Col>
            <Space direction="vertical" align="center">
              <Text style={{ color: 'white', fontSize: 14 }}>当前等级</Text>
              <div style={{ 
                background: 'white', 
                borderRadius: '50%', 
                width: 80, 
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 'bold',
                color: '#667eea'
              }}>
                {userProgress.level}
              </div>
              {userProgress.currentTitle && (
                <Tag color="gold" style={{ marginTop: 8 }}>
                  {userProgress.currentTitle}
                </Tag>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="完成知识点"
              value={completedTopicsCount}
              suffix={`/ ${totalTopics}`}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <Progress percent={Math.round(topicProgress)} size="small" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="完成挑战"
              value={totalChallenges}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
            <Text type="secondary">成功率: {userProgress.stats.successRate}%</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="学习时长"
              value={userProgress.stats.totalStudyTime}
              suffix="分钟"
              prefix={<FireOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="解锁成就"
              value={userProgress.achievements.length}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 等级进度 */}
      <Card title={`🎯 等级 ${userProgress.level} 进度`} style={{ marginBottom: 24 }}>
        <Progress 
          percent={Math.round(currentLevelProgress)} 
          status="active"
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
        <Text type="secondary">
          还需 {1000 - (userProgress.totalExperience % 1000)} 经验值升级到 {userProgress.level + 1} 级
        </Text>
      </Card>

      {/* 下一个关卡 */}
      {nextLevel && (
        <Card 
          title={
            <Space>
              <RocketOutlined />
              <span>下一个关卡</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
          extra={
            <Button type="primary" size="large">
              开始挑战
            </Button>
          }
        >
          <Title level={4}>{nextLevel.name}</Title>
          <Paragraph>{nextLevel.description}</Paragraph>
          <Space wrap>
            <Tag color="blue">经验奖励: +{nextLevel.rewards.experience}</Tag>
            {nextLevel.rewards.badge && (
              <Tag color="gold">徽章: {nextLevel.rewards.badge}</Tag>
            )}
            {nextLevel.rewards.title && (
              <Tag color="purple">称号: {nextLevel.rewards.title}</Tag>
            )}
          </Space>
        </Card>
      )}

      {/* 分类进度 */}
      <Card title="📊 知识点分类进度">
        <Row gutter={[16, 16]}>
          {categoryProgress.map((cat) => (
            <Col xs={24} sm={12} lg={8} key={cat.category}>
              <Card size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <span style={{ fontSize: 24 }}>{cat.icon}</span>
                    <Text strong>{cat.name}</Text>
                  </Space>
                  <Progress 
                    percent={Math.round(cat.progress)} 
                    strokeColor={cat.color}
                    format={() => `${cat.completed}/${cat.total}`}
                  />
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 成就展示 */}
      {userProgress.achievements.length > 0 && (
        <Card title="🏆 已解锁成就" style={{ marginTop: 24 }}>
          <Space wrap size="large">
            {userProgress.achievements.map((achievement, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48 }}>{achievement}</div>
              </div>
            ))}
          </Space>
        </Card>
      )}
    </div>
  );
};
