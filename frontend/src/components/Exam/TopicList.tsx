'use client';

import React, { useState } from 'react';
import { Card, List, Tag, Space, Button, Progress, Select, Input, Typography, Badge } from 'antd';
import { 
  BookOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { examTopics, categoryInfo, ExamCategory } from '@/data/examTopics';
import { useExamStore } from '@/stores/useExamStore';

const { Text, Title } = Typography;

export const TopicList: React.FC<{ onSelectTopic: (topicId: string) => void }> = ({ onSelectTopic }) => {
  const { userProgress } = useExamStore();
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  // 过滤知识点
  const filteredTopics = examTopics.filter(topic => {
    const matchCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchDifficulty = selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty;
    const matchSearch = !searchText || 
      topic.title.toLowerCase().includes(searchText.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchText.toLowerCase());
    
    return matchCategory && matchDifficulty && matchSearch;
  });

  // 按分类分组
  const groupedTopics = filteredTopics.reduce((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {} as Record<ExamCategory, typeof examTopics>);

  const difficultyColors = {
    beginner: 'green',
    intermediate: 'blue',
    advanced: 'orange',
    expert: 'red'
  };

  const difficultyLabels = {
    beginner: '入门',
    intermediate: '中级',
    advanced: '高级',
    expert: '专家'
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>
          <BookOutlined /> 知识点学习
        </Title>
        <Text type="secondary">
          系统化学习ES认证考试的所有知识点，完成练习解锁成就
        </Text>
      </Card>

      {/* 筛选器 */}
      <Card style={{ marginBottom: 24 }}>
        <Space wrap size="middle" style={{ width: '100%' }}>
          <Input
            placeholder="搜索知识点..."
            allowClear
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
          />
          
          <Select
            style={{ width: 200 }}
            placeholder="选择分类"
            value={selectedCategory}
            onChange={setSelectedCategory}
          >
            <Select.Option value="all">全部分类</Select.Option>
            {Object.entries(categoryInfo).map(([key, info]) => (
              <Select.Option key={key} value={key}>
                {info.icon} {info.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            style={{ width: 150 }}
            placeholder="选择难度"
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
          >
            <Select.Option value="all">全部难度</Select.Option>
            <Select.Option value="beginner">入门</Select.Option>
            <Select.Option value="intermediate">中级</Select.Option>
            <Select.Option value="advanced">高级</Select.Option>
            <Select.Option value="expert">专家</Select.Option>
          </Select>
        </Space>
      </Card>

      {/* 知识点列表 */}
      {Object.entries(groupedTopics).map(([category, topics]) => {
        const catInfo = categoryInfo[category as ExamCategory];
        const completedCount = topics.filter(t => 
          userProgress.completedTopics.includes(t.id)
        ).length;
        const progress = (completedCount / topics.length) * 100;

        return (
          <Card 
            key={category}
            title={
              <Space>
                <span style={{ fontSize: 24 }}>{catInfo.icon}</span>
                <span>{catInfo.name}</span>
                <Tag color={catInfo.color}>
                  {completedCount}/{topics.length}
                </Tag>
              </Space>
            }
            style={{ marginBottom: 24 }}
            extra={
              <Progress 
                type="circle" 
                percent={Math.round(progress)} 
                size={60}
                strokeColor={catInfo.color}
              />
            }
          >
            <List
              dataSource={topics}
              renderItem={(topic) => {
                const isCompleted = userProgress.completedTopics.includes(topic.id);
                const isLocked = topic.prerequisites?.some(
                  prereq => !userProgress.completedTopics.includes(prereq)
                );

                return (
                  <List.Item
                    actions={[
                      <Button
                        key="start"
                        type={isCompleted ? 'default' : 'primary'}
                        disabled={isLocked}
                        onClick={() => onSelectTopic(topic.id)}
                      >
                        {isCompleted ? '复习' : isLocked ? '🔒 未解锁' : '开始学习'}
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        isCompleted ? (
                          <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                        ) : (
                          <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                        )
                      }
                      title={
                        <Space>
                          <Text strong style={{ fontSize: 16 }}>
                            {topic.title}
                          </Text>
                          {isCompleted && <Badge status="success" text="已完成" />}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text>{topic.description}</Text>
                          <Space wrap>
                            <Tag color={difficultyColors[topic.difficulty]}>
                              {difficultyLabels[topic.difficulty]}
                            </Tag>
                            <Tag icon={<ClockCircleOutlined />}>
                              {topic.estimatedTime} 分钟
                            </Tag>
                            {topic.prerequisites && topic.prerequisites.length > 0 && (
                              <Tag color="purple">
                                需要前置知识
                              </Tag>
                            )}
                          </Space>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              关键点: {topic.keyPoints.slice(0, 3).join(' • ')}
                              {topic.keyPoints.length > 3 && '...'}
                            </Text>
                          </div>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        );
      })}

      {filteredTopics.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">没有找到匹配的知识点</Text>
          </div>
        </Card>
      )}
    </div>
  );
};
