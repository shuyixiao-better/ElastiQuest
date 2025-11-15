'use client';

import React from 'react';
import { Card, Steps, Button, Space, Tag, Typography, Row, Col, Progress } from 'antd';
import { 
  TrophyOutlined, 
  LockOutlined, 
  CheckCircleOutlined,
  RocketOutlined,
  StarOutlined
} from '@ant-design/icons';
import { examLevels } from '@/data/examTopics';
import { useExamStore } from '@/stores/useExamStore';

const { Title, Text, Paragraph } = Typography;

interface LevelMapProps {
  onStartLevel: (levelId: string) => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({ onStartLevel }) => {
  const { userProgress } = useExamStore();

  // 检查关卡是否解锁
  const isLevelUnlocked = (levelId: string) => {
    const level = examLevels.find(l => l.id === levelId);
    if (!level) return false;

    const { unlockCondition } = level;
    
    // 检查等级要求
    if (unlockCondition.minLevel && userProgress.level < unlockCondition.minLevel) {
      return false;
    }

    // 检查前置关卡
    if (unlockCondition.completedLevels) {
      const allCompleted = unlockCondition.completedLevels.every(
        id => userProgress.completedLevels.includes(id)
      );
      if (!allCompleted) return false;
    }

    // 检查分数要求
    if (unlockCondition.minScore) {
      // 这里简化处理，实际应该检查平均分
      if (userProgress.stats.successRate < unlockCondition.minScore) {
        return false;
      }
    }

    return true;
  };

  // 检查关卡是否完成
  const isLevelCompleted = (levelId: string) => {
    return userProgress.completedLevels.includes(levelId);
  };

  // 计算关卡进度
  const getLevelProgress = (levelId: string) => {
    const level = examLevels.find(l => l.id === levelId);
    if (!level) return 0;

    const completedTopics = level.requiredTopics.filter(
      topicId => userProgress.completedTopics.includes(topicId)
    );
    return (completedTopics.length / level.requiredTopics.length) * 100;
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>
          <RocketOutlined /> 闯关地图
        </Title>
        <Paragraph>
          完成每个关卡的所有知识点学习和挑战，解锁成就和称号！
        </Paragraph>
      </Card>

      {/* 关卡列表 */}
      <Row gutter={[16, 16]}>
        {examLevels.map((level, index) => {
          const unlocked = isLevelUnlocked(level.id);
          const completed = isLevelCompleted(level.id);
          const progress = getLevelProgress(level.id);

          return (
            <Col xs={24} lg={12} key={level.id}>
              <Card
                style={{
                  borderColor: completed ? '#52c41a' : unlocked ? '#1890ff' : '#d9d9d9',
                  borderWidth: 2,
                  opacity: unlocked ? 1 : 0.6
                }}
                hoverable={unlocked}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {/* 关卡头部 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Space>
                      <div style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: completed ? '#52c41a' : unlocked ? '#1890ff' : '#d9d9d9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        color: 'white'
                      }}>
                        {completed ? <CheckCircleOutlined /> : unlocked ? index + 1 : <LockOutlined />}
                      </div>
                      <div>
                        <Title level={4} style={{ marginBottom: 4 }}>
                          {level.name}
                        </Title>
                        <Text type="secondary">{level.description}</Text>
                      </div>
                    </Space>
                  </div>

                  {/* 进度条 */}
                  {unlocked && !completed && (
                    <div>
                      <Text type="secondary">完成进度</Text>
                      <Progress 
                        percent={Math.round(progress)} 
                        status={progress === 100 ? 'success' : 'active'}
                      />
                    </div>
                  )}

                  {/* 要求 */}
                  <div>
                    <Text strong>必修知识点: </Text>
                    <Text>{level.requiredTopics.length} 个</Text>
                  </div>

                  <div>
                    <Text strong>挑战数量: </Text>
                    <Text>{level.challenges.length} 个</Text>
                  </div>

                  {/* 解锁条件 */}
                  {!unlocked && (
                    <div>
                      <Text type="secondary">解锁条件:</Text>
                      <Space direction="vertical" size="small" style={{ marginTop: 8 }}>
                        {level.unlockCondition.minLevel && (
                          <Tag color="blue">
                            需要等级 {level.unlockCondition.minLevel}
                            {userProgress.level < level.unlockCondition.minLevel && 
                              ` (当前 ${userProgress.level})`
                            }
                          </Tag>
                        )}
                        {level.unlockCondition.completedLevels && (
                          <Tag color="purple">
                            完成前置关卡
                          </Tag>
                        )}
                        {level.unlockCondition.minScore && (
                          <Tag color="orange">
                            成功率达到 {level.unlockCondition.minScore}%
                          </Tag>
                        )}
                      </Space>
                    </div>
                  )}

                  {/* 奖励 */}
                  <div>
                    <Text strong>奖励:</Text>
                    <Space wrap style={{ marginTop: 8 }}>
                      <Tag color="gold" icon={<StarOutlined />}>
                        +{level.rewards.experience} 经验
                      </Tag>
                      {level.rewards.badge && (
                        <Tag color="purple">
                          徽章: {level.rewards.badge}
                        </Tag>
                      )}
                      {level.rewards.title && (
                        <Tag color="cyan">
                          称号: {level.rewards.title}
                        </Tag>
                      )}
                    </Space>
                  </div>

                  {/* 操作按钮 */}
                  <Button
                    type={completed ? 'default' : 'primary'}
                    size="large"
                    block
                    disabled={!unlocked}
                    icon={completed ? <CheckCircleOutlined /> : <TrophyOutlined />}
                    onClick={() => onStartLevel(level.id)}
                  >
                    {completed ? '已完成 - 重新挑战' : unlocked ? '开始挑战' : '🔒 未解锁'}
                  </Button>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 进度总览 */}
      <Card title="🎯 总体进度" style={{ marginTop: 24 }}>
        <Steps
          current={userProgress.completedLevels.length}
          items={examLevels.map((level, index) => ({
            title: level.name,
            description: isLevelCompleted(level.id) ? '已完成' : isLevelUnlocked(level.id) ? '进行中' : '未解锁',
            status: isLevelCompleted(level.id) ? 'finish' : isLevelUnlocked(level.id) ? 'process' : 'wait',
            icon: isLevelCompleted(level.id) ? <CheckCircleOutlined /> : 
                  isLevelUnlocked(level.id) ? <TrophyOutlined /> : <LockOutlined />
          }))}
        />
      </Card>
    </div>
  );
};
