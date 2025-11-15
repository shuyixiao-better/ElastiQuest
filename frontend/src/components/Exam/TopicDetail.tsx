'use client';

import React, { useState } from 'react';
import { Card, Button, Space, Typography, Tag, Collapse, Alert, Progress, message } from 'antd';
import { 
  BookOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  ArrowLeftOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { examTopics, categoryInfo } from '@/data/examTopics';
import { examChallenges } from '@/data/examChallenges';
import { useExamStore } from '@/stores/useExamStore';
import { ChallengeView } from './ChallengeView';

const { Title, Text, Paragraph } = Typography;

interface TopicDetailProps {
  topicId: string;
  onBack: () => void;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({ topicId, onBack }) => {
  const { userProgress, completeTopic } = useExamStore();
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  const topic = examTopics.find(t => t.id === topicId);
  if (!topic) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="知识点不存在" type="error" />
        <Button onClick={onBack} style={{ marginTop: 16 }}>返回</Button>
      </div>
    );
  }

  const categoryData = categoryInfo[topic.category];
  const isCompleted = userProgress.completedTopics.includes(topicId);
  
  // 获取相关挑战
  const relatedChallenges = examChallenges.filter(c => c.topicId === topicId);
  const completedChallengesCount = relatedChallenges.filter(
    c => userProgress.completedChallenges[c.id]
  ).length;

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

  const handleStartChallenge = () => {
    if (relatedChallenges.length > 0) {
      setShowChallenge(true);
      setCurrentChallengeIndex(0);
    } else {
      message.info('该知识点暂无挑战题目');
    }
  };

  const handleChallengeComplete = (score: number, timeSpent: number) => {
    message.success(`完成挑战！得分：${score}`);
    
    // 如果完成了所有挑战，标记知识点为已完成
    if (currentChallengeIndex === relatedChallenges.length - 1) {
      if (!isCompleted) {
        completeTopic(topicId);
        message.success('🎉 恭喜完成该知识点学习！获得 50 经验值');
      }
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < relatedChallenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
    } else {
      setShowChallenge(false);
      if (!isCompleted) {
        completeTopic(topicId);
        message.success('🎉 恭喜完成该知识点学习！获得 50 经验值');
      }
    }
  };

  const handlePreviousChallenge = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(currentChallengeIndex - 1);
    }
  };

  // 如果正在做挑战，显示挑战界面
  if (showChallenge && relatedChallenges.length > 0) {
    return (
      <div>
        <Card style={{ marginBottom: 16 }}>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => setShowChallenge(false)}
            >
              返回知识点
            </Button>
            <Text strong>
              挑战进度: {currentChallengeIndex + 1} / {relatedChallenges.length}
            </Text>
          </Space>
        </Card>
        <ChallengeView
          challenge={relatedChallenges[currentChallengeIndex]}
          onComplete={handleChallengeComplete}
          onNext={currentChallengeIndex < relatedChallenges.length - 1 ? handleNextChallenge : undefined}
          onPrevious={currentChallengeIndex > 0 ? handlePreviousChallenge : undefined}
        />
      </div>
    );
  }

  // 显示知识点详情
  return (
    <div style={{ padding: '24px' }}>
      {/* 返回按钮 */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={onBack}
        style={{ marginBottom: 16 }}
      >
        返回知识点列表
      </Button>

      {/* 知识点头部 */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Space wrap>
              <span style={{ fontSize: 32 }}>{categoryData.icon}</span>
              <Tag color={categoryData.color}>{categoryData.name}</Tag>
              <Tag color={difficultyColors[topic.difficulty]}>
                {difficultyLabels[topic.difficulty]}
              </Tag>
              <Tag icon={<ClockCircleOutlined />}>
                预计 {topic.estimatedTime} 分钟
              </Tag>
              {isCompleted && (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  已完成
                </Tag>
              )}
            </Space>
          </div>

          <div>
            <Title level={2}>{topic.title}</Title>
            <Paragraph style={{ fontSize: 16 }}>{topic.description}</Paragraph>
          </div>

          {/* 进度 */}
          {relatedChallenges.length > 0 && (
            <div>
              <Text strong>挑战完成进度：</Text>
              <Progress 
                percent={Math.round((completedChallengesCount / relatedChallenges.length) * 100)}
                status={completedChallengesCount === relatedChallenges.length ? 'success' : 'active'}
              />
              <Text type="secondary">
                已完成 {completedChallengesCount} / {relatedChallenges.length} 个挑战
              </Text>
            </div>
          )}
        </Space>
      </Card>

      {/* 关键知识点 */}
      <Card title="📌 关键知识点" style={{ marginBottom: 24 }}>
        <ul style={{ paddingLeft: 20 }}>
          {topic.keyPoints.map((point, index) => (
            <li key={index} style={{ marginBottom: 8, fontSize: 16 }}>
              {point}
            </li>
          ))}
        </ul>
      </Card>

      {/* 前置知识 */}
      {topic.prerequisites && topic.prerequisites.length > 0 && (
        <Card title="📚 前置知识" style={{ marginBottom: 24 }}>
          <Space direction="vertical">
            {topic.prerequisites.map(prereqId => {
              const prereq = examTopics.find(t => t.id === prereqId);
              const prereqCompleted = userProgress.completedTopics.includes(prereqId);
              return prereq ? (
                <div key={prereqId}>
                  {prereqCompleted ? (
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  ) : (
                    <span style={{ marginRight: 8 }}>⚪</span>
                  )}
                  <Text>{prereq.title}</Text>
                </div>
              ) : null;
            })}
          </Space>
        </Card>
      )}

      {/* 学习资料 */}
      <Card title="📖 学习资料" style={{ marginBottom: 24 }}>
        <Collapse
          items={[
            {
              key: '1',
              label: '基础概念',
              children: (
                <>
                  <Paragraph>
                    这里可以添加详细的学习资料、文档链接、视频教程等。
                  </Paragraph>
                  <Paragraph>
                    建议先阅读 <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html" target="_blank" rel="noopener noreferrer">Elasticsearch官方文档</a>
                  </Paragraph>
                </>
              )
            },
            {
              key: '2',
              label: '实践示例',
              children: (
                <Paragraph>
                  这里可以添加代码示例和实践案例。
                </Paragraph>
              )
            },
            {
              key: '3',
              label: '常见问题',
              children: (
                <Paragraph>
                  这里可以添加常见问题和解答。
                </Paragraph>
              )
            }
          ]}
        />
      </Card>

      {/* 挑战列表 */}
      {relatedChallenges.length > 0 && (
        <Card 
          title={
            <Space>
              <TrophyOutlined />
              <span>相关挑战</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {relatedChallenges.map((challenge, index) => {
              const challengeCompleted = userProgress.completedChallenges[challenge.id];
              return (
                <Card 
                  key={challenge.id}
                  size="small"
                  style={{ 
                    borderLeft: challengeCompleted ? '4px solid #52c41a' : '4px solid #d9d9d9'
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>挑战 {index + 1}:</Text>
                      <Text>{challenge.title}</Text>
                      {challengeCompleted && (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          已完成
                        </Tag>
                      )}
                    </Space>
                    <Text type="secondary">{challenge.description}</Text>
                    <Space>
                      <Tag>{challenge.type === 'single-choice' ? '单选题' : 
                            challenge.type === 'multiple-choice' ? '多选题' : 
                            challenge.type === 'practical' ? '实践题' : '代码补全'}</Tag>
                      <Tag color="gold">{challenge.points} 分</Tag>
                    </Space>
                  </Space>
                </Card>
              );
            })}
          </Space>
        </Card>
      )}

      {/* 操作按钮 */}
      <Card>
        <Space size="large">
          <Button 
            type="primary" 
            size="large"
            icon={<TrophyOutlined />}
            onClick={handleStartChallenge}
            disabled={relatedChallenges.length === 0}
          >
            {relatedChallenges.length > 0 ? '开始挑战' : '暂无挑战'}
          </Button>
          {!isCompleted && relatedChallenges.length === 0 && (
            <Button 
              size="large"
              onClick={() => {
                completeTopic(topicId);
                message.success('🎉 标记为已完成！获得 50 经验值');
              }}
            >
              标记为已完成
            </Button>
          )}
          <Button size="large" onClick={onBack}>
            返回列表
          </Button>
        </Space>
      </Card>
    </div>
  );
};
