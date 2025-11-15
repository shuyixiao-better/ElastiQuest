'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Tag, Alert, Radio, Checkbox, message, Progress } from 'antd';
import { 
  ClockCircleOutlined, 
  TrophyOutlined, 
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { ExamChallenge } from '@/data/examTopics';
import { useExamStore } from '@/stores/useExamStore';
import { Input } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ChallengeViewProps {
  challenge: ExamChallenge;
  onComplete: (score: number, timeSpent: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  challenge,
  onComplete,
  onNext,
  onPrevious
}) => {
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [code, setCode] = useState(challenge.practicalTask?.initialCode || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // 计时器
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 提交答案
  const handleSubmit = () => {
    let correct = false;
    let score = 0;

    if (challenge.type === 'single-choice') {
      correct = userAnswer === challenge.correctAnswer;
      score = correct ? challenge.points : 0;
    } else if (challenge.type === 'multiple-choice') {
      const correctAnswers = challenge.correctAnswer as string[];
      correct = JSON.stringify(userAnswer?.sort()) === JSON.stringify(correctAnswers.sort());
      score = correct ? challenge.points : 0;
    } else if (challenge.type === 'practical') {
      // 实践题需要实际执行验证
      // 这里简化处理，实际应该调用后端API执行代码
      correct = code.trim().length > 50; // 简单验证
      score = correct ? challenge.points : Math.floor(challenge.points * 0.5);
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
    setShowExplanation(true);

    if (correct) {
      message.success('回答正确！🎉');
    } else {
      message.error('回答错误，请查看解析');
    }

    onComplete(score, timeSpent);
  };

  // 重置
  const handleReset = () => {
    setUserAnswer(null);
    setCode(challenge.practicalTask?.initialCode || '');
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowHints(false);
    setShowExplanation(false);
    setTimeSpent(0);
  };

  const difficultyColors = {
    easy: 'green',
    medium: 'blue',
    hard: 'orange',
    expert: 'red'
  };

  const difficultyLabels = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
    expert: '专家'
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 挑战信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Space wrap>
              <Tag color={difficultyColors[challenge.difficulty]}>
                {difficultyLabels[challenge.difficulty]}
              </Tag>
              <Tag icon={<TrophyOutlined />}>
                {challenge.points} 分
              </Tag>
              {challenge.timeLimit && (
                <Tag icon={<ClockCircleOutlined />}>
                  建议时间: {Math.floor(challenge.timeLimit / 60)} 分钟
                </Tag>
              )}
              <Tag color="blue">
                用时: {formatTime(timeSpent)}
              </Tag>
            </Space>
          </div>

          <div>
            <Title level={3}>{challenge.title}</Title>
            <Paragraph>{challenge.description}</Paragraph>
          </div>

          {/* 题目 */}
          <Alert
            message="题目"
            description={challenge.question}
            type="info"
            showIcon
          />
        </Space>
      </Card>

      {/* 答题区域 */}
      <Card title="答题区" style={{ marginBottom: 24 }}>
        {challenge.type === 'single-choice' && (
          <Radio.Group
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={isSubmitted}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {challenge.options?.map((option, index) => (
                <Radio key={index} value={option} style={{ fontSize: 16 }}>
                  {option}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}

        {challenge.type === 'multiple-choice' && (
          <Checkbox.Group
            value={userAnswer}
            onChange={setUserAnswer}
            disabled={isSubmitted}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {challenge.options?.map((option, index) => (
                <Checkbox key={index} value={option} style={{ fontSize: 16 }}>
                  {option}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        )}

        {challenge.type === 'practical' && challenge.practicalTask && (
          <div>
            <Alert
              message="任务说明"
              description={challenge.practicalTask.instruction}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <TextArea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="在这里编写你的ES查询代码..."
              autoSize={{ minRows: 12, maxRows: 20 }}
              style={{ 
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
                fontSize: 14
              }}
              disabled={isSubmitted}
            />
          </div>
        )}
      </Card>

      {/* 提示 */}
      {challenge.hints && challenge.hints.length > 0 && (
        <Card 
          title={
            <Space>
              <BulbOutlined />
              <span>提示</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
          extra={
            <Button size="small" onClick={() => setShowHints(!showHints)}>
              {showHints ? '隐藏' : '显示'}
            </Button>
          }
        >
          {showHints && (
            <Space direction="vertical">
              {challenge.hints.map((hint, index) => (
                <Text key={index}>💡 {hint}</Text>
              ))}
            </Space>
          )}
        </Card>
      )}

      {/* 答案解析 */}
      {showExplanation && (
        <Card
          title={
            <Space>
              {isCorrect ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              )}
              <span>答案解析</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Alert
            message={isCorrect ? '回答正确！' : '回答错误'}
            description={challenge.explanation}
            type={isCorrect ? 'success' : 'error'}
            showIcon
          />
        </Card>
      )}

      {/* 操作按钮 */}
      <Card>
        <Space size="middle">
          {!isSubmitted ? (
            <>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                disabled={
                  (challenge.type !== 'practical' && !userAnswer) ||
                  (challenge.type === 'practical' && !code.trim())
                }
              >
                提交答案
              </Button>
              <Button size="large" onClick={handleReset}>
                重置
              </Button>
            </>
          ) : (
            <>
              {onNext && (
                <Button type="primary" size="large" onClick={onNext}>
                  下一题
                </Button>
              )}
              <Button size="large" onClick={handleReset}>
                再试一次
              </Button>
            </>
          )}
          
          {onPrevious && (
            <Button size="large" onClick={onPrevious}>
              上一题
            </Button>
          )}
        </Space>
      </Card>
    </div>
  );
};
