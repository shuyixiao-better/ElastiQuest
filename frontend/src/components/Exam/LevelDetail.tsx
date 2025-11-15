'use client';

import React, { useState } from 'react';
import { Card, Button, Space, Typography, Tag, Progress, List, Alert, message } from 'antd';
import { 
  ArrowLeftOutlined, 
  TrophyOutlined, 
  CheckCircleOutlined,
  BookOutlined,
  StarOutlined
} from '@ant-design/icons';
import { examLevels, examTopics } from '@/data/examTopics';
import { examChallenges } from '@/data/examChallenges';
import { useExamStore } from '@/stores/useExamStore';
import { ChallengeView } from './ChallengeView';

const { Title, Text, Paragraph } = Typography;

interface LevelDetailProps {
  levelId: string;
  onBack: () => void;
}

export const LevelDetail: React.FC<LevelDetailProps> = ({ levelId, onBack }) => {
  const { userProgress, completeLevel } = useExamStore();
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  const level = examLevels.find(l => l.id === levelId);
  if (!level) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="关卡不存在" type="error" />
        <Button onClick={onBack} style={{ marginTop: 16 }}>返回</Button>
      </div>
    );
  }

  const isCompleted = userProgress.completedLevels.includes(levelId);
  
  // 获取必修知识点
  const requiredTopics = level.requiredTopics.map(id => examTopics.find(t => t.id === id)!).filter(Boolean);
  const completedTopicsCount = requiredTopics.filter(t => 
    userProgress.completedTopics.includes(t.id)
  ).length;
  
  // 获取关卡挑战
  const levelChallenges = level.challenges.map(id => examChallenges.find(c => c.id === id)!).filter(Boolean);
  const completedChallengesCount = levelChallenges.filter(c => 
    userProgress.completedChallenges[c.id]
  ).length;

  const canComplete = completedTopicsCount === requiredTopics.length && 
                      completedChallengesCount === levelChallenges.length;

  const handleStartChallenge = () => {
    if (levelChallenges.length > 0) {
      setShowChallenge(true);
      setCurrentChallengeIndex(0);
    } else {
      message.info('该关卡暂无挑战题目');
    }
  };

  const handleChallengeComplete = (score: number, timeSpent: number) => {
    message.success(`完成挑战！得分：${score}`);
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < levelChallenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
    } else {
      setShowChallenge(false);
      // 检查是否可以完成关卡
      if (canComplete && !isCompleted) {
        completeLevel(levelId, level.rewards);
        message.success(`🎉 恭喜完成关卡！获得 ${level.rewards.experience} 经验值`);
        if (level.rewards.badge) {
          message.success(`🏆 解锁成就：${level.rewards.badge}`);
        }
      }
    }
  };

  const handlePreviousChallenge = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(currentChallengeIndex - 1);
    }
  };

  const handleCompleteLevel = () => {
    if (canComplete && !isCompleted) {
      completeLevel(levelId, level.rewards);
      message.success(`🎉 恭喜完成关卡！获得 ${level.rewards.experience} 经验值`);
      if (level.rewards.badge) {
        message.success(`🏆 解锁成就：${level.rewards.badge}`);
      }
      if (level.rewards.title) {
        message.success(`👑 获得称号：${level.rewards.title}`);
      }
    }
  };

  // 如果正在做挑战，显示挑战界面
  if (showChallenge && levelChallenges.length > 0) {
    return (
      <div>
        <Card style={{ marginBottom: 16 }}>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => setShowChallenge(false)}
            >
              返回关卡
            </Button>
            <Text strong>
              挑战进度: {currentChallengeIndex + 1} / {levelChallenges.length}
            </Text>
          </Space>
        </Card>
        <ChallengeView
          challenge={levelChallenges[currentChallengeIndex]}
          onComplete={handleChallengeComplete}
          onNext={currentChallengeIndex < levelChallenges.length - 1 ? handleNextChallenge : undefined}
          onPrevious={currentChallengeIndex > 0 ? handlePreviousChallenge : undefined}
        />
      </div>
    );
  }

  // 显示关卡详情
  return (
    <div style={{ padding: '24px' }}>
      {/* 返回按钮 */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={onBack}
        style={{ marginBottom: 16 }}
      >
        返回闯关地图
      </Button>

      {/* 关卡头部 */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Space wrap>
              <TrophyOutlined style={{ fontSize: 48, color: '#faad14' }} />
              {isCompleted && (
                <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: 16 }}>
                  已完成
                </Tag>
              )}
            </Space>
          </div>

          <div>
            <Title level={2}>{level.name}</Title>
            <Paragraph style={{ fontSize: 16 }}>{level.description}</Paragraph>
          </div>

          {/* 奖励 */}
          <div>
            <Text strong style={{ fontSize: 16 }}>关卡奖励：</Text>
            <div style={{ marginTop: 8 }}>
              <Space wrap>
                <Tag color="gold" icon={<StarOutlined />} style={{ fontSize: 14, padding: '4px 12px' }}>
                  +{level.rewards.experience} 经验
                </Tag>
                {level.rewards.badge && (
                  <Tag color="purple" style={{ fontSize: 14, padding: '4px 12px' }}>
                    徽章: {level.rewards.badge}
                  </Tag>
                )}
                {level.rewards.title && (
                  <Tag color="cyan" style={{ fontSize: 14, padding: '4px 12px' }}>
                    称号: {level.rewards.title}
                  </Tag>
                )}
              </Space>
            </div>
          </div>
        </Space>
      </Card>

      {/* 必修知识点 */}
      <Card 
        title={
          <Space>
            <BookOutlined />
            <span>必修知识点</span>
            <Tag color="blue">{completedTopicsCount}/{requiredTopics.length}</Tag>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Progress 
          percent={Math.round((completedTopicsCount / requiredTopics.length) * 100)}
          status={completedTopicsCount === requiredTopics.length ? 'success' : 'active'}
          style={{ marginBottom: 16 }}
        />
        <List
          dataSource={requiredTopics}
          renderItem={(topic) => {
            const completed = userProgress.completedTopics.includes(topic.id);
            return (
              <List.Item>
                <Space>
                  {completed ? (
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                  ) : (
                    <span style={{ fontSize: 20 }}>⚪</span>
                  )}
                  <Text strong={!completed}>{topic.title}</Text>
                  {completed && <Tag color="success">已完成</Tag>}
                </Space>
              </List.Item>
            );
          }}
        />
      </Card>

      {/* 关卡挑战 */}
      <Card 
        title={
          <Space>
            <TrophyOutlined />
            <span>关卡挑战</span>
            <Tag color="orange">{completedChallengesCount}/{levelChallenges.length}</Tag>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Progress 
          percent={Math.round((completedChallengesCount / levelChallenges.length) * 100)}
          status={completedChallengesCount === levelChallenges.length ? 'success' : 'active'}
          style={{ marginBottom: 16 }}
        />
        <List
          dataSource={levelChallenges}
          renderItem={(challenge, index) => {
            const completed = userProgress.completedChallenges[challenge.id];
            return (
              <List.Item>
                <Space>
                  {completed ? (
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                  ) : (
                    <span style={{ fontSize: 20 }}>⚪</span>
                  )}
                  <Text strong={!completed}>挑战 {index + 1}: {challenge.title}</Text>
                  {completed && <Tag color="success">已完成</Tag>}
                  <Tag color="gold">{challenge.points} 分</Tag>
                </Space>
              </List.Item>
            );
          }}
        />
      </Card>

      {/* 完成提示 */}
      {!canComplete && (
        <Alert
          message="完成条件"
          description={
            <div>
              <p>完成该关卡需要：</p>
              <ul>
                <li>完成所有必修知识点 ({completedTopicsCount}/{requiredTopics.length})</li>
                <li>完成所有关卡挑战 ({completedChallengesCount}/{levelChallenges.length})</li>
              </ul>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {canComplete && !isCompleted && (
        <Alert
          message="🎉 恭喜！"
          description="你已经完成了所有要求，可以完成该关卡了！"
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* 操作按钮 */}
      <Card>
        <Space size="large">
          <Button 
            type="primary" 
            size="large"
            icon={<TrophyOutlined />}
            onClick={handleStartChallenge}
            disabled={levelChallenges.length === 0}
          >
            {levelChallenges.length > 0 ? '开始挑战' : '暂无挑战'}
          </Button>
          {canComplete && !isCompleted && (
            <Button 
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleCompleteLevel}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              完成关卡
            </Button>
          )}
          <Button size="large" onClick={onBack}>
            返回地图
          </Button>
        </Space>
      </Card>
    </div>
  );
};
